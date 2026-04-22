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
  | 'GOOGLE'
  | 'PHONE_VERIFY'
  | 'BIND'
  | 'FUND_PASSWORD'
  | 'OTHER'

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
  referralCode?: string
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

// Server-side identifiers for the verification channels a user can be
// challenged with at login. Mirrors the backend enum exactly.
export type LoginMethodKind = 'EMAIL' | 'MOBILE' | 'GOOGLE_AUTHENTICATOR' | 'PASSKEY'

export interface TwoFactorIsBind {
  mobileVerification?: boolean
  emailVerification?: boolean
  googleAuthenticator?: boolean
  passkey?: boolean
}

export interface TwoFactorSecurity {
  mobileVerification?: boolean
  emailVerification?: boolean
  googleAuthenticatorEnabled?: boolean
  isGoogleAuthenticatorEnabled?: boolean
  isPasskeyEnabled?: boolean
  isBind?: TwoFactorIsBind
}

// Backend login response when 2FA is required. The client infers this branch
// from the absence of an accessToken, not `twoFactorRequired` — older and
// newer backend versions disagree on that field.
//
// Newer shape: { methods: [...], security: {...} }
// Older (flat) shape: { mobileVerification, emailVerification, ... }
// Both are accepted so the UI can migrate without a coordinated deploy.
export interface TwoFactorChallenge extends TwoFactorSecurity {
  twoFactorRequired?: true
  methods?: LoginMethodKind[]
  security?: TwoFactorSecurity
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
  purpose: OtpPurpose
  bindIp?: boolean
  // Legacy single-code flows (signup, password reset, withdrawal) still send
  // `otp`. Multi-factor login sends one or more of the typed fields below,
  // letting the backend verify every configured channel in a single call.
  otp?: string
  emailOtp?: string
  mobileOtp?: string
  googleTotp?: string
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
  phone?: string
  isRegistered?: boolean
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  kycStatus?: string
  kycLevel?: string
  jurisdiction?: Jurisdiction | string
  referralCode?: string
  preferredCurrency?: string
  // Anti-phishing: backend may return the raw code string if set, or an empty
  // string / undefined if not set. Some backends expose only `hasAntiPhishingCode`.
  antiPhishingCode?: string
  hasAntiPhishingCode?: boolean
  // True once the user has registered at least one WebAuthn credential.
  isPasskeyEnabled?: boolean
  // True once the user has enabled Google Authenticator (TOTP). When true,
  // `/login` returns `twoFactorRequired: true` without sending an email/SMS
  // OTP — the client must collect a TOTP code and verify with purpose:'GOOGLE'.
  isGoogleAuthenticatorEnabled?: boolean
  googleAuthenticatorEnabled?: boolean
  // Newer backend shape: all 2FA-related flags nested under `security`.
  // Components should prefer this over the top-level fields, falling back
  // only for backwards compatibility with older responses.
  security?: TwoFactorSecurity
  isFundPasswordSet?: boolean
  // Session metadata — populated by backend on /me. ISO-8601 timestamp
  // (e.g. "2026-04-17T09:32:04.512Z") and IPv4/IPv6 string.
  lastLoginAt?: string
  lastLoginIp?: string
  createdAt?: string
}

// POST /api/v1/auth/fund-password — set fund password for the first time.
export interface SetFundPasswordPayload {
  identifier: string
  otp: string
  fundPassword: string
}

// PATCH /api/v1/auth/fund-password — change existing fund password.
export interface ChangeFundPasswordPayload {
  identifier: string
  otp: string
  currentFundPassword: string
  newFundPassword: string
}

// DELETE /api/v1/auth/fund-password — remove fund password.
export interface RemoveFundPasswordPayload {
  identifier: string
  otp: string
  fundPassword: string
}

export interface FundPasswordResponse {
  message?: string
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

export type MfaTarget = 'email' | 'mobile' | 'google'

export interface ToggleMfaPayload {
  target: MfaTarget
  otp: string
}

export interface ToggleMfaResponse {
  message?: string
}

export interface BindMfaPayload {
  target: MfaTarget
  identifier: string
  otp: string
  totp?: string
}

export interface BindMfaResponse {
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

// WebAuthn / Passkey — shapes are loose (JSON) so values produced by
// @simplewebauthn/browser pass through unchanged to the backend.
// http() unwraps data[0] before returning, so the types below reflect the
// first element of the backend's `data` array.

// POST /api/v1/auth/passkey/register-options (authenticated).
// Body: none — server identifies the user via the access token.
export interface PasskeyRegisterOptionsResponse {
  options: Record<string, unknown>
}

// POST /api/v1/auth/passkey/verify-registration (authenticated).
export interface PasskeyVerifyRegistrationPayload {
  response: Record<string, unknown>
  deviceName?: string
}

export interface PasskeyVerifyRegistrationResponse {
  credentialId: string
  deviceName?: string
  message?: string
}

// POST /api/v1/auth/passkey/login-options (public).
export interface PasskeyLoginOptionsPayload {
  identifier: string
}

export interface PasskeyLoginOptionsResponse {
  challengeId: string
  options: Record<string, unknown>
}

// POST /api/v1/auth/login — passkey variant.
export interface PasskeyLoginPayload {
  provider: 'PASSKEY'
  identifier: string
  challengeId: string
  response: Record<string, unknown>
}

// Response shape is distinct from the password LoginSuccess: `user` is nested,
// there's no top-level `userId`, and no 2FA challenge branch.
export interface PasskeyLoginSuccess {
  accessToken: string
  refreshToken: string
  user: {
    id?: string
    userId?: string
    email?: string
    firstName?: string
    lastName?: string
  }
}

// GET /api/v1/auth/passkey/list (authenticated).
export interface PasskeyListItem {
  credentialId: string
  deviceName?: string
  createdAt?: string
  lastUsedAt?: string
}

export interface PasskeyListResponse {
  passkeys: PasskeyListItem[]
}

// POST /api/v1/auth/google-authenticator (authenticated).
// http() unwraps data[0], so callers get the first element of the backend's data array.
export interface GoogleAuthSetupResponse {
  secret: string
  // Base64-encoded PNG data URI (e.g. "data:image/png;base64,iVBOR...").
  qrCode: string
}
