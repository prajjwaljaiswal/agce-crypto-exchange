import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useCoinListStore } from "../stores/coinListStore.js";
import {
    assetsApi,
    pairsApi,
    marketApi,
    binanceMarketApi,
} from "../../../lib/matching-api.js";
import { useFavorites } from "../../Market/useFavorites.js";
import { SocketContext } from "../SocketContext.js";

/**
 * Overlay a normalized 24h ticker onto a coin-list row. All numeric
 * ticker values are strings on the wire (matching both AGCE and Binance
 * conventions); we parseFloat and only apply values that are finite.
 * Missing fields leave the row's prior value intact so a partial ticker
 * response doesn't wipe seeded data.
 */
function mergeTicker(
    row: any,
    t: {
        last?: string;
        change?: string;
        changePct?: string;
        high?: string;
        low?: string;
        volume?: string;
    },
): any {
    const num = (v: unknown, fallback: number): number => {
        if (v == null) return fallback;
        const n = parseFloat(v as string);
        return Number.isFinite(n) ? n : fallback;
    };
    const last = num(t.last, row.buy_price);
    return {
        ...row,
        buy_price: last,
        sell_price: last,
        reference_price: last || row.reference_price,
        change: num(t.change, 0),
        change_percentage: num(t.changePct, 0),
        high: num(t.high, 0),
        low: num(t.low, 0),
        volume: num(t.volume, 0),
    };
}

export type CoinListApi = {
    search: string;
    setsearch: (v: string) => void;
    AllData: any;
    _setAllData: (v: any) => void;
    CoinPairDetails: any[];
    coinFilter: string;
    setcoinFilter: (v: string) => void;
    favCoins: string[];
    handleAddFav: (pairId: string) => void;
    pairsLoading: boolean;
};

export function useCoinList(): CoinListApi {
    const {
        search, setsearch,
        AllData, setAllData,
        CoinPairDetails, setCoinPairDetails,
        coinFilter, setcoinFilter,
    } = useCoinListStore();

    const { favorites, toggleFavorite } = useFavorites();
    const favCoins = useMemo(() => Array.from(favorites), [favorites]);
    const { getSocket, isConnected } = useContext(SocketContext);

    const [pairsLoading, setPairsLoading] = useState(false);
    // Guards for the `market:list` auto-refetch — without these a single
    // tick with a new symbol would fire N parallel REST refetches while
    // the first one is still in flight.
    const refetchInFlight = useRef(false);
    const lastRefetchAt = useRef(0);

    const loadPairs = useCallback(
        async (signal?: AbortSignal) => {
            const isAborted = () => !!signal?.aborted;
            setPairsLoading(true);
            try {
                const [pairs, assets] = await Promise.all([
                    pairsApi.list(),
                    assetsApi.list(),
                ]);
                if (isAborted()) return;

                const assetMap = new Map(assets.map((a) => [a.assetCode, a]));

                const mappedPairs = pairs.map((pair) => {
                    const baseMeta = assetMap.get(pair.baseAsset);
                    // Server renamed `stepSize` → `lotSize`; keep both for safety.
                    const stepSize = pair.lotSize ?? pair.stepSize ?? "0.00001";
                    // Fee resolution: per-pair overrides > base asset's
                    // default fees. Backends that don't expose per-pair
                    // fees (most of ours) fall through to the asset's
                    // makerFee/takerFee string. Values are percentages
                    // (e.g. "0.1" means 0.1%) — NOT multipliers.
                    const makerFee =
                        parseFloat(
                            (pair.makerFee ??
                                (baseMeta as any)?.makerFee ??
                                "0") as string,
                        ) || 0;
                    const takerFee =
                        parseFloat(
                            (pair.takerFee ??
                                (baseMeta as any)?.takerFee ??
                                "0") as string,
                        ) || 0;
                    // Seed price priority: live `price` > admin `initialPrice`
                    // > legacy `referencePrice`.
                    const seedPrice =
                        parseFloat(
                            (pair.price ??
                                pair.initialPrice ??
                                pair.referencePrice ??
                                "0") as string,
                        ) || 0;
                    return {
                        _id: pair.symbol,
                        symbol: pair.symbol,
                        availability: pair.availability,
                        base_currency: pair.baseAsset,
                        quote_currency: pair.quoteAsset,
                        base_currency_id: pair.baseAsset,
                        quote_currency_id: pair.quoteAsset,
                        base_currency_fullname: baseMeta?.name ?? pair.baseAsset,
                        iconUrl: pair.baseIconUrl ?? pair.iconUrl ?? baseMeta?.iconUrl ?? "",
                        baseIconUrl: pair.baseIconUrl ?? pair.iconUrl ?? baseMeta?.iconUrl ?? "",
                        quoteIconUrl: pair.quoteIconUrl ?? "",
                        icon_path: pair.baseIconUrl ?? pair.iconUrl ?? baseMeta?.iconUrl ?? "",
                        description: baseMeta?.description ?? "",
                        tick_size: parseFloat(pair.tickSize ?? "0.01"),
                        step_size: parseFloat(stepSize),
                        reference_price: seedPrice,
                        buy_price: seedPrice,
                        sell_price: seedPrice,
                        change: 0,
                        change_percentage: 0,
                        high: 0,
                        low: 0,
                        volume: 0,
                        maker_fee: makerFee,
                        taker_fee: takerFee,
                        makerFee: makerFee,
                        takerFee: takerFee,
                    };
                });

                if (isAborted()) return;
                setAllData({ pairs: mappedPairs });

                // Second pass: 24h ticker per pair. LOCAL → matching
                // ticker; GLOBAL → Binance via market-data-service.
                const enriched = await Promise.all(
                    mappedPairs.map(async (row: any) => {
                        try {
                            if (row.availability === "GLOBAL") {
                                const bSym = `${row.base_currency}${row.quote_currency}`;
                                const t: any = await binanceMarketApi.ticker24h(bSym);
                                return mergeTicker(row, {
                                    last: t.lastPrice,
                                    change: t.priceChange,
                                    changePct: t.priceChangePercent,
                                    high: t.highPrice,
                                    low: t.lowPrice,
                                    volume: t.volume,
                                });
                            }
                            const lSym = `${row.base_currency}-${row.quote_currency}`;
                            const t: any = await marketApi.ticker(lSym);
                            return mergeTicker(row, {
                                last: t.last ?? t.lastPrice ?? t.close,
                                change: t.priceChange ?? t.change,
                                changePct: t.priceChangePercent ?? t.changePercent,
                                high: t.high ?? t.highPrice,
                                low: t.low ?? t.lowPrice,
                                volume: t.volume ?? t.baseVolume,
                            });
                        } catch {
                            return row;
                        }
                    }),
                );
                if (!isAborted()) setAllData({ pairs: enriched });
            } catch {
                // non-critical; coin list stays empty
            } finally {
                if (!isAborted()) setPairsLoading(false);
            }
        },
        [setAllData],
    );

    // Initial mount fetch.
    useEffect(() => {
        const ctrl = new AbortController();
        void loadPairs(ctrl.signal);
        return () => ctrl.abort();
    }, [loadPairs]);

    // ---- Live overlay: market_list socket ----
    // market-data-service emits `market:list` on every stats change
    // (throttled server-side, ~500ms cadence). Each frame is the full
    // active-pair set with live price / change / volume / marketCap.
    // We merge it over the REST-seeded rows so the pair picker stays
    // fresh without polling.
    //
    // Symbol format note: market_list uses storage form "BTC/USDT";
    // AllData.pairs is keyed the same way (pair.symbol from
    // /api/v1/pairs), so no normalisation needed.
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !isConnected) return undefined;

        socket.emit("subscribe", { channel: "market_list" });

        const handle = (payload: unknown) => {
            const items =
                payload && typeof payload === "object" && "items" in payload
                    ? (payload as { items: any[] }).items
                    : Array.isArray(payload)
                    ? payload
                    : [];
            if (!items.length) return;

            const bySymbol = new Map<string, any>();
            for (const row of items) {
                if (row?.symbol) bySymbol.set(String(row.symbol), row);
            }

            // Detect new-symbol arrivals OUTSIDE the functional setter —
            // triggering loadPairs (which itself calls setAllData) from
            // inside a setAllData updater confuses zustand and can drop
            // the outer update, wiping the pair list intermittently. We
            // read current state via the store's getState() helper, then
            // if we need a refetch schedule it on the next microtask.
            const currentPairs: any[] =
                useCoinListStore.getState().AllData?.pairs ?? [];
            if (currentPairs.length > 0) {
                const existingSet = new Set(
                    currentPairs.map((r: any) => r.symbol),
                );
                let hasNew = false;
                for (const s of bySymbol.keys()) {
                    if (!existingSet.has(s)) {
                        hasNew = true;
                        break;
                    }
                }
                if (hasNew && !refetchInFlight.current) {
                    const now = Date.now();
                    if (now - lastRefetchAt.current > 5_000) {
                        refetchInFlight.current = true;
                        lastRefetchAt.current = now;
                        // Defer one microtask so setAllData below commits
                        // before loadPairs starts its own writes.
                        queueMicrotask(() => {
                            void loadPairs().finally(() => {
                                refetchInFlight.current = false;
                            });
                        });
                    }
                }
            }

            setAllData((prev: any) => {
                const existing = prev?.pairs;
                if (!Array.isArray(existing) || existing.length === 0) {
                    return prev;
                }

                let mutated = false;
                const next = existing.map((row: any) => {
                    const live = bySymbol.get(row.symbol);
                    if (!live) return row;

                    const num = (v: unknown, fallback: number): number => {
                        if (v == null) return fallback;
                        const n = parseFloat(v as string);
                        return Number.isFinite(n) ? n : fallback;
                    };

                    const last = num(live.price, row.buy_price);
                    const change = num(live.priceChange, 0);
                    const changePct = num(live.priceChangePercent, 0);
                    const high = num(live.high, row.high ?? 0);
                    const low = num(live.low, row.low ?? 0);
                    const volume = num(live.volume, row.volume ?? 0);
                    const quoteVolume = num(
                        live.quoteVolume,
                        row.quoteVolume ?? 0,
                    );
                    const marketCap = num(live.marketCap, row.market_cap ?? 0);

                    // Skip the object allocation if nothing changed — stops
                    // React re-rendering the whole list on a payload that
                    // matches the last frame value-for-value.
                    if (
                        row.buy_price === last &&
                        row.change === change &&
                        row.change_percentage === changePct &&
                        row.high === high &&
                        row.low === low &&
                        row.volume === volume
                    ) {
                        return row;
                    }

                    mutated = true;
                    return {
                        ...row,
                        buy_price: last,
                        sell_price: last,
                        reference_price: last || row.reference_price,
                        change,
                        change_percentage: changePct,
                        high,
                        low,
                        volume,
                        quoteVolume,
                        market_cap: marketCap,
                    };
                });
                return mutated ? { ...prev, pairs: next } : prev;
            });
        };

        socket.on("market:list", handle);
        return () => {
            socket.emit("unsubscribe", { channel: "market_list" });
            socket.off("market:list", handle);
        };
    }, [getSocket, isConnected, setAllData]);

    // Keep the pair list in sync with AllData. The search term drives the
    // autosearch dropdown in CoinListPanel and no longer narrows this list,
    // so the tab-filtered table stays stable while the user types.
    useEffect(() => {
        setCoinPairDetails(AllData?.pairs ?? []);
    }, [AllData]);

    // Default the coin filter to the first quote currency once data arrives.
    useEffect(() => {
        if (CoinPairDetails?.length > 0 && coinFilter === "ALL") {
            const firstQuoteCurrency = CoinPairDetails[0]?.quote_currency;
            if (firstQuoteCurrency) setcoinFilter(firstQuoteCurrency);
        }
    }, [CoinPairDetails, coinFilter]);

    const handleAddFav = (pairId: string) => {
        toggleFavorite(pairId);
    };

    return {
        search, setsearch,
        AllData, _setAllData: setAllData,
        CoinPairDetails,
        coinFilter, setcoinFilter,
        favCoins, handleAddFav,
        pairsLoading,
    };
}
