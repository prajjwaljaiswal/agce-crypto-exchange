import { useMutation, useQuery } from '@tanstack/react-query'
import { assetsApi, custodyApi } from '../../lib/matching-api.js'

export function useAssets() {
  return useQuery({
    queryKey: ['assets'],
    queryFn: ({ signal }) => assetsApi.list(signal),
    staleTime: 5 * 60_000,
  })
}

export function useNetworks(assetCode: string) {
  return useQuery({
    queryKey: ['assets', assetCode, 'networks'],
    queryFn: ({ signal }) => assetsApi.networks(assetCode, signal),
    enabled: Boolean(assetCode),
    staleTime: 5 * 60_000,
  })
}

export function useGenerateDepositAddress() {
  return useMutation({
    mutationFn: (fireblocksAssetId: string) =>
      custodyApi.depositAddress(fireblocksAssetId),
  })
}

export function useDepositHistory() {
  // Temporarily disabled - /deposits endpoint not yet implemented in custody_service
  // TODO: implement GET /api/v1/custody/deposits in backend
  return useQuery({
    queryKey: ['custody', 'deposits'],
    queryFn: () => Promise.resolve([]), // Return empty array for now
    staleTime: 30_000,
    enabled: false, // Disable the query to avoid 404 errors
  })
}
