import { create } from "zustand";

interface OrderBookUIState {
    orderBookActiveTab: string;
    /** "both" | "bids" | "asks" */
    orderBookViewMode: string;
    orderBookAggStep: number;
    orderBookAggOpen: boolean;
    /** Swap Amount ↔ Total column order (Binance-style) */
    orderBookSwapAmountTotal: boolean;
    // actions
    setOrderBookActiveTab: (v: string) => void;
    setOrderBookViewMode: (v: string) => void;
    setOrderBookAggStep: (v: number) => void;
    setOrderBookAggOpen: (v: boolean | ((o: boolean) => boolean)) => void;
    setOrderBookSwapAmountTotal: (v: boolean | ((s: boolean) => boolean)) => void;
    reset: () => void;
}

const initial = {
    orderBookActiveTab: "orderbook",
    orderBookViewMode: "both",
    orderBookAggStep: 0.1,
    orderBookAggOpen: false,
    orderBookSwapAmountTotal: false,
};

export const useOrderBookUIStore = create<OrderBookUIState>((set) => ({
    ...initial,
    setOrderBookActiveTab: (v) => set({ orderBookActiveTab: v }),
    setOrderBookViewMode: (v) => set({ orderBookViewMode: v }),
    setOrderBookAggStep: (v) => set({ orderBookAggStep: v }),
    setOrderBookAggOpen: (v) => set((s) => ({ orderBookAggOpen: typeof v === "function" ? v(s.orderBookAggOpen) : v })),
    setOrderBookSwapAmountTotal: (v) => set((s) => ({ orderBookSwapAmountTotal: typeof v === "function" ? v(s.orderBookSwapAmountTotal) : v })),
    reset: () => set(initial),
}));
