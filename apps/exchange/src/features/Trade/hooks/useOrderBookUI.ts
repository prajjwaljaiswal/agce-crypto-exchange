import { useEffect } from "react";
import { useOrderBookUIStore } from "../stores/orderBookUIStore.js";

export type OrderBookUIApi = {
    orderBookActiveTab: string;
    setOrderBookActiveTab: (v: string) => void;
    orderBookViewMode: string;
    setOrderBookViewMode: (v: string) => void;
    orderBookAggStep: number;
    setOrderBookAggStep: (v: number) => void;
    orderBookAggOpen: boolean;
    setOrderBookAggOpen: (v: boolean | ((o: boolean) => boolean)) => void;
    orderBookSwapAmountTotal: boolean;
    setOrderBookSwapAmountTotal: (v: boolean | ((s: boolean) => boolean)) => void;
};

export function useOrderBookUI(): OrderBookUIApi {
    const {
        orderBookActiveTab, setOrderBookActiveTab,
        orderBookViewMode, setOrderBookViewMode,
        orderBookAggStep, setOrderBookAggStep,
        orderBookAggOpen, setOrderBookAggOpen,
        orderBookSwapAmountTotal, setOrderBookSwapAmountTotal,
    } = useOrderBookUIStore();

    // Close the agg-step dropdown when the user clicks outside it or presses Escape.
    useEffect(() => {
        if (!orderBookAggOpen) return undefined;
        const onDown = (e: MouseEvent) => {
            if (!(e.target as Element)?.closest?.(".orderbook_agg_dd")) {
                setOrderBookAggOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOrderBookAggOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [orderBookAggOpen]);

    return {
        orderBookActiveTab, setOrderBookActiveTab,
        orderBookViewMode, setOrderBookViewMode,
        orderBookAggStep, setOrderBookAggStep,
        orderBookAggOpen, setOrderBookAggOpen,
        orderBookSwapAmountTotal, setOrderBookSwapAmountTotal,
    };
}
