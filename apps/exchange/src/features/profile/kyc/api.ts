import type {
  KycSessionResponse,
  KycStartSessionPayload,
  KycStatusResponse,
} from '@agce/types'
import { apiFetch } from '../../../lib/api/index.js'

const KYC_SESSION_ENDPOINT = '/api/v1/kyc/session'
const KYC_STATUS_ENDPOINT = '/api/v1/kyc/status'

export function startKycSession(
  payload: KycStartSessionPayload = {},
): Promise<KycSessionResponse> {
  return apiFetch<KycSessionResponse>(KYC_SESSION_ENDPOINT, {
    method: 'POST',
    body: payload,
  })
}

export function getKycStatus(): Promise<KycStatusResponse> {
  return apiFetch<KycStatusResponse>(KYC_STATUS_ENDPOINT, { method: 'GET' })
}

export function deleteKycSession(): Promise<void> {
  return apiFetch<void>(KYC_SESSION_ENDPOINT, { method: 'DELETE' })
}
