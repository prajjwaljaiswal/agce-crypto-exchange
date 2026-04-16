import { useEffect, useState } from "react";
import { useCoinListStore } from "../stores/coinListStore.js";
import { assetsApi, pairsApi } from "../../../lib/matching-api.js";

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
        favCoins, setfavCoins,
    } = useCoinListStore();

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
                    // When there are no local trades yet, seed the displayed
                    // price from the pair's referencePrice (typically Binance).
                    // Ticker polling will overwrite this once a /market/ticker
                    // response with a real lastPrice arrives.
                    const seedPrice = parseFloat(pair.referencePrice ?? "0") || 0;
                    return {
                        _id: pair.symbol,
                        symbol: pair.symbol,
                        base_currency: pair.baseAsset,
                        quote_currency: pair.quoteAsset,
                        base_currency_id: pair.baseAsset,
                        quote_currency_id: pair.quoteAsset,
                        base_currency_fullname: baseMeta?.name ?? pair.baseAsset,
                        icon_path: baseMeta?.iconUrl ?? "",
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
                    };
                });

                setAllData({ pairs: mappedPairs });
            } catch {
                // non-critical; coin list stays empty
            } finally {
                if (!cancelled) setPairsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    // Filter the pair list by search term whenever it or AllData changes.
    useEffect(() => {
        const filtered = AllData?.pairs?.filter((item: any) =>
            item?.base_currency?.toLowerCase().includes(search?.toLowerCase()) ||
            item?.quote_currency?.toLowerCase().includes(search?.toLowerCase())
        );
        setCoinPairDetails(filtered ?? []);
    }, [search, AllData]);

    // Default the coin filter to the first quote currency once data arrives.
    useEffect(() => {
        if (CoinPairDetails?.length > 0 && coinFilter === "ALL") {
            const firstQuoteCurrency = CoinPairDetails[0]?.quote_currency;
            if (firstQuoteCurrency) setcoinFilter(firstQuoteCurrency);
        }
    }, [CoinPairDetails, coinFilter]);

    const handleAddFav = (pairId: string) => {
        setfavCoins((prev) =>
            prev.includes(pairId) ? prev.filter((id) => id !== pairId) : [...prev, pairId]
        );
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
