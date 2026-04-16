import { create } from "zustand";

export interface SpotWallet {
    assetCode: string;
    short_name: string;
    full_name: string;
    icon_path: string;
    balance: number;
    decimals: number;
    category: string;
    isActive: boolean;
}

interface WalletsState {
    spotWallets: SpotWallet[];
    walletsLoading: boolean;
    /** Quote currency balance (e.g. USDT) for the selected pair */
    BuyCoinBal: number | undefined;
    /** Base currency balance (e.g. BTC) for the selected pair */
    SellCoinBal: number | undefined;
    // actions
    setSpotWallets: (v: SpotWallet[]) => void;
    setWalletsLoading: (v: boolean) => void;
    setBuyCoinBal: (v: number | undefined) => void;
    setSellCoinBal: (v: number | undefined) => void;
    reset: () => void;
}

const initial = {
    spotWallets: [] as SpotWallet[],
    walletsLoading: false,
    BuyCoinBal: undefined as number | undefined,
    SellCoinBal: undefined as number | undefined,
};

export const useWalletsStore = create<WalletsState>((set) => ({
    ...initial,
    setSpotWallets: (v) => set({ spotWallets: v }),
    setWalletsLoading: (v) => set({ walletsLoading: v }),
    setBuyCoinBal: (v) => set({ BuyCoinBal: v }),
    setSellCoinBal: (v) => set({ SellCoinBal: v }),
    reset: () => set(initial),
}));
