import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const TOKEN_KEY = 'agce_auth_token'

interface AuthContextValue {
  isAuthenticated: boolean
  token: string | null
  login: (token?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readInitialToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readInitialToken)

  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key !== TOKEN_KEY) return
      setToken(e.newValue)
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const login = useCallback((value = 'stub-session') => {
    try {
      localStorage.setItem(TOKEN_KEY, value)
    } catch {
      /* noop */
    }
    setToken(value)
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* noop */
    }
    setToken(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token),
      token,
      login,
      logout,
    }),
    [token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
