import { useEffect } from "react";
import { alertErrorMessage, alertSuccessMessage } from "../CustomAlertMessage";
import { ordersApi } from "../../../lib/matching-api.js";
import { toErrorMessage } from "../utils/errorMessage.js";
import { useMyOrdersStore } from "../stores/myOrdersStore.js";

export type MyOrdersApi = {
    openOrders: any[];
    pastOrders: any[];
    orderType: string;
    setorderType: (v: string) => void;
    pastOrderType: string;
    setpastOrderType: (v: string) => void;
    refreshMyOrders: () => Promise<void>;
    cancelOrder: (orderId: string) => Promise<void>;
};

export function useMyOrders(isAuthenticated: boolean): MyOrdersApi {
    const {
        openOrders, setopenOrders,
        pastOrders, setpastOrders,
        pastOrder2,
        orderType, setorderType,
        pastOrderType, setpastOrderType,
    } = useMyOrdersStore();

    // Filter past orders by side whenever pastOrderType changes.
    useEffect(() => {
        const filtered = pastOrder2?.filter((item: any) =>
            pastOrderType === item?.side || pastOrderType === "All"
        );
        setpastOrders(filtered ? filtered.reverse() : []);
    }, [pastOrderType]);

    const refreshMyOrders = async () => {
        if (!isAuthenticated) {
            setopenOrders([]);
            setpastOrders([]);
            return;
        }
        try {
            const mine = await ordersApi.mine(100);
            const isOpen = (s: string | undefined) =>
                s === "OPEN" || s === "NEW" || s === "PARTIALLY_FILLED";
            // Matching-service returns string decimals + a single `symbol`
            // field ("BTC-USDT"); the tables were built against the legacy
            // POC shape (ask_currency / pay_currency / avg_execution_price /
            // total_fee / numeric price / order_type). Bridge it here so the
            // UI doesn't render "undefined/undefined" or NaN.
            const toRow = (o: typeof mine[number]) => {
                const quantity = parseFloat(o.quantity);
                const filled = o.filledQty ? parseFloat(o.filledQty) : 0;
                const price = o.price ? parseFloat(o.price) : 0;
                const [base, quote] = (o.symbol ?? "").split("-");
                // ask_currency = what the user receives; pay_currency = what
                // they spend. UI formats as BUY → ask/pay, SELL → pay/ask so
                // both render as base/quote.
                const askCurrency = o.side === "BUY" ? base : quote;
                const payCurrency = o.side === "BUY" ? quote : base;
                return {
                    ...o,
                    _id: o._id ?? o.orderId,
                    order_type: o.type,
                    price,
                    quantity,
                    filled,
                    remaining: Math.max(quantity - filled, 0),
                    ask_currency: askCurrency,
                    pay_currency: payCurrency,
                    // Matching-service doesn't record avg fill price or fees
                    // (fees belong to fee-service). Fall back to the order
                    // price so Total = quantity * price rather than NaN.
                    avg_execution_price: price,
                    total_fee: 0,
                    executed_prices: [],
                };
            };
            setopenOrders(mine.filter((o) => isOpen(o.status)).map(toRow));
            setpastOrders(
                mine
                    .filter((o) => !isOpen(o.status))
                    .map(toRow)
                    .reverse(),
            );
        } catch (err) {
            alertErrorMessage(toErrorMessage(err, "Could not load your orders"));
        }
    };

    useEffect(() => {
        refreshMyOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const cancelOrder = async (orderId: string) => {
        try {
            const res = await ordersApi.cancel(orderId);
            setopenOrders((prev) => prev.filter((o) => o?.orderId !== orderId && o?._id !== orderId));
            alertSuccessMessage(`Order cancelled (${res.status || "CANCELLED"}).`);
            refreshMyOrders();
        } catch (err) {
            alertErrorMessage(toErrorMessage(err, "Cancel failed"));
        }
    };

    return {
        openOrders, pastOrders,
        orderType, setorderType,
        pastOrderType, setpastOrderType,
        refreshMyOrders, cancelOrder,
    };
}
