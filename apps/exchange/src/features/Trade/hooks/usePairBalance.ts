import { useCallback, useEffect, useRef } from "react";
import { walletApi } from "../../../lib/matching-api.js";
import { useWalletsStore } from "../stores/walletsStore.js";

/**
 * Fetches the balance of the ONE asset the user needs for the active tab:
 *   - Buy tab  → quote currency (e.g. USDT for BTC-USDT) → BuyCoinBal
 *   - Sell tab → base  currency (e.g. BTC  for BTC-USDT) → SellCoinBal
 *
 * Uses per-asset REST: GET /api/v1/wallet/balances/:asset.
 * Separate from useSpotWallets which powers the full-wallet AssetsPanel.
 */
export function usePairBalance(
    selectedCoin: any,
    showBuySellTab: "" | "buy" | "sell" | string,
) {
    const { setBuyCoinBal, setSellCoinBal } = useWalletsStore();

    // Track latest pair + side in refs so `refresh` is callable no-arg
    // from order place / cancel / reconnect callbacks.
    const coinRef = useRef(selectedCoin);
    const sideRef = useRef(showBuySellTab);
    useEffect(() => { coinRef.current = selectedCoin; }, [selectedCoin]);
    useEffect(() => { sideRef.current = showBuySellTab; }, [showBuySellTab]);

    const refresh = useCallback(async () => {
        const coin = coinRef.current;
        const base = coin?.base_currency;
        const quote = coin?.quote_currency;
        if (!base || !quote) return;

        // Default to "buy" when the tab is empty (desktop initial render).
        const side = sideRef.current || "buy";
        const asset = side === "sell" ? base : quote;

        try {
            const bal = await walletApi.balance(asset);
            const raw = bal?.free ?? (bal as any)?.available ?? "0";
            const val = parseFloat(raw);
            const num = Number.isFinite(val) ? val : 0;
            if (side === "sell") setSellCoinBal(num);
            else setBuyCoinBal(num);
        } catch {
            // non-critical — leave previous value
        }
    }, [setBuyCoinBal, setSellCoinBal]);

    // Auto-refresh when the pair or active side changes.
    useEffect(() => {
        const base = selectedCoin?.base_currency;
        const quote = selectedCoin?.quote_currency;
        if (!base || !quote) return;
        refresh();
    }, [selectedCoin?.base_currency, selectedCoin?.quote_currency, showBuySellTab, refresh]);

    return { refreshPairBalance: refresh };
}
