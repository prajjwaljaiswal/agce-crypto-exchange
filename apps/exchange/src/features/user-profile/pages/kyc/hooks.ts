import { useMutation, useQuery } from '@tanstack/react-query'
import type { KycStartSessionPayload } from '@agce/types'
import { kycApi } from '../../../../lib/kyc-api.js'

export function useKycStatus() {
  return useQuery({
    queryKey: ['kyc', 'status'],
    queryFn: () => kycApi.getStatus(),
    retry: 0,
    refetchInterval: (query) => {
      const s = query.state.data?.status
      return s === 'IN_PROGRESS' || s === 'IN_REVIEW' || s === 'RESUBMITTED' ? 5000 : false
    },
    staleTime: 10_000,
  })
}

export function useStartKyc() {
  return useMutation({
    mutationFn: (payload: KycStartSessionPayload) => kycApi.startSession(payload),
  })
}
