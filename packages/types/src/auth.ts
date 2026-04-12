export type Jurisdiction = 'INDIA' | 'ABU_DHABI' | 'DUBAI' | 'GLOBAL'

export type OtpPurpose = 'SIGNUP' | 'LOGIN'

export interface AuthUser {
  userId: string
  identifier: string
  isRegistered?: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthSession extends AuthTokens {
  userId: string
  identifier: string
}

export interface OtpRequestPayload {
  identifier: string
  purpose: OtpPurpose
}

export interface SignupPayload {
  identifier: string
  otp: string
  password: string
  jurisdiction: Jurisdiction
}

export interface PasswordLoginPayload {
  identifier: string
  password: string
  otp: string
  bindIp?: boolean
}

export interface AuthResponse extends AuthTokens {
  userId: string
  user: AuthUser
}
