import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { assetsApi, custodyApi } from '../../lib/matching-api.js'

export function useAssets(search = '') {
  return useQuery({
    queryKey: ['assets', search],
    queryFn: ({ signal }) => assetsApi.list(signal, search),
    staleTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  })
}

export function useNetworks(assetCode: string, search = '') {
  return useQuery({
    queryKey: ['assets', assetCode, 'networks', search],
    queryFn: ({ signal }) => assetsApi.networks(assetCode, signal, search),
    enabled: Boolean(assetCode),
    staleTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  })
}

export function useGenerateDepositAddress() {
  return useMutation({
    mutationFn: (payload: { asset: string; network: string }) =>
      custodyApi.depositAddress(payload),
  })
}

export function useCustodyOverview() {
  return useMutation({
    mutationFn: () => custodyApi.me(),
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
