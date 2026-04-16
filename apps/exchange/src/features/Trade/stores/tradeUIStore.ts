import { create } from "zustand";

interface TradeUIState {
    // selected pair + metadata
    SelectedCoin: any;
    /** TODO: wire coin metadata API → call setCoins(response) */
    Coins: any[];
    desAndLinks: { description?: string; links?: any[]; [key: string]: any };
    // page tabs
    showTab: string;
    // modals / sidebar
    showMobileFavouritesPopup: boolean;
    isFavouritesOpen: boolean;
    // orders table UI
    expandedRowIndex: number | null;
    positionOrderTab: string;
    openOrderKindTab: string;
    showExecutedTrades: Record<string, boolean>;
    // actions
    setSelectedCoin: (v: any) => void;
    setCoins: (v: any[]) => void;
    setDesAndLinks: (v: { description?: string; links?: any[]; [key: string]: any }) => void;
    setShowTab: (v: string) => void;
    setShowMobileFavouritesPopup: (v: boolean) => void;
    setIsFavouritesOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
    setExpandedRowIndex: (v: number | null) => void;
    setPositionOrderTab: (v: string) => void;
    setOpenOrderKindTab: (v: string) => void;
    setShowExecutedTrades: (v: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
    reset: () => void;
}

const initial = {
    SelectedCoin: undefined as any,
    Coins: [] as any[],
    desAndLinks: { description: "", links: [] } as { description?: string; links?: any[]; [key: string]: any },
    showTab: "chart",
    showMobileFavouritesPopup: false,
    isFavouritesOpen: false,
    expandedRowIndex: null as number | null,
    positionOrderTab: "positions",
    openOrderKindTab: "limit_market",
    showExecutedTrades: {} as Record<string, boolean>,
};

export const useTradeUIStore = create<TradeUIState>((set) => ({
    ...initial,
    setSelectedCoin: (v) => set({ SelectedCoin: v }),
    setCoins: (v) => set({ Coins: v }),
    setDesAndLinks: (v) => set({ desAndLinks: v }),
    setShowTab: (v) => set({ showTab: v }),
    setShowMobileFavouritesPopup: (v) => set({ showMobileFavouritesPopup: v }),
    setIsFavouritesOpen: (v) => set((s) => ({ isFavouritesOpen: typeof v === "function" ? v(s.isFavouritesOpen) : v })),
    setExpandedRowIndex: (v) => set({ expandedRowIndex: v }),
    setPositionOrderTab: (v) => set({ positionOrderTab: v }),
    setOpenOrderKindTab: (v) => set({ openOrderKindTab: v }),
    setShowExecutedTrades: (v) => set((s) => ({ showExecutedTrades: typeof v === "function" ? v(s.showExecutedTrades) : v })),
    reset: () => set(initial),
}));
