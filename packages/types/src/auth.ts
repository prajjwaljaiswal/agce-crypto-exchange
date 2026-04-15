export type Jurisdiction = 'INDIA' | 'ABU_DHABI' | 'DUBAI' | 'GLOBAL'

export type OtpType = 'SIGNUP' | 'LOGIN' | 'RESET_PASSWORD' | 'WITHDRAWAL'

export type OtpPurpose = OtpType

// `check-identifier` uses PASSWORD_RESET, while send-otp/verify-otp use RESET_PASSWORD.
// Preserved verbatim from the backend — flagged with the team.
export type IdentifierCheckPurpose = 'SIGNUP' | 'LOGIN' | 'PASSWORD_RESET'

export interface AuthUser {
  id: string
  userId?: string
  identifier?: string
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
}

export interface RefreshTokenPayload {
  refreshToken: string
}

// Kept for backwards-compatible imports from legacy stub flows.
// TODO(phase-3): remove once signup UI is wired directly to RegisterPayload + VerifyOtpPayload.
export interface SignupPayload extends RegisterPayload {}

// Shape returned by GET /api/v1/auth/me. Full fields TBD with backend.
export type MeResponse = AuthUser

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
