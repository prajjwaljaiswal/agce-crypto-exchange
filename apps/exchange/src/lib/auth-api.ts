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
  ChangePasswordPayload,
  ChangePasswordResponse,
  SetAntiPhishingCodePayload,
  RemoveAntiPhishingCodePayload,
  AntiPhishingCodeResponse,
  UpdateMePayload,
  UpdateMeResponse,
  UpdatePreferredCurrencyPayload,
  UpdatePreferredCurrencyResponse,
  VerifyOtpPayload,
  PasskeyRegisterOptionsResponse,
  PasskeyVerifyRegistrationPayload,
  PasskeyVerifyRegistrationResponse,
  PasskeyLoginOptionsPayload,
  PasskeyLoginOptionsResponse,
  PasskeyLoginPayload,
  PasskeyLoginSuccess,
  PasskeyListResponse,
  GoogleAuthSetupResponse,
  ToggleMfaPayload,
  ToggleMfaResponse,
  BindMfaPayload,
  BindMfaResponse,
  SetFundPasswordPayload,
  ChangeFundPasswordPayload,
  RemoveFundPasswordPayload,
  FundPasswordResponse,
} from '@agce/types'
import { http } from './http.js'

const BASE = '/api/v1/auth'

// Passkey routes are served directly under `/auth/*` at the gateway — no
// `/api/v1` prefix, unlike the rest of the auth service.
const PASSKEY_BASE = '/api/v1/auth'

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

  updateMe(payload: UpdateMePayload): Promise<UpdateMeResponse> {
    return http(`${BASE}/me`, { method: 'PATCH', body: payload })
  },

  changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResponse> {
    return http(`${BASE}/change-password`, { method: 'POST', body: payload })
  },

  setAntiPhishingCode(
    payload: SetAntiPhishingCodePayload,
  ): Promise<AntiPhishingCodeResponse> {
    return http(`${BASE}/anti-phishing-code`, { method: 'POST', body: payload })
  },

  removeAntiPhishingCode(
    payload: RemoveAntiPhishingCodePayload,
  ): Promise<AntiPhishingCodeResponse> {
    return http(`${BASE}/anti-phishing-code`, { method: 'DELETE', body: payload })
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

  // ── Passkey / WebAuthn ──
  // Registration (authenticated): two legs.
  passkeyRegisterOptions(): Promise<PasskeyRegisterOptionsResponse> {
    return http(`${PASSKEY_BASE}/passkey/register-options`, { method: 'POST' })
  },

  passkeyVerifyRegistration(
    payload: PasskeyVerifyRegistrationPayload,
  ): Promise<PasskeyVerifyRegistrationResponse> {
    return http(`${PASSKEY_BASE}/passkey/verify-registration`, {
      method: 'POST',
      body: payload,
    })
  },

  // Login (public): get options+challengeId, then post assertion to /auth/login.
  passkeyLoginOptions(
    payload: PasskeyLoginOptionsPayload,
  ): Promise<PasskeyLoginOptionsResponse> {
    return http(`${PASSKEY_BASE}/passkey/login-options`, {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },

  loginWithPasskey(payload: PasskeyLoginPayload): Promise<PasskeyLoginSuccess> {
    return http(`${PASSKEY_BASE}/login`, {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },

  // Management (authenticated).
  passkeyList(): Promise<PasskeyListResponse> {
    return http(`${PASSKEY_BASE}/passkey/list`)
  },

  passkeyDelete(credentialId: string): Promise<{ message?: string }> {
    return http(`${PASSKEY_BASE}/passkey/${encodeURIComponent(credentialId)}`, {
      method: 'DELETE',
    })
  },

  toggleMfa(payload: ToggleMfaPayload): Promise<ToggleMfaResponse> {
    return http(`${BASE}/toggle-mfa`, { method: 'POST', body: payload })
  },

  bindMfa(payload: BindMfaPayload): Promise<BindMfaResponse> {
    return http(`${BASE}/bind-mfa`, { method: 'POST', body: payload })
  },

  // ── Fund Password ──
  setFundPassword(payload: SetFundPasswordPayload): Promise<FundPasswordResponse> {
    return http(`${BASE}/fund-password`, { method: 'POST', body: payload })
  },

  changeFundPassword(payload: ChangeFundPasswordPayload): Promise<FundPasswordResponse> {
    return http(`${BASE}/fund-password`, { method: 'PATCH', body: payload })
  },

  removeFundPassword(payload: RemoveFundPasswordPayload): Promise<FundPasswordResponse> {
    return http(`${BASE}/fund-password`, { method: 'DELETE', body: payload })
  },

  // ── Google Authenticator (TOTP) ──
  // Enable: returns the TOTP secret + a base64-encoded QR data URI for the user
  // to scan with their authenticator app. Account flag flips server-side.
  googleAuthSetup(): Promise<GoogleAuthSetupResponse> {
    return http(`${BASE}/google-authenticator`, { method: 'POST', body: {} })
  },

  // Disable: removes the stored secret. Backend returns the updated MeResponse,
  // but we drop the body — callers invalidate the ['auth','me'] query instead.
  googleAuthDisable(): Promise<MeResponse> {
    return http(`${BASE}/google-authenticator`, { method: 'DELETE' })
  },
}

export type AuthApi = typeof authApi
