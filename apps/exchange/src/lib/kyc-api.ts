import type { KycSessionResponse, KycStartSessionPayload, KycStatusResponse } from '@agce/types'
import { http } from './http.js'

const BASE = '/api/v1/kyc'

export const kycApi = {
  startSession(payload: KycStartSessionPayload = {}): Promise<KycSessionResponse> {
    return http(`${BASE}/session`, { method: 'POST', body: payload })
  },

  getStatus(): Promise<KycStatusResponse> {
    return http(`${BASE}/status`)
  },
}
