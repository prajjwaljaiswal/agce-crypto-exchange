export type Jurisdiction = 'INDIA' | 'ABU_DHABI' | 'DUBAI' | 'GLOBAL'

export interface Country {
  iso2: string
  name: string
  dialCode: string
  flag: string
}

export type OtpType =
  | 'SIGNUP'
  | 'LOGIN'
  | 'RESET_PASSWORD'
  | 'WITHDRAWAL'
  | 'ANTI_PHISHING'

export type OtpPurpose = OtpType

// `check-identifier` uses PASSWORD_RESET, while send-otp/verify-otp use RESET_PASSWORD.
// Preserved verbatim from the backend — flagged with the team.
export type IdentifierCheckPurpose = 'SIGNUP' | 'LOGIN' | 'PASSWORD_RESET'

export interface AuthUser {
  id: string
  userId?: string
  identifier?: string
  firstName?: string
  lastName?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface CheckIdentifierPayload {
  identifier: string
  purpose: IdentifierCheckPurpose
}

export interface RegisterPayload {
  identifier: string
  password: string
  jurisdiction: Jurisdiction
  firstName?: string
  lastName?: string
}

export interface RegisteredUser {
  id: string
  userId: string
  email?: string
  isRegistered?: boolean
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  kycStatus?: string
  kycLevel?: string
  jurisdiction?: string
}

// http() unwraps data[0] before returning, so RegisterResponse is the
// unwrapped first element of the backend's data array.
export interface RegisterResponse {
  userId: string
  accessToken: string
  refreshToken: string
  user: RegisteredUser
}

export interface PasswordLoginPayload {
  identifier: string
  password: string
  bindIp?: boolean
}

export interface TwoFactorChallenge {
  twoFactorRequired: true
}

export interface LoginSuccess extends AuthTokens {
  userId: string
}

export type LoginResponse = TwoFactorChallenge | LoginSuccess

export interface SendOtpPayload {
  identifier: string
  type: OtpType
}

export interface VerifyOtpPayload {
  identifier: string
  otp: string
  purpose: OtpPurpose
  bindIp?: boolean
}

export interface RefreshTokenPayload {
  refreshToken: string
}

// Kept for backwards-compatible imports from legacy stub flows.
// TODO(phase-3): remove once signup UI is wired directly to RegisterPayload + VerifyOtpPayload.
export interface SignupPayload extends RegisterPayload {}

// Shape returned by GET /api/v1/auth/me (unwrapped from data[0]).
export interface MeResponse extends AuthUser {
  email?: string
  isRegistered?: boolean
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  kycStatus?: string
  kycLevel?: string
  jurisdiction?: Jurisdiction | string
  preferredCurrency?: string
  // Anti-phishing: backend may return the raw code string if set, or an empty
  // string / undefined if not set. Some backends expose only `hasAntiPhishingCode`.
  antiPhishingCode?: string
  hasAntiPhishingCode?: boolean
  // Session metadata — populated by backend on /me. ISO-8601 timestamp
  // (e.g. "2026-04-17T09:32:04.512Z") and IPv4/IPv6 string.
  lastLoginAt?: string
  lastLoginIp?: string
  createdAt?: string
}

export interface UpdatePreferredCurrencyPayload {
  currency: string
}

export interface UpdatePreferredCurrencyResponse {
  preferredCurrency?: string
  message?: string
}

// POST /api/v1/auth/anti-phishing-code — set or update the user's anti-phishing code.
// Requires an OTP obtained via send-otp with type ANTI_PHISHING.
export interface SetAntiPhishingCodePayload {
  code: string
  otp: string
}

// DELETE /api/v1/auth/anti-phishing-code — remove the user's anti-phishing code.
// Requires an OTP (ANTI_PHISHING type) plus the current code as confirmation.
export interface RemoveAntiPhishingCodePayload {
  code: string
  otp: string
}

export interface AntiPhishingCodeResponse {
  antiPhishingCode?: string
  message?: string
}

// POST /api/v1/auth/change-password — authenticated password reset.
// The OTP is obtained first via send-otp (type: RESET_PASSWORD).
export interface ChangePasswordPayload {
  otp: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordResponse {
  message?: string
}

// PATCH /api/v1/auth/me — partial profile update.
// All fields are optional; backend only touches what you send.
export interface UpdateMePayload {
  firstName?: string
  lastName?: string
  profilePicture?: string
}

// Backend returns the updated MeResponse shape (may include the new values,
// may just return a message). Kept loose — caller should invalidate /me.
export interface UpdateMeResponse {
  firstName?: string
  lastName?: string
  profilePicture?: string
  message?: string
}

export interface AuthSession extends AuthTokens {
  userId: string
  user?: AuthUser
}

// Google OAuth — authorization code flow.
// `code`        : one-time auth code returned by Google (popup flow → redirectUri is 'postmessage').
// `redirectUri` : must match the value used when the code was obtained; 'postmessage' for popup.

export interface GoogleLoginPayload {
  provider: 'GOOGLE'
  code: string
  redirectUri: string
}

export interface GoogleRegisterPayload {
  provider: 'GOOGLE'
  code: string
  redirectUri: string
  jurisdiction: Jurisdiction
}
