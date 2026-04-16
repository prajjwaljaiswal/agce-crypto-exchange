import { create } from "zustand";
import type { BuySellTab, OrderKind } from "../hooks/useOrderForm.js";

interface OrderFormState {
    // tabs / mode
    showBuySellTab: BuySellTab;
    infoPlaceOrder: OrderKind;
    isConditionalMenuOpen: boolean;
    // buy form
    buyOrderPrice: string;
    buyamount: number | string;
    buyStopPrice: string;
    limitBuyPercent: number;
    limitBuyFok: boolean;
    limitBuyIoc: boolean;
    marketBuyPercent: number;
    buySlippageEnabled: boolean;
    buySlippageInput: string;
    // sell form
    sellOrderPrice: string;
    sellAmount: number | string;
    sellStopPrice: string;
    limitSellPercent: number;
    limitSellFok: boolean;
    limitSellIoc: boolean;
    marketSellPercent: number;
    // shared
    stopPercent: number;
    priceFieldFocus: string | null;
    // actions
    setShowBuySellTab: (v: BuySellTab) => void;
    setinfoPlaceOrder: (v: OrderKind) => void;
    setIsConditionalMenuOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
    setbuyOrderPrice: (v: string) => void;
    setbuyamount: (v: number | string) => void;
    setBuyStopPrice: (v: string) => void;
    setLimitBuyPercent: (v: number) => void;
    setLimitBuyFok: (v: boolean) => void;
    setLimitBuyIoc: (v: boolean) => void;
    setMarketBuyPercent: (v: number) => void;
    setBuySlippageEnabled: (v: boolean) => void;
    setBuySlippageInput: (v: string) => void;
    setsellOrderPrice: (v: string) => void;
    setsellAmount: (v: number | string) => void;
    setSellStopPrice: (v: string) => void;
    setLimitSellPercent: (v: number) => void;
    setLimitSellFok: (v: boolean) => void;
    setLimitSellIoc: (v: boolean) => void;
    setMarketSellPercent: (v: number) => void;
    setStopPercent: (v: number) => void;
    setPriceFieldFocus: (v: string | null | ((prev: string | null) => string | null)) => void;
    reset: () => void;
}

const initial = {
    showBuySellTab: "" as BuySellTab,
    infoPlaceOrder: "LIMIT" as OrderKind,
    isConditionalMenuOpen: false,
    buyOrderPrice: "",
    buyamount: 0 as number | string,
    buyStopPrice: "",
    limitBuyPercent: 0,
    limitBuyFok: true,
    limitBuyIoc: false,
    marketBuyPercent: 0,
    buySlippageEnabled: false,
    buySlippageInput: "",
    sellOrderPrice: "",
    sellAmount: 0 as number | string,
    sellStopPrice: "",
    limitSellPercent: 0,
    limitSellFok: true,
    limitSellIoc: false,
    marketSellPercent: 0,
    stopPercent: 0,
    priceFieldFocus: null as string | null,
};

export const useOrderFormStore = create<OrderFormState>((set) => ({
    ...initial,
    setShowBuySellTab: (v) => set({ showBuySellTab: v }),
    setinfoPlaceOrder: (v) => set({ infoPlaceOrder: v }),
    setIsConditionalMenuOpen: (v) => set((s) => ({ isConditionalMenuOpen: typeof v === "function" ? v(s.isConditionalMenuOpen) : v })),
    setbuyOrderPrice: (v) => set({ buyOrderPrice: v }),
    setbuyamount: (v) => set({ buyamount: v }),
    setBuyStopPrice: (v) => set({ buyStopPrice: v }),
    setLimitBuyPercent: (v) => set({ limitBuyPercent: v }),
    setLimitBuyFok: (v) => set({ limitBuyFok: v }),
    setLimitBuyIoc: (v) => set({ limitBuyIoc: v }),
    setMarketBuyPercent: (v) => set({ marketBuyPercent: v }),
    setBuySlippageEnabled: (v) => set({ buySlippageEnabled: v }),
    setBuySlippageInput: (v) => set({ buySlippageInput: v }),
    setsellOrderPrice: (v) => set({ sellOrderPrice: v }),
    setsellAmount: (v) => set({ sellAmount: v }),
    setSellStopPrice: (v) => set({ sellStopPrice: v }),
    setLimitSellPercent: (v) => set({ limitSellPercent: v }),
    setLimitSellFok: (v) => set({ limitSellFok: v }),
    setLimitSellIoc: (v) => set({ limitSellIoc: v }),
    setMarketSellPercent: (v) => set({ marketSellPercent: v }),
    setStopPercent: (v) => set({ stopPercent: v }),
    setPriceFieldFocus: (v) => set((s) => ({ priceFieldFocus: typeof v === "function" ? v(s.priceFieldFocus) : v })),
    reset: () => set(initial),
}));
