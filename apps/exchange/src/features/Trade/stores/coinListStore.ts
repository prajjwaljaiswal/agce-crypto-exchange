import { create } from "zustand";

interface CoinListState {
    search: string;
    /** TODO: wire real pair-list API → call setAllData(response) */
    AllData: any;
    CoinPairDetails: any[];
    coinFilter: string;
    // actions
    setsearch: (v: string) => void;
    setAllData: (v: any) => void;
    setCoinPairDetails: (v: any[]) => void;
    setcoinFilter: (v: string) => void;
    reset: () => void;
}

const initial = {
    search: "",
    AllData: {} as any,
    CoinPairDetails: [] as any[],
    coinFilter: "ALL",
};

export const useCoinListStore = create<CoinListState>((set) => ({
    ...initial,
    setsearch: (v) => set({ search: v }),
    setAllData: (v) => set({ AllData: v }),
    setCoinPairDetails: (v) => set({ CoinPairDetails: v }),
    setcoinFilter: (v) => set({ coinFilter: v }),
    reset: () => set(initial),
}));
