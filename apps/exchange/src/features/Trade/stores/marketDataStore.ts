import { create } from "zustand";

interface MarketDataState {
    BuyOrders: any[];
    SellOrders: any[];
    RecentTrade: any[];
    loader: boolean;
    buyprice: number;
    sellPrice: number;
    priceChange: number;
    changesHour: number;
    priceHigh: number;
    priceLow: number;
    volume: number;
    isPricePositive: boolean;
    // actions
    setBuyOrders: (v: any[] | ((prev: any[]) => any[])) => void;
    setSellOrders: (v: any[] | ((prev: any[]) => any[])) => void;
    setRecentTrade: (v: any[] | ((prev: any[]) => any[])) => void;
    setloader: (v: boolean) => void;
    setbuyprice: (v: number) => void;
    setsellPrice: (v: number) => void;
    setpriceChange: (v: number) => void;
    setChangesHour: (v: number) => void;
    setpriceHigh: (v: number) => void;
    setpriceLow: (v: number) => void;
    setvolume: (v: number) => void;
    setIsPricePositive: (v: boolean) => void;
    reset: () => void;
}

const initial = {
    BuyOrders: [] as any[],
    SellOrders: [] as any[],
    RecentTrade: [] as any[],
    loader: true,
    buyprice: 0,
    sellPrice: 0,
    priceChange: 0,
    changesHour: 0,
    priceHigh: 0,
    priceLow: 0,
    volume: 0,
    isPricePositive: true,
};

export const useMarketDataStore = create<MarketDataState>((set) => ({
    ...initial,
    setBuyOrders: (v) => set((s) => ({ BuyOrders: typeof v === "function" ? v(s.BuyOrders) : v })),
    setSellOrders: (v) => set((s) => ({ SellOrders: typeof v === "function" ? v(s.SellOrders) : v })),
    setRecentTrade: (v) => set((s) => ({ RecentTrade: typeof v === "function" ? v(s.RecentTrade) : v })),
    setloader: (v) => set({ loader: v }),
    setbuyprice: (v) => set({ buyprice: v }),
    setsellPrice: (v) => set({ sellPrice: v }),
    setpriceChange: (v) => set({ priceChange: v }),
    setChangesHour: (v) => set({ changesHour: v }),
    setpriceHigh: (v) => set({ priceHigh: v }),
    setpriceLow: (v) => set({ priceLow: v }),
    setvolume: (v) => set({ volume: v }),
    setIsPricePositive: (v) => set({ isPricePositive: v }),
    reset: () => set(initial),
}));
