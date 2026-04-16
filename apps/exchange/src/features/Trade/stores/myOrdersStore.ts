import { create } from "zustand";

interface MyOrdersState {
    openOrders: any[];
    pastOrders: any[];
    /** Raw unfiltered past orders — set when API response arrives */
    pastOrder2: any[];
    orderType: string;
    pastOrderType: string;
    // actions
    setopenOrders: (v: any[] | ((prev: any[]) => any[])) => void;
    setpastOrders: (v: any[]) => void;
    setpastOrder2: (v: any[]) => void;
    setorderType: (v: string) => void;
    setpastOrderType: (v: string) => void;
    reset: () => void;
}

const initial = {
    openOrders: [] as any[],
    pastOrders: [] as any[],
    pastOrder2: [] as any[],
    orderType: "All",
    pastOrderType: "All",
};

export const useMyOrdersStore = create<MyOrdersState>((set) => ({
    ...initial,
    setopenOrders: (v) => set((s) => ({ openOrders: typeof v === "function" ? v(s.openOrders) : v })),
    setpastOrders: (v) => set({ pastOrders: v }),
    setpastOrder2: (v) => set({ pastOrder2: v }),
    setorderType: (v) => set({ orderType: v }),
    setpastOrderType: (v) => set({ pastOrderType: v }),
    reset: () => set(initial),
}));
