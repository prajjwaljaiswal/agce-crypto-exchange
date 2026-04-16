import { useMemo } from "react";
import { aggregateOrderBookRows } from "../utils/orderBook.js";

type Level = { price: number; quantity: number; remaining: number };

// Derives everything the order-book UI needs from raw buy/sell levels:
//   - aggregated + sorted rows
//   - cumulative depth (qty + notional) used for row fill bars
//   - bid/ask total ratio for the footer
//   - formatOrderBookAggPrice (rounding aware of the current agg step)
//   - getAskRowMetrics / getBidRowMetrics (row fill % + running total)
//
// Kept as a single hook because these are all tightly coupled to
// orderBookAggStep + the raw level arrays — splitting would force
// consumers to recompute the same chain.
export function useOrderBookDepth(
    BuyOrders: Level[],
    SellOrders: Level[],
    orderBookAggStep: number,
) {
    const displaySellOrders = useMemo(() => {
        const rows = aggregateOrderBookRows(SellOrders, orderBookAggStep);
        return rows.sort((a, b) => b.price - a.price);
    }, [SellOrders, orderBookAggStep]);

    const displayBuyOrders = useMemo(() => {
        const rows = aggregateOrderBookRows(BuyOrders, orderBookAggStep);
        return rows.sort((a, b) => b.price - a.price);
    }, [BuyOrders, orderBookAggStep]);

    // Asks: accumulate from best ask (bottom row, closest to spread) upward.
    const askDepth = useMemo(() => {
        const n = displaySellOrders.length;
        const cumNotional = new Array<number>(n).fill(0);
        const cumQty = new Array<number>(n).fill(0);
        let notionalAcc = 0;
        let qtyAcc = 0;
        for (let i = n - 1; i >= 0; i--) {
            const q = Number(displaySellOrders[i].remaining) || 0;
            const pr = Number(displaySellOrders[i].price) || 0;
            qtyAcc += q;
            notionalAcc += q * pr;
            cumQty[i] = qtyAcc;
            cumNotional[i] = notionalAcc;
        }
        return { cumQty, cumNotional, totalNotional: notionalAcc || 1 };
    }, [displaySellOrders]);

    // Bids: accumulate from best bid (top row, closest to spread) downward.
    const bidDepth = useMemo(() => {
        const n = displayBuyOrders.length;
        const cumNotional = new Array<number>(n).fill(0);
        const cumQty = new Array<number>(n).fill(0);
        let notionalAcc = 0;
        let qtyAcc = 0;
        for (let i = 0; i < n; i++) {
            const q = Number(displayBuyOrders[i].remaining) || 0;
            const pr = Number(displayBuyOrders[i].price) || 0;
            qtyAcc += q;
            notionalAcc += q * pr;
            cumQty[i] = qtyAcc;
            cumNotional[i] = notionalAcc;
        }
        return { cumQty, cumNotional, totalNotional: notionalAcc || 1 };
    }, [displayBuyOrders]);

    const orderBookBidAskRatio = useMemo(() => {
        const bid = displayBuyOrders.reduce((s, o) => s + (Number(o.remaining) || 0), 0);
        const ask = displaySellOrders.reduce((s, o) => s + (Number(o.remaining) || 0), 0);
        const t = bid + ask;
        if (t <= 0) return { bidPct: 50, askPct: 50 };
        return { bidPct: (bid / t) * 100, askPct: (ask / t) * 100 };
    }, [displayBuyOrders, displaySellOrders]);

    const formatOrderBookAggPrice = (price: any) => {
        if (price === undefined || price === null || Number.isNaN(Number(price))) return "0";
        const n = Number(price);
        if (orderBookAggStep >= 1) return String(Math.round(n));
        return parseFloat(n.toFixed(1)).toString();
    };

    const getAskRowMetrics = (index: number) => {
        const cum = askDepth.cumNotional[index] || 0;
        const fill = askDepth.totalNotional ? (cum / askDepth.totalNotional) * 100 : 0;
        return { fill, rowTotal: cum };
    };

    const getBidRowMetrics = (index: number) => {
        const cum = bidDepth.cumNotional[index] || 0;
        const fill = bidDepth.totalNotional ? (cum / bidDepth.totalNotional) * 100 : 0;
        return { fill, rowTotal: cum };
    };

    return {
        displaySellOrders,
        displayBuyOrders,
        askDepth,
        bidDepth,
        orderBookBidAskRatio,
        formatOrderBookAggPrice,
        getAskRowMetrics,
        getBidRowMetrics,
    };
}

export type OrderBookDepth = ReturnType<typeof useOrderBookDepth>;
