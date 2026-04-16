import { useEffect, useRef } from "react";
import { marketApi } from "../../../lib/matching-api.js";
import { ApiError } from "../../../lib/http.js";
import { alertErrorMessage } from "../CustomAlertMessage/index.js";
import { useMarketDataStore } from "../stores/marketDataStore.js";

// ---------------------------------------------------------------------------
// Internal helpers (duplicated here so callers don't need to import them)
// ---------------------------------------------------------------------------

function toErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof ApiError) {
        const parts = [err.message || fallback];
        if (err.code) parts.push(`[${err.code}]`);
        else if (err.status) parts.push(`(${err.status})`);
        return parts.join(' ');
    }
    if (err instanceof Error && err.message) return err.message;
    return fallback;
}

function parseLevel(lvl: any) {
    const price = Array.isArray(lvl) ? lvl[0] : (lvl?.price ?? lvl?.p);
    const qty = Array.isArray(lvl) ? lvl[1] : (lvl?.quantity ?? lvl?.qty ?? lvl?.q);
    return {
        price: parseFloat(price),
        quantity: parseFloat(qty),
        remaining: parseFloat(qty),
    };
}

function finite(r: { price: number; quantity: number }) {
    return Number.isFinite(r.price) && Number.isFinite(r.quantity);
}

const MAX_BOOK_LEVELS = 50;

/**
 * Merge a local:depth delta into an existing book side. Each event carries
 * only the price levels that changed — quantity 0 means "remove this level",
 * any other quantity replaces whatever was there. Returns the new top-50
 * sorted array (bids descending, asks ascending).
 */
function mergeDepthSide(
    current: Array<{ price: number; quantity: number; remaining: number }>,
    delta: any[],
    side: "bids" | "asks",
) {
    const map = new Map<string, number>();
    for (const lvl of current) map.set(String(lvl.price), lvl.quantity);

    for (const raw of delta) {
        const priceRaw = Array.isArray(raw) ? raw[0] : (raw?.price ?? raw?.p);
        const qtyRaw = Array.isArray(raw) ? raw[1] : (raw?.quantity ?? raw?.qty ?? raw?.q);
        const priceNum = parseFloat(priceRaw);
        const qtyNum = parseFloat(qtyRaw);
        if (!Number.isFinite(priceNum)) continue;
        const key = String(priceNum);
        if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
            map.delete(key); // qty 0 or invalid → remove level
        } else {
            map.set(key, qtyNum);
        }
    }

    const rows = Array.from(map.entries()).map(([priceStr, qty]) => ({
        price: parseFloat(priceStr),
        quantity: qty,
        remaining: qty,
    }));
    if (side === "bids") rows.sort((a, b) => b.price - a.price);
    else rows.sort((a, b) => a.price - b.price);
    return rows.slice(0, MAX_BOOK_LEVELS);
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useMarketData(
    SelectedCoin: any,
    getSocket: () => any,
    isConnected: boolean,
    currentUserId?: string | null,
    onUserTrade?: () => void,
) {
    const {
        BuyOrders, setBuyOrders,
        SellOrders, setSellOrders,
        RecentTrade, setRecentTrade,
        loader, setloader,
        buyprice, setbuyprice,
        sellPrice, setsellPrice,
        priceChange, setpriceChange,
        changesHour, setChangesHour,
        priceHigh, setpriceHigh,
        priceLow, setpriceLow,
        volume, setvolume,
        isPricePositive, setIsPricePositive,
    } = useMarketDataStore();

    // Stable ref so socket handlers can read latest price without triggering re-subscription.
    const buypriceRef = useRef(buyprice);
    useEffect(() => { buypriceRef.current = buyprice; }, [buyprice]);

    // -----------------------------------------------------------------------
    // REST: seed initial state on mount / pair switch. After that, the socket
    // owns depth + trades — polling resumes only as a fallback when the socket
    // is disconnected (guests, network drop, auth expired). Ticker (24h stats)
    // stays on a slow poll because the local matching engine doesn't emit it.
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!SelectedCoin?.base_currency || !SelectedCoin?.quote_currency) return undefined;
        const symbol = `${SelectedCoin.base_currency}-${SelectedCoin.quote_currency}`;
        let cancelled = false;
        let loggedDepth = false;
        let loggedTrades = false;
        let loggedTicker = false;
        let toastedDepth = false;
        let toastedTrades = false;
        let toastedTicker = false;

        const pullDepth = async () => {
            try {
                const depth = await marketApi.depth(symbol, MAX_BOOK_LEVELS, 0);
                if (cancelled) return;
                if (!loggedDepth) { console.log('[Trade] depth raw:', depth); loggedDepth = true; }
                // REST returns a full snapshot — replace wholesale.
                const bids = (depth?.bids ?? []).map(parseLevel).filter(finite);
                const asks = (depth?.asks ?? []).map(parseLevel).filter(finite);
                setBuyOrders(bids);
                setSellOrders(asks);
                setloader(false);
            } catch (err) {
                if (!toastedDepth) { alertErrorMessage(toErrorMessage(err, 'Depth failed')); toastedDepth = true; }
            }
        };

        const pullTrades = async () => {
            try {
                const trades = await marketApi.trades(symbol, 50);
                if (cancelled) return;
                if (!loggedTrades) { console.log('[Trade] trades raw:', trades); loggedTrades = true; }
                if (Array.isArray(trades)) {
                    setRecentTrade(
                        trades
                            .map((t: any) => {
                                const ts = t.timestamp ?? t.time ?? t.T ?? t.createdAt;
                                return {
                                    side: t.takerSide ?? t.side ?? (t.isBuyerMaker || t.m ? 'SELL' : 'BUY'),
                                    price: parseFloat(t.price ?? t.p),
                                    quantity: parseFloat(t.quantity ?? t.qty ?? t.q),
                                    time: new Date(ts ?? Date.now()).toLocaleTimeString('en-US', { hour12: false }),
                                };
                            })
                            .filter((r) => Number.isFinite(r.price) && Number.isFinite(r.quantity))
                    );
                }
            } catch (err) {
                if (!toastedTrades) { alertErrorMessage(toErrorMessage(err, 'Trades failed')); toastedTrades = true; }
            }
        };

        const pullTicker = async () => {
            try {
                const raw = await marketApi.ticker(symbol);
                if (cancelled) return;
                if (!loggedTicker) { console.log('[Trade] ticker raw:', raw); loggedTicker = true; }
                const t = raw as any;
                // Server field is `last` on newer builds, `lastPrice` on older.
                const last = t.last ?? t.lastPrice ?? t.close ?? t.c;
                const ask = t.bestAsk ?? t.ask ?? t.a;
                const pct = t.priceChangePercent ?? t.changePercent ?? t.P;
                const chg = t.priceChange ?? t.change ?? t.p;
                const high = t.high ?? t.h ?? t.highPrice;
                const low = t.low ?? t.l ?? t.lowPrice;
                const vol = t.volume ?? t.v ?? t.baseVolume;
                // Only overwrite with finite positive values — empty strings
                // from the server would parseFloat to NaN and clobber the
                // referencePrice seeded from /pairs on initial render.
                const setIfPos = (v: any, setter: (n: number) => void) => {
                    if (v == null) return;
                    const n = parseFloat(v);
                    if (Number.isFinite(n) && n > 0) setter(n);
                };
                const setIfFinite = (v: any, setter: (n: number) => void) => {
                    if (v == null) return;
                    const n = parseFloat(v);
                    if (Number.isFinite(n)) setter(n);
                };
                setIfPos(last, setbuyprice);
                setIfPos(ask, setsellPrice);
                setIfFinite(pct, setpriceChange);
                setIfFinite(chg, setChangesHour);
                setIfPos(high, setpriceHigh);
                setIfPos(low, setpriceLow);
                setIfFinite(vol, setvolume);
            } catch (err) {
                if (!toastedTicker) { alertErrorMessage(toErrorMessage(err, 'Ticker failed')); toastedTicker = true; }
            }
        };

        // Initial seed — runs once on mount and again on pair switch.
        pullDepth();
        pullTrades();
        pullTicker();

        // Live updates:
        //  - depth + trades come from local:depth / local:trade socket events
        //    (handled by the socket effect below). Poll only as a fallback when
        //    the socket is disconnected, otherwise the poll OVERWRITES live data.
        //  - ticker (24h stats) is not emitted by the local matching engine,
        //    so keep a slow poll regardless of socket state.
        const depthId  = isConnected ? undefined : window.setInterval(pullDepth, 2_000);
        const tradesId = isConnected ? undefined : window.setInterval(pullTrades, 5_000);
        const tickerId = window.setInterval(pullTicker, 10_000);

        return () => {
            cancelled = true;
            if (depthId  !== undefined) window.clearInterval(depthId);
            if (tradesId !== undefined) window.clearInterval(tradesId);
            window.clearInterval(tickerId);
        };
    }, [SelectedCoin?.base_currency, SelectedCoin?.quote_currency, isConnected]);

    // -----------------------------------------------------------------------
    // Real-time updates via Socket.IO (matching-service local channels).
    // 24 h ticker stats still come from REST polling above.
    // -----------------------------------------------------------------------
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !isConnected || !SelectedCoin) return undefined;

        const localSymbol = `${SelectedCoin.base_currency}-${SelectedCoin.quote_currency}`;

        console.log('[Trade] Subscribing local socket channels for', localSymbol, '| socket id:', socket.id);

        socket.emit('subscribe', { channel: 'local_trade', symbol: localSymbol });
        socket.emit('subscribe', { channel: 'local_depth', symbol: localSymbol });

        setloader(false);

        let loggedTrade = false;
        let loggedDepth = false;

        const localTradeEvent = `local:trade:${localSymbol}`;
        const handleLocalTrade = (event: any) => {
            const e = event?.payload ?? event;
            if (!loggedTrade) { console.log('[Trade] local_trade event sample:', e); loggedTrade = true; }
            const price = parseFloat(e.price ?? e.p);
            if (Number.isFinite(price)) {
                setIsPricePositive(price >= buypriceRef.current);
                setbuyprice(price);
            }
            setRecentTrade((prev) => [
                {
                    side: e.takerSide ?? e.side ?? (e.isBuyerMaker || e.m ? 'SELL' : 'BUY'),
                    price,
                    quantity: parseFloat(e.quantity ?? e.qty ?? e.q),
                    time: new Date(e.timestamp ?? e.time ?? e.T ?? Date.now()).toLocaleTimeString('en-US', { hour12: false }),
                },
                ...prev.slice(0, 49),
            ]);

            // If this trade involves the current user, refresh orders + balances.
            // Private channels (user:order:*, user:balance:*) aren't implemented
            // yet, so we pull REST as the stand-in. Server may populate one of
            // several fields — check all common shapes.
            if (currentUserId && onUserTrade) {
                const involved =
                    (Array.isArray(e.userIds) && e.userIds.includes(currentUserId)) ||
                    e.buyerUserId === currentUserId ||
                    e.sellerUserId === currentUserId ||
                    e.takerUserId === currentUserId ||
                    e.makerUserId === currentUserId ||
                    e.userId === currentUserId;
                if (involved) onUserTrade();
            }
        };
        socket.on(localTradeEvent, handleLocalTrade);

        const localDepthEvent = `local:depth:${localSymbol}`;
        const handleLocalDepth = (event: any) => {
            const e = event?.payload ?? event;
            if (!loggedDepth) {
                console.log('[Trade] local_depth event sample:', {
                    bid0: e?.bids?.[0],
                    ask0: e?.asks?.[0],
                });
                loggedDepth = true;
            }
            // local:depth events are DELTAS — only the changed price levels.
            // Merge them into the existing book; qty 0 means remove.
            if (Array.isArray(e?.bids)) {
                setBuyOrders((prev) => mergeDepthSide(prev, e.bids, 'bids'));
            }
            if (Array.isArray(e?.asks)) {
                setSellOrders((prev) => mergeDepthSide(prev, e.asks, 'asks'));
            }
        };

        socket.on(localDepthEvent, handleLocalDepth);

        return () => {
            socket.emit('unsubscribe', { channel: 'local_trade', symbol: localSymbol });
            socket.emit('unsubscribe', { channel: 'local_depth', symbol: localSymbol });
            socket.off(localTradeEvent, handleLocalTrade);
            socket.off(localDepthEvent, handleLocalDepth);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SelectedCoin?.base_currency, SelectedCoin?.quote_currency, isConnected]);

    return {
        BuyOrders, setBuyOrders,
        SellOrders, setSellOrders,
        RecentTrade, setRecentTrade,
        loader, setloader,
        buyprice, setbuyprice,
        sellPrice, setsellPrice,
        priceChange, setpriceChange,
        changesHour, setChangesHour,
        priceHigh, setpriceHigh,
        priceLow, setpriceLow,
        volume, setvolume,
        isPricePositive, setIsPricePositive,
    };
}

export type MarketData = ReturnType<typeof useMarketData>;
