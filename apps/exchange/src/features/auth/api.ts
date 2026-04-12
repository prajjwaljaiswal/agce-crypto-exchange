import type {
  AuthResponse,
  Jurisdiction,
  OtpPurpose,
  PasswordLoginPayload,
  SignupPayload,
} from '@agce/types'
import type { InstanceId } from '@agce/types'
import { apiFetch } from '../../lib/api/index.js'

const AUTH_ENDPOINT = '/api/v1/auth'
const OTP_ENDPOINT = '/api/v1/auth/otp'

const JURISDICTION_BY_INSTANCE: Record<InstanceId, Jurisdiction> = {
  india: 'INDIA',
  abudhabi: 'ABU_DHABI',
  dubai: 'DUBAI',
  global: 'GLOBAL',
}

export function jurisdictionFromInstance(instance: InstanceId): Jurisdiction {
  return JURISDICTION_BY_INSTANCE[instance]
}

export function requestOtp(identifier: string, purpose: OtpPurpose): Promise<void> {
  return apiFetch<void>(OTP_ENDPOINT, {
    method: 'POST',
    auth: false,
    body: { identifier, purpose },
  })
}

export function signup(payload: SignupPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(AUTH_ENDPOINT, {
    method: 'POST',
    auth: false,
    body: { action: 'signup', ...payload },
  })
}

export function loginWithPassword(payload: PasswordLoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(AUTH_ENDPOINT, {
    method: 'POST',
    auth: false,
    body: {
      action: 'login',
      method: 'password',
      bindIp: false,
      ...payload,
    },
  })
}
