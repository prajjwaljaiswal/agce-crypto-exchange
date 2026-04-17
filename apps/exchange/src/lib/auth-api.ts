import type {
  AuthTokens,
  CheckIdentifierPayload,
  Country,
  GoogleLoginPayload,
  GoogleRegisterPayload,
  LoginResponse,
  MeResponse,
  PasswordLoginPayload,
  RegisterPayload,
  RegisterResponse,
  SendOtpPayload,
  UpdatePreferredCurrencyPayload,
  UpdatePreferredCurrencyResponse,
  VerifyOtpPayload,
} from '@agce/types'
import { http } from './http.js'

const BASE = '/api/v1/auth'

const COMMON_BASE = '/api/v1'

export const authApi = {
  health(): Promise<{ status: string }> {
    return http('/healthz', { auth: false })
  },

  countries(): Promise<Country[]> {
    return http(`${COMMON_BASE}/countries`, { auth: false, listResponse: true })
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

  updatePreferredCurrency(
    payload: UpdatePreferredCurrencyPayload,
  ): Promise<UpdatePreferredCurrencyResponse> {
    return http(`${BASE}/me/preferred-currency`, { method: 'PUT', body: payload })
  },

  // Google OAuth — calls the same /login and /register endpoints as password auth,
  // but with provider:'GOOGLE' + the one-time auth code from the popup flow.
  googleLogin(payload: GoogleLoginPayload): Promise<LoginResponse> {
    return http(`${BASE}/login`, { method: 'POST', body: payload, auth: false })
  },

  googleRegister(payload: GoogleRegisterPayload): Promise<RegisterResponse> {
    return http(`${BASE}/register`, { method: 'POST', body: payload, auth: false })
  },
}

export type AuthApi = typeof authApi
