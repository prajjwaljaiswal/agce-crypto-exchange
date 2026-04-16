import { assetsApi, walletApi } from "../../../lib/matching-api.js";
import { useWalletsStore, type SpotWallet } from "../stores/walletsStore.js";

export type SpotWalletsApi = {
    spotWallets: SpotWallet[];
    walletsLoading: boolean;
    fetchSpotWallets: () => Promise<void>;
};

// Full wallet list for the AssetsPanel / MobileWalletsPanel.
// The active-pair "Available/Max" in the OrderForm uses a separate per-asset
// call in usePairBalance — don't merge the two concerns into this hook.
export function useSpotWallets(): SpotWalletsApi {
    const { spotWallets, walletsLoading, setSpotWallets, setWalletsLoading } = useWalletsStore();

    const fetchSpotWallets = async () => {
        setWalletsLoading(true);
        try {
            const [assets, balances] = await Promise.all([
                assetsApi.list(),
                walletApi.balances().catch(() => [] as Awaited<ReturnType<typeof walletApi.balances>>),
            ]);

            // asset code → free balance. Server returns `{ asset, free, locked }`.
            const balanceMap = new Map<string, number>();
            for (const b of balances) {
                const code = (b.asset ?? (b as any).assetCode)?.toUpperCase();
                if (!code) continue;
                const raw = b.free ?? (b as any).available ?? (b as any).balance ?? '0';
                const val = parseFloat(raw);
                if (Number.isFinite(val)) balanceMap.set(code, val);
            }

            const wallets: SpotWallet[] = assets
                .filter((a) => a.isActive)
                .map((a) => ({
                    assetCode: a.assetCode,
                    short_name: a.assetCode,
                    full_name: a.name,
                    icon_path: a.iconUrl,
                    balance: balanceMap.get(a.assetCode.toUpperCase()) ?? 0,
                    decimals: a.decimals,
                    category: a.category,
                    isActive: a.isActive,
                }));

            setSpotWallets(wallets);
        } catch {
            // silently fail — wallet list is non-critical
        } finally {
            setWalletsLoading(false);
        }
    };

    return { spotWallets, walletsLoading, fetchSpotWallets };
}