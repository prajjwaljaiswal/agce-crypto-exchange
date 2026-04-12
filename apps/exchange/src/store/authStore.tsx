import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'

const TOKEN_KEY = 'token'

interface AuthContextValue {
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readInitialToken(): string | null {
  if (typeof window === 'undefined') return null
  const existing = window.localStorage.getItem(TOKEN_KEY)
  if (existing) return existing
  if (import.meta.env.DEV) {
    // window.localStorage.setItem(TOKEN_KEY, 'dev-fake-token')
    // return 'dev-fake-token'
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readInitialToken)

  const login = useCallback((nextToken: string) => {
    window.localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ token, isAuthenticated: !!token, login, logout }),
    [token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
