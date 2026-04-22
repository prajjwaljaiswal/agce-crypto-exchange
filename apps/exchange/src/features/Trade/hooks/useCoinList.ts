import { useEffect, useMemo, useState } from "react";
import { useCoinListStore } from "../stores/coinListStore.js";
import {
    assetsApi,
    pairsApi,
    marketApi,
    binanceMarketApi,
} from "../../../lib/matching-api.js";
import { useFavorites } from "../../Market/useFavorites.js";

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

    const [pairsLoading, setPairsLoading] = useState(false);

    // Fetch all pairs + all assets on mount, join by assetCode, map to legacy field shape.
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setPairsLoading(true);
            try {
                const [pairs, assets] = await Promise.all([
                    pairsApi.list(),
                    assetsApi.list(),
                ]);
                if (cancelled) return;

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
                    // > legacy `referencePrice`. Prior builds only read the
                    // legacy field, which no longer exists on newer backends,
                    // so rows came out as zero until a ticker fetch overwrote
                    // them. The explicit ticker pass below fills change% /
                    // high / low / volume next.
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
                        // Keep both casings so consumers reading either
                        // `maker_fee` (legacy UI fields) or `makerFee`
                        // (TradingPair backend shape) pick up a value.
                        makerFee: makerFee,
                        takerFee: takerFee,
                    };
                });

                setAllData({ pairs: mappedPairs });

                // Second pass: fetch 24h ticker per pair and merge the
                // live price + change into the list. LOCAL pairs use our
                // matching service's ticker; GLOBAL pairs pull from
                // Binance via market-data-service. Requests fan out in
                // parallel; one failure doesn't block the rest.
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
                            // Binance rejects unknown symbols with 502/400 and
                            // the local ticker may 404 for pairs with no
                            // trades — keep the seeded row unchanged so the
                            // dropdown still shows the price.
                            return row;
                        }
                    }),
                );
                if (!cancelled) setAllData({ pairs: enriched });
            } catch {
                // non-critical; coin list stays empty
            } finally {
                if (!cancelled) setPairsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

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
