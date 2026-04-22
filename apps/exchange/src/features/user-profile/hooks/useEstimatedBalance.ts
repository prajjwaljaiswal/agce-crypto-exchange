import { useQuery } from '@tanstack/react-query'
import { walletApi } from '../../../lib/matching-api.js'
import { useAuth } from '../../../providers/index.js'

// GET /api/v1/wallet/estimated-balance — aggregated portfolio value in the
// user's preferred currency, plus per-asset breakdown. Auth required, so the
// query is gated on an authenticated session to avoid unauthorised calls from
// persistently-mounted consumers (e.g. the top-nav UserHeader).
export function useEstimatedBalance() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['wallet', 'estimated-balance'],
    queryFn: ({ signal }) => walletApi.estimatedBalance(signal),
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })
}
