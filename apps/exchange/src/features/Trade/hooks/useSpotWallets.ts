import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { walletApi, assetsApi, type Asset } from "../../../lib/matching-api.js";
import { useWalletsStore, type SpotWallet } from "../stores/walletsStore.js";
import { useAuth } from "../../../providers/AuthProvider.js";

export type SpotWalletsApi = {
    spotWallets: SpotWallet[];
    walletsLoading: boolean;
    fetchSpotWallets: () => Promise<void>;
};

function toAbsoluteIconUrl(iconPath?: string): string | undefined {
    if (!iconPath) return undefined;
    if (/^https?:\/\//i.test(iconPath)) return iconPath;
    const env = import.meta.env as Record<string, string | undefined>;
    const base = (env.VITE_MATCHING_API_URL ?? env.VITE_AUTH_API_URL ?? "").replace(/\/+$/, "");
    if (!base) return iconPath;
    const normalized = iconPath.startsWith("/") ? iconPath : `/${iconPath}`;
    return `${base}${normalized}`;
}

const ESTIMATED_BALANCE_KEY = ["wallet", "estimated-balance"] as const;
const ASSETS_META_KEY = ["assets", "list"] as const;

/**
 * Wallet list for the AssetsPanel / MobileWalletsPanel.
 *
 * Shares the React Query cache with Asset Overview (same `['wallet',
 * 'estimated-balance']` key) so both pages always render identical numbers.
 * Socket balance events invalidate this cache — no hand-maintained free/locked
 * math that can drift after order place/cancel.
 *
 * The active-pair "Available/Max" in the OrderForm still uses a separate
 * per-asset call in usePairBalance for freshness right before order submit.
 */
export function useSpotWallets(): SpotWalletsApi {
    const { isAuthenticated } = useAuth();
    const { setSpotWallets, setWalletsLoading } = useWalletsStore();
    const queryClient = useQueryClient();

    const estimatedQuery = useQuery({
        queryKey: ESTIMATED_BALANCE_KEY,
        queryFn: ({ signal }) => walletApi.estimatedBalance(signal),
        enabled: isAuthenticated,
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });

    const assetsQuery = useQuery({
        queryKey: ASSETS_META_KEY,
        queryFn: ({ signal }) => assetsApi.list(signal),
        staleTime: 5 * 60_000,
    });

    const spotWallets = useMemo<SpotWallet[]>(() => {
        const estimated = estimatedQuery.data;
        const assets = assetsQuery.data ?? [];
        if (!estimated?.assets) return [];

        const assetMeta = new Map<string, Asset>();
        for (const a of assets) assetMeta.set(a.assetCode.toUpperCase(), a);

        const toNum = (raw?: string): number => {
            if (!raw) return 0;
            const n = parseFloat(raw);
            return Number.isFinite(n) ? n : 0;
        };

        return estimated.assets.map((row) => {
            const code = row.asset.toUpperCase();
            const meta = assetMeta.get(code);
            const free = toNum(row.free);
            const locked = toNum(row.locked);
            const total = toNum(row.total) || free + locked;
            const icon = row.iconPath || meta?.iconUrl;
            return {
                assetCode: row.asset,
                short_name: row.asset,
                full_name: meta?.name ?? row.asset,
                icon_path: toAbsoluteIconUrl(icon) ?? icon ?? "",
                balance: total,
                free,
                locked,
                decimals: meta?.decimals ?? 8,
                category: meta?.category ?? "CRYPTO",
                isActive: meta?.isActive ?? true,
            };
        });
    }, [estimatedQuery.data, assetsQuery.data]);

    // Keep the Zustand store in sync — the socket hook and other consumers
    // still read from it. Single write-point to avoid divergence.
    useEffect(() => {
        setSpotWallets(spotWallets);
    }, [spotWallets, setSpotWallets]);

    useEffect(() => {
        setWalletsLoading(estimatedQuery.isLoading);
    }, [estimatedQuery.isLoading, setWalletsLoading]);

    const fetchSpotWallets = async () => {
        await queryClient.invalidateQueries({ queryKey: ESTIMATED_BALANCE_KEY });
    };

    return {
        spotWallets,
        walletsLoading: estimatedQuery.isLoading,
        fetchSpotWallets,
    };
}
