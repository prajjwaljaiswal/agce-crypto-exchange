import { useCallback, useEffect, useState } from "react";
import { alertErrorMessage } from "../CustomAlertMessage";
import { ordersApi, type UserTrade } from "../../../lib/matching-api.js";
import { toErrorMessage } from "../utils/errorMessage.js";

export type MyTradeRow = {
    _id: string;
    tradeId: string;
    symbol: string;
    /** Side from the current user's perspective (BUY/SELL). */
    side: "BUY" | "SELL";
    /** Was the current user the taker (true) or maker (false)? */
    isTaker: boolean;
    price: number;
    quantity: number;
    total: number;
    base: string;
    quote: string;
    /** Legacy UI aliases so the existing table template keeps working. */
    ask_currency: string;
    pay_currency: string;
    timestamp: number;
};

export type MyTradesApi = {
    trades: MyTradeRow[];
    loading: boolean;
    refresh: () => Promise<void>;
};

/**
 * Fetches executed trades where the authenticated user was maker or
 * taker. Derives the current user's side from `takerSide` + the
 * maker/taker userIds so the UI can label each fill as BUY/SELL
 * without any per-row backend hint.
 */
export function useMyTrades(
    isAuthenticated: boolean,
    currentUserId: string | null,
): MyTradesApi {
    const [trades, setTrades] = useState<MyTradeRow[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        if (!isAuthenticated || !currentUserId) {
            setTrades([]);
            return;
        }
        setLoading(true);
        try {
            const rows = await ordersApi.myTrades(100);
            setTrades(rows.map((r) => toRow(r, currentUserId)));
        } catch (err) {
            alertErrorMessage(toErrorMessage(err, "Could not load trade history"));
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentUserId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { trades, loading, refresh };
}

function toRow(t: UserTrade, userId: string): MyTradeRow {
    const price = parseFloat(t.price);
    const quantity = parseFloat(t.quantity);
    const [base = "", quote = ""] = (t.symbol ?? "").split("-");
    const isTaker = t.takerUserId === userId;
    // Maker side is the opposite of taker side.
    const side: "BUY" | "SELL" = isTaker
        ? t.takerSide
        : t.takerSide === "BUY"
          ? "SELL"
          : "BUY";
    const askCurrency = side === "BUY" ? base : quote;
    const payCurrency = side === "BUY" ? quote : base;
    return {
        _id: t.tradeId,
        tradeId: t.tradeId,
        symbol: t.symbol,
        side,
        isTaker,
        price,
        quantity,
        total: price * quantity,
        base,
        quote,
        ask_currency: askCurrency,
        pay_currency: payCurrency,
        timestamp: Number(t.timestamp) || 0,
    };
}
