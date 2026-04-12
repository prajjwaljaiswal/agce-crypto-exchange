import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { AuthSession } from '@agce/types'
import { AUTH_STORAGE_KEYS } from '../lib/api/index.js'

interface AuthContextValue {
  session: AuthSession | null
  accessToken: string | null
  userId: string | null
  isAuthenticated: boolean
  setSession: (session: AuthSession) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readInitialSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  const accessToken = window.localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
  const refreshToken = window.localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
  const userId = window.localStorage.getItem(AUTH_STORAGE_KEYS.USER_ID)
  const identifier = window.localStorage.getItem(AUTH_STORAGE_KEYS.IDENTIFIER)
  if (!accessToken || !userId) return null
  return {
    accessToken,
    refreshToken: refreshToken ?? '',
    userId,
    identifier: identifier ?? '',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(readInitialSession)

  const setSession = useCallback((next: AuthSession) => {
    window.localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, next.accessToken)
    window.localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, next.refreshToken)
    window.localStorage.setItem(AUTH_STORAGE_KEYS.USER_ID, next.userId)
    window.localStorage.setItem(AUTH_STORAGE_KEYS.IDENTIFIER, next.identifier)
    setSessionState(next)
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
    window.localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
    window.localStorage.removeItem(AUTH_STORAGE_KEYS.USER_ID)
    window.localStorage.removeItem(AUTH_STORAGE_KEYS.IDENTIFIER)
    setSessionState(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      accessToken: session?.accessToken ?? null,
      userId: session?.userId ?? null,
      isAuthenticated: !!session?.accessToken,
      setSession,
      logout,
    }),
    [session, setSession, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
