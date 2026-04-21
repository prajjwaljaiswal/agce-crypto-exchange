import { useQuery } from '@tanstack/react-query'
import { walletApi } from '../../../lib/matching-api.js'

// GET /api/v1/wallet/estimated-balance — aggregated portfolio value in the
// user's preferred currency, plus per-asset breakdown. Auth required.
export function useEstimatedBalance() {
  return useQuery({
    queryKey: ['wallet', 'estimated-balance'],
    queryFn: ({ signal }) => walletApi.estimatedBalance(signal),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })
}
