import { useCallback, useEffect, useRef } from "react";
import { walletApi } from "../../../lib/matching-api.js";
import { useWalletsStore } from "../stores/walletsStore.js";

/**
 * Fetches balances for BOTH legs of the selected pair in parallel:
 *   - quote currency (e.g. USDT for BTC-USDT) → BuyCoinBal
 *   - base  currency (e.g. BTC  for BTC-USDT) → SellCoinBal
 *
 * The AssetsPanel shows both balances regardless of the active tab, so
 * fetching only the active-side asset (as before) left the other leg
 * stuck at 0.
 *
 * Uses per-asset REST: GET /api/v1/wallet/balances/:asset.
 * Separate from useSpotWallets which powers the full-wallet list.
 */
export function usePairBalance(
    selectedCoin: any,
    _showBuySellTab: "" | "buy" | "sell" | string,
) {
    const { setBuyCoinBal, setSellCoinBal } = useWalletsStore();

    // Track latest pair in a ref so `refresh` is callable no-arg from
    // order place / cancel / reconnect callbacks.
    const coinRef = useRef(selectedCoin);
    useEffect(() => { coinRef.current = selectedCoin; }, [selectedCoin]);

    const refresh = useCallback(async () => {
        const coin = coinRef.current;
        const base = coin?.base_currency;
        const quote = coin?.quote_currency;
        if (!base || !quote) return;

        const toNum = (bal: any): number => {
            const raw = bal?.free ?? bal?.available ?? "0";
            const n = parseFloat(raw);
            return Number.isFinite(n) ? n : 0;
        };

        const [quoteRes, baseRes] = await Promise.allSettled([
            walletApi.balance(quote),
            walletApi.balance(base),
        ]);
        if (quoteRes.status === "fulfilled") setBuyCoinBal(toNum(quoteRes.value));
        if (baseRes.status === "fulfilled") setSellCoinBal(toNum(baseRes.value));
    }, [setBuyCoinBal, setSellCoinBal]);

    // Auto-refresh when the pair changes.
    useEffect(() => {
        const base = selectedCoin?.base_currency;
        const quote = selectedCoin?.quote_currency;
        if (!base || !quote) return;
        refresh();
    }, [selectedCoin?.base_currency, selectedCoin?.quote_currency, refresh]);

    return { refreshPairBalance: refresh };
}
