import type {
  AuthTokens,
  CheckIdentifierPayload,
  LoginResponse,
  MeResponse,
  PasswordLoginPayload,
  RegisterPayload,
  RegisterResponse,
  SendOtpPayload,
  VerifyOtpPayload,
} from '@agce/types'
import { http } from './http.js'

const BASE = '/api/v1/auth'

export const authApi = {
  health(): Promise<{ status: string }> {
    return http('/healthz', { auth: false })
  },

  checkIdentifier(payload: CheckIdentifierPayload): Promise<{ message?: string }> {
    return http(`${BASE}/check-identifier`, { method: 'POST', body: payload, auth: false })
  },

  register(payload: RegisterPayload): Promise<RegisterResponse> {
    return http(`${BASE}/register`, { method: 'POST', body: payload, auth: false })
  },

  login(payload: PasswordLoginPayload): Promise<LoginResponse> {
    return http(`${BASE}/login`, { method: 'POST', body: payload, auth: false })
  },

  sendOtp(payload: SendOtpPayload): Promise<{ message?: string }> {
    return http(`${BASE}/send-otp`, { method: 'POST', body: payload, auth: false })
  },

  verifyOtp(payload: VerifyOtpPayload): Promise<LoginResponse | { message?: string }> {
    return http(`${BASE}/verify-otp`, { method: 'POST', body: payload, auth: false })
  },

  refreshToken(refreshToken: string): Promise<AuthTokens> {
    return http(`${BASE}/refresh-token`, {
      method: 'POST',
      body: { refreshToken },
      auth: false,
    })
  },

  me(): Promise<MeResponse> {
    return http(`${BASE}/me`)
  },
}

export type AuthApi = typeof authApi
