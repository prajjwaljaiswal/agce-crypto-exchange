import type { AuthTokens } from '@agce/types'

const ACCESS_KEY = 'agce_access_token'
const REFRESH_KEY = 'agce_refresh_token'

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* noop */
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* noop */
  }
}

export const tokenStore = {
  getAccess(): string | null {
    return safeGet(ACCESS_KEY)
  },
  getRefresh(): string | null {
    return safeGet(REFRESH_KEY)
  },
  set(tokens: AuthTokens): void {
    safeSet(ACCESS_KEY, tokens.accessToken)
    safeSet(REFRESH_KEY, tokens.refreshToken)
  },
  clear(): void {
    safeRemove(ACCESS_KEY)
    safeRemove(REFRESH_KEY)
  },
}

export const TOKEN_STORAGE_KEYS = {
  access: ACCESS_KEY,
  refresh: REFRESH_KEY,
} as const
