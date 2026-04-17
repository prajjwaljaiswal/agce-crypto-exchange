import { useEffect } from "react";
import { useWalletsStore } from "../stores/walletsStore.js";

/**
 * Listens for per-user balance pushes from market-data-service.
 *
 * When wallet-service mutates a Balance row (order hold, order release,
 * trade fill, withdrawal, deposit, fee…) it publishes to the Kafka
 * topic `wallet.balance-updates`. market-data-service consumes that
 * topic and re-emits each update to the Socket.IO room
 * `user:balance:<userId>`, which the server auto-joins on auth.
 *
 * Event payload (from wallet.service.publishBalanceUpdate):
 *   {
 *     userId, asset, side: "CREDIT"|"DEBIT",
 *     amount, reason, balanceAfter, referenceId, instance, ts
 *   }
 *
 * We update three pieces of state on every event:
 *   - `spotWallets[asset].balance` for the Assets panel list
 *   - `BuyCoinBal`  if asset is the active pair's quote currency
 *   - `SellCoinBal` if asset is the active pair's base currency
 *
 * No REST refetch after place/cancel — the socket push is the source
 * of truth.
 */
export function useUserBalanceSocket(
    SelectedCoin: any,
    getSocket: () => any,
    isConnected: boolean,
) {
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !isConnected) return undefined;

        const handle = (event: any) => {
            const e = event?.payload ?? event;
            const asset = String(e?.asset ?? "").toUpperCase();
            const after = parseFloat(e?.balanceAfter ?? "0");
            if (!asset || !Number.isFinite(after)) return;

            const store = useWalletsStore.getState();

            // 1. Update per-active-pair balances if applicable.
            if (asset === String(SelectedCoin?.quote_currency ?? "").toUpperCase()) {
                store.setBuyCoinBal(after);
            }
            if (asset === String(SelectedCoin?.base_currency ?? "").toUpperCase()) {
                store.setSellCoinBal(after);
            }

            // 2. Update the wallet list (AssetsPanel) if this asset is tracked.
            const next = store.spotWallets.map((w) =>
                w.assetCode?.toUpperCase() === asset
                    ? { ...w, balance: after }
                    : w,
            );
            store.setSpotWallets(next);
        };

        socket.on("user:balance:update", handle);
        return () => {
            socket.off("user:balance:update", handle);
        };
    }, [
        SelectedCoin?.base_currency,
        SelectedCoin?.quote_currency,
        getSocket,
        isConnected,
    ]);
}