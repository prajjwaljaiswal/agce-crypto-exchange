import type { AuthTokens } from '@agce/types'
import type { ApiEnvelope } from './http.js'
import { tokenStore } from './tokenStore.js'

let inFlight: Promise<boolean> | null = null

function getBaseUrl(): string {
  const raw = (import.meta.env as Record<string, string>)['VITE_AUTH_API_URL']
  if (!raw) {
    throw new Error(
      'VITE_AUTH_API_URL is not set. Add it to apps/exchange/.env — see .env.example.',
    )
  }
  return raw.replace(/\/+$/, '')
}

/**
 * Exchanges the stored refresh token for a fresh pair. Returns true on success.
 *
 * - Coalesces concurrent callers onto a single network request so multiple 401s
 *   firing at once don't each fire their own /refresh-token call.
 * - Intentionally uses a direct fetch (not authApi → http) to avoid an ESM
 *   import cycle: http.ts delegates 401 recovery here, and authApi.ts imports
 *   http.ts for its own endpoints.
 */
export async function refreshAccessToken(): Promise<boolean> {
  if (inFlight) return inFlight

  const refreshToken = tokenStore.getRefresh()
  if (!refreshToken) return false

  inFlight = (async () => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
      if (!response.ok) return false
      const body = (await response.json()) as ApiEnvelope<AuthTokens>
      if (!body.success || !body.data[0]) return false
      tokenStore.set(body.data[0])
      return true
    } catch {
      return false
    } finally {
      inFlight = null
    }
  })()

  return inFlight
}
