interface JwtPayload {
  exp?: number
  iat?: number
  [key: string]: unknown
}

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4
  const full = pad ? padded + '='.repeat(4 - pad) : padded
  return atob(full)
}

export function parseJwtPayload(token: string): JwtPayload | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const json = base64UrlDecode(parts[1]!)
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

/**
 * Returns the token's expiry in epoch milliseconds, or null if the token is
 * malformed or has no `exp` claim. Not all backends issue JWTs — callers must
 * fall back to reactive refresh if this returns null.
 */
export function getJwtExpMs(token: string): number | null {
  const payload = parseJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') return null
  return payload.exp * 1000
}
