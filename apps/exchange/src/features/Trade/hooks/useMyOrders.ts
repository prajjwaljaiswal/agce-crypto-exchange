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
            // Matching-service returns string decimals + filledQty; UI tables
            // were built against numeric price/quantity/filled/remaining and
            // `order_type` instead of `type`. Normalize once here.
            const toRow = (o: typeof mine[number]) => {
                const quantity = parseFloat(o.quantity);
                const filled = o.filledQty ? parseFloat(o.filledQty) : 0;
                return {
                    ...o,
                    _id: o._id ?? o.orderId,
                    order_type: o.type,
                    price: o.price ? parseFloat(o.price) : 0,
                    quantity,
                    filled,
                    remaining: Math.max(quantity - filled, 0),
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
