import type { MeResponse } from '@agce/types'

// The backend currently exposes two shapes for 2FA flags: a nested `security`
// object (newer) and top-level fields (older). These selectors resolve both
// so callers don't repeat the fallback chain.

type User = MeResponse | null | undefined

export function isPasskeyBound(user: User): boolean {
  return Boolean(user?.security?.isBind?.passkey)
}

export function isGaBound(user: User): boolean {
  return Boolean(user?.security?.isBind?.googleAuthenticator)
}

export function isSmsBound(user: User): boolean {
  return Boolean(user?.security?.isBind?.mobileVerification)
}

export function isEmailBound(user: User): boolean {
  return Boolean(user?.security?.isBind?.emailVerification)
}

export function isPasskeyEnabled(user: User): boolean {
  return Boolean(user?.security?.isPasskeyEnabled ?? user?.isPasskeyEnabled)
}

export function isGoogleAuthEnabled(user: User): boolean {
  return Boolean(
    user?.security?.googleAuthenticatorEnabled ??
      user?.security?.isGoogleAuthenticatorEnabled ??
      user?.isGoogleAuthenticatorEnabled ??
      user?.googleAuthenticatorEnabled,
  )
}

export function isEmailVerified(user: User): boolean {
  return Boolean(user?.security?.emailVerification ?? user?.isEmailVerified)
}

export function isPhoneVerified(user: User): boolean {
  return Boolean(user?.security?.mobileVerification ?? user?.isPhoneVerified)
}

export function hasAntiPhishingCode(user: User): boolean {
  return Boolean(user?.antiPhishingCode || user?.hasAntiPhishingCode)
}

export function isFundPasswordSet(user: User): boolean {
  return Boolean(user?.isFundPasswordSet)
}
