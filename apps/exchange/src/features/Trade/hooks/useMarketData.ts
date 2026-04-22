import { useEffect, useRef, useState } from "react";
import { marketApi, pairsApi, binanceMarketApi } from "../../../lib/matching-api.js";
import { ApiError } from "../../../lib/http.js";
import { alertErrorMessage } from "../CustomAlertMessage/index.js";
import { useMarketDataStore } from "../stores/marketDataStore.js";

/**
 * For GLOBAL pairs the ticker is sourced from Binance via the
 * market-data-service proxy/multiplexer. The WS event arrives on the
 * generic `data` channel as a DataEnvelope — we filter by channel +
 * symbol and map Binance's single-letter field names to the same
 * setters used by the LOCAL path so downstream components don't care.
 */
type Availability = 'LOCAL' | 'GLOBAL';

/** Binance symbol form — no dash. "BTC-USDT" → "BTCUSDT". */
function toBinanceSymbol(base: string, quote: string): string {
    return `${base}${quote}`.toUpperCase();
}

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

    // Resolved per-pair availability. GLOBAL pairs have their 24h ticker
    // streamed from Binance (via market-data-service's multiplexer);
    // LOCAL pairs use our matching engine's local:ticker events. We
    // default to LOCAL and flip on pair lookup so a slow /pairs call
    // doesn't delay the initial render of LOCAL pairs.
    const [availability, setAvailability] = useState<Availability>('LOCAL');
    useEffect(() => {
        if (!SelectedCoin?.base_currency || !SelectedCoin?.quote_currency) return undefined;
        const symbol = `${SelectedCoin.base_currency}-${SelectedCoin.quote_currency}`;
        let cancelled = false;
        const controller = new AbortController();
        pairsApi
            .get(symbol, controller.signal)
            .then((pair) => {
                if (cancelled) return;
                setAvailability(pair?.availability === 'GLOBAL' ? 'GLOBAL' : 'LOCAL');
            })
            .catch(() => {
                // Pair lookup failed — stick with LOCAL default.
                if (!cancelled) setAvailability('LOCAL');
            });
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [SelectedCoin?.base_currency, SelectedCoin?.quote_currency]);

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

        // Map either AGCE or Binance ticker payload → state setters.
        // Binance uses single-letter field names in its WS frames, but
        // the REST /ticker/24hr response uses the longer form
        // (lastPrice, priceChangePercent, highPrice, ...). Both are
        // handled below.
        const applyTickerSeed = (t: any) => {
            const last = t.last ?? t.lastPrice ?? t.close ?? t.c;
            const ask = t.bestAsk ?? t.ask ?? t.a ?? t.askPrice;
            const pct = t.priceChangePercent ?? t.changePercent ?? t.P;
            const chg = t.priceChange ?? t.change ?? t.p;
            const high = t.high ?? t.h ?? t.highPrice;
            const low = t.low ?? t.l ?? t.lowPrice;
            const vol = t.volume ?? t.v ?? t.baseVolume;
            setIfPos(last, setbuyprice);
            setIfPos(ask, setsellPrice);
            setIfFinite(pct, setpriceChange);
            setIfFinite(chg, setChangesHour);
            setIfPos(high, setpriceHigh);
            setIfPos(low, setpriceLow);
            setIfFinite(vol, setvolume);
        };

        const pullTicker = async () => {
            try {
                // GLOBAL pairs have no AGCE ticker to return — pull the
                // 24h stats from Binance via market-data-service so the
                // strip shows real values on first paint instead of a
                // zero-flash that gets overwritten by the first WS tick.
                const raw =
                    availability === 'GLOBAL'
                        ? await binanceMarketApi.ticker24h(symbol)
                        : await marketApi.ticker(symbol);
                if (cancelled) return;
                if (!loggedTicker) { console.log('[Trade]', availability, 'ticker raw:', raw); loggedTicker = true; }
                applyTickerSeed(raw as any);
            } catch (err) {
                if (!toastedTicker) { alertErrorMessage(toErrorMessage(err, 'Ticker failed')); toastedTicker = true; }
            }
        };

        // Initial seed — runs once on mount, again on pair switch, and
        // again when availability resolves (LOCAL default → GLOBAL after
        // /pairs responds). After this, socket events own live updates.
        pullDepth();
        pullTrades();
        pullTicker();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SelectedCoin?.base_currency, SelectedCoin?.quote_currency, availability]);

    // -----------------------------------------------------------------------
    // Real-time updates via Socket.IO (matching-service local channels).
    // 24 h ticker stats still come from REST polling above.
    // -----------------------------------------------------------------------
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !isConnected || !SelectedCoin) return undefined;

        const localSymbol = `${SelectedCoin.base_currency}-${SelectedCoin.quote_currency}`;

        console.log('[Trade] Subscribing local socket channels for', localSymbol, '| socket id:', socket.id);

        // Depth + trade tape always come from AGCE — the user is placing
        // real orders against the local matching engine regardless of
        // whether the pair's chart/ticker pulls from Binance.
        socket.emit('subscribe', { channel: 'local_trade', symbol: localSymbol });
        socket.emit('subscribe', { channel: 'local_depth', symbol: localSymbol });

        // Ticker source depends on pair availability:
        //   LOCAL  → local:ticker:<SYM>  (matching-service recomputes per trade)
        //   GLOBAL → Binance `ticker` via market-data-service multiplexer —
        //            arrives on the generic `data` envelope.
        const binanceSymbol = toBinanceSymbol(SelectedCoin.base_currency, SelectedCoin.quote_currency);
        if (availability === 'GLOBAL') {
            socket.emit('subscribe', { channel: 'ticker', symbol: binanceSymbol });
        } else {
            socket.emit('subscribe', { channel: 'local_ticker', symbol: localSymbol });
        }

        // 1m kline → drives the mid-price row's green/red colour and
        // ↑/↓ arrow. Close-vs-open of the CURRENT bar is what "is this
        // candle green or red right now" maps to — same polarity the
        // chart shows. Subscribing here keeps this hook self-contained;
        // the chart/streaming module subscribes independently.
        const klineInterval = '1m';
        if (availability === 'GLOBAL') {
            socket.emit('subscribe', {
                channel: 'kline',
                symbol: binanceSymbol,
                interval: klineInterval,
            });
        } else {
            socket.emit('subscribe', {
                channel: 'local_kline',
                symbol: localSymbol,
                interval: klineInterval,
            });
        }

        setloader(false);

        let loggedTrade = false;
        let loggedDepth = false;
        let loggedTicker = false;

        const localTradeEvent = `local:trade:${localSymbol}`;
        const handleLocalTrade = (event: any) => {
            const e = event?.payload ?? event;
            if (!loggedTrade) { console.log('[Trade] local_trade event sample:', e); loggedTrade = true; }
            const price = parseFloat(e.price ?? e.p);
            if (Number.isFinite(price)) {
                // Polarity (green/red + arrow) is owned by the kline
                // subscription below, not trade-tick updates, so the
                // colour matches the in-progress 1m candle. We still
                // update `buyprice` here for the mid-price row.
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
            // Each local:depth event is a FULL top-N snapshot, not a delta —
            // matching-service's publishDepthTick serialises the whole book
            // (see matching_service/src/events/producers/depth.producer.ts).
            // Merging would leave cancelled/removed price levels behind, so
            // replace each side wholesale. Sort bids desc, asks asc, slice
            // to the top 50 rows the UI can render.
            if (Array.isArray(e?.bids)) {
                const rows = e.bids.map(parseLevel).filter(finite);
                rows.sort((a: { price: number }, b: { price: number }) => b.price - a.price);
                setBuyOrders(rows.slice(0, MAX_BOOK_LEVELS));
            }
            if (Array.isArray(e?.asks)) {
                const rows = e.asks.map(parseLevel).filter(finite);
                rows.sort((a: { price: number }, b: { price: number }) => a.price - b.price);
                setSellOrders(rows.slice(0, MAX_BOOK_LEVELS));
            }
        };

        socket.on(localDepthEvent, handleLocalDepth);

        // Shared ticker setter — used by both LOCAL and GLOBAL handlers
        // so downstream state stays identical regardless of source.
        // Accepts both AGCE (`last`, `priceChangePercent`, ...) and
        // Binance (`c`, `P`, `p`, ...) single-letter field names.
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
        const applyTicker = (e: any) => {
            setIfPos(e.last ?? e.lastPrice ?? e.close ?? e.c, setbuyprice);
            setIfPos(e.bestAsk ?? e.ask ?? e.a, setsellPrice);
            setIfFinite(e.priceChangePercent ?? e.changePercent ?? e.P, setpriceChange);
            setIfFinite(e.priceChange ?? e.change ?? e.p, setChangesHour);
            setIfPos(e.high ?? e.h ?? e.highPrice, setpriceHigh);
            setIfPos(e.low ?? e.l ?? e.lowPrice, setpriceLow);
            setIfFinite(e.volume ?? e.v ?? e.baseVolume, setvolume);
            // Note: `isPricePositive` is NOT set here. It's driven
            // exclusively by the current 1m bar's close-vs-open via the
            // kline subscription below — that matches the green/red
            // colour of the in-progress candle on the chart.
        };

        // LOCAL path — per-symbol event name emitted by market-data-service
        // after recomputing from local trades.
        const localTickerEvent = `local:ticker:${localSymbol}`;
        const handleLocalTicker = (event: any) => {
            const e = event?.payload ?? event;
            if (!loggedTicker) { console.log('[Trade] local_ticker event sample:', e); loggedTicker = true; }
            applyTicker(e);
        };

        // GLOBAL path — Binance forwards wrap every tick in a single
        // `data` envelope { channel, symbol, payload, ... }. We filter
        // by channel + symbol so subscriptions for other symbols on
        // this socket don't leak into this chart.
        const handleBinanceData = (envelope: any) => {
            if (envelope?.channel !== 'ticker') return;
            if (envelope?.symbol && envelope.symbol !== binanceSymbol) return;
            const e = envelope?.payload ?? envelope;
            if (!loggedTicker) { console.log('[Trade] binance ticker event sample:', e); loggedTicker = true; }
            applyTicker(e);
        };

        if (availability === 'GLOBAL') {
            socket.on('data', handleBinanceData);
        } else {
            socket.on(localTickerEvent, handleLocalTicker);
        }

        // 1m kline handler. Fires on every tick update to the current
        // bar (both LOCAL and GLOBAL paths); we only read open + close
        // and set isPricePositive from their relationship. Binance
        // wraps the candle under `k`; our local emitter uses the same
        // shape — so a single unwrap works for both.
        const localKlineEvent = `local:kline:${localSymbol}:${klineInterval}`;
        let loggedKline = false;
        const applyKlinePolarity = (frame: any) => {
            const k = frame?.k ?? frame;
            const open = parseFloat(k?.o ?? k?.open);
            const close = parseFloat(k?.c ?? k?.close);
            if (!Number.isFinite(open) || !Number.isFinite(close)) return;
            if (!loggedKline) {
                console.log('[Trade] kline polarity sample:', { open, close });
                loggedKline = true;
            }
            setIsPricePositive(close >= open);
        };
        const handleLocalKline = (event: any) => applyKlinePolarity(event?.payload ?? event);
        const handleBinanceKline = (envelope: any) => {
            if (envelope?.channel !== 'kline') return;
            if (envelope?.symbol && envelope.symbol !== binanceSymbol) return;
            if (envelope?.interval && envelope.interval !== klineInterval) return;
            applyKlinePolarity(envelope?.payload ?? envelope);
        };
        if (availability === 'GLOBAL') {
            socket.on('data', handleBinanceKline);
        } else {
            socket.on(localKlineEvent, handleLocalKline);
        }

        return () => {
            socket.emit('unsubscribe', { channel: 'local_trade', symbol: localSymbol });
            socket.emit('unsubscribe', { channel: 'local_depth', symbol: localSymbol });
            if (availability === 'GLOBAL') {
                socket.emit('unsubscribe', { channel: 'ticker', symbol: binanceSymbol });
                socket.emit('unsubscribe', {
                    channel: 'kline',
                    symbol: binanceSymbol,
                    interval: klineInterval,
                });
                socket.off('data', handleBinanceData);
                socket.off('data', handleBinanceKline);
            } else {
                socket.emit('unsubscribe', { channel: 'local_ticker', symbol: localSymbol });
                socket.emit('unsubscribe', {
                    channel: 'local_kline',
                    symbol: localSymbol,
                    interval: klineInterval,
                });
                socket.off(localTickerEvent, handleLocalTicker);
                socket.off(localKlineEvent, handleLocalKline);
            }
            socket.off(localTradeEvent, handleLocalTrade);
            socket.off(localDepthEvent, handleLocalDepth);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SelectedCoin?.base_currency, SelectedCoin?.quote_currency, isConnected, availability]);

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
