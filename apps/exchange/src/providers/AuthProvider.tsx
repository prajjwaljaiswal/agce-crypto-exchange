import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { AuthTokens, AuthUser, MeResponse } from '@agce/types'
import { authApi } from '../lib/auth-api.js'
import { tokenStore, TOKEN_STORAGE_KEYS } from '../lib/tokenStore.js'
import { AUTH_EXPIRED_EVENT } from '../lib/http.js'
import { refreshAccessToken } from '../lib/refresh.js'
import { getJwtExpMs } from '../lib/jwt.js'

// Refresh this many ms before the access token is due to expire.
const REFRESH_LEAD_MS = 60_000
// If the token is already nearly-expired (or lacks an exp claim), schedule
// this far out instead of refreshing immediately in a tight loop.
const MIN_REFRESH_DELAY_MS = 5_000

export type AuthStatus = 'loading' | 'authenticated' | 'guest'

interface AuthContextValue {
  status: AuthStatus
  isAuthenticated: boolean
  user: AuthUser | null
  login: (tokens: AuthTokens, user?: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const ME_QUERY_KEY = ['auth', 'me'] as const

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [hasSession, setHasSession] = useState<boolean>(() =>
    Boolean(tokenStore.getRefresh()),
  )

  const meQuery = useQuery<MeResponse>({
    queryKey: ME_QUERY_KEY,
    queryFn: () => authApi.me(),
    enabled: hasSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  // If /me fails after refresh retries, the session is dead.
  useEffect(() => {
    if (meQuery.isError && hasSession) {
      tokenStore.clear()
      setHasSession(false)
      queryClient.removeQueries({ queryKey: ME_QUERY_KEY })
    }
  }, [meQuery.isError, hasSession, queryClient])

  // http wrapper emits this when refresh-token fails.
  useEffect(() => {
    const handleExpired = () => {
      setHasSession(false)
      queryClient.removeQueries({ queryKey: ME_QUERY_KEY })
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired)
  }, [queryClient])

  // Cross-tab sync: if another tab logs in/out, follow.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== TOKEN_STORAGE_KEYS.refresh) return
      const nextHasSession = Boolean(event.newValue)
      setHasSession(nextHasSession)
      if (nextHasSession) {
        queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
      } else {
        queryClient.removeQueries({ queryKey: ME_QUERY_KEY })
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [queryClient])

  // Pre-emptive token refresh: schedule a refresh ~60s before the access token
  // expires. Reschedules whenever the stored access token changes. Falls back
  // to the reactive 401 path if the token is opaque (no JWT exp claim).
  useEffect(() => {
    if (!hasSession) return

    let cancelled = false
    let timer: number | undefined

    const schedule = () => {
      const accessToken = tokenStore.getAccess()
      if (!accessToken) return
      const expMs = getJwtExpMs(accessToken)
      if (expMs == null) return
      const delay = Math.max(expMs - Date.now() - REFRESH_LEAD_MS, MIN_REFRESH_DELAY_MS)
      timer = window.setTimeout(async () => {
        if (cancelled) return
        const ok = await refreshAccessToken()
        if (cancelled) return
        if (!ok) {
          tokenStore.clear()
          setHasSession(false)
          queryClient.removeQueries({ queryKey: ME_QUERY_KEY })
          return
        }
        schedule()
      }, delay)
    }

    schedule()
    return () => {
      cancelled = true
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [hasSession, queryClient])

  const login = useCallback(
    (tokens: AuthTokens, user?: AuthUser) => {
      tokenStore.set(tokens)
      setHasSession(true)
      if (user) {
        queryClient.setQueryData<MeResponse>(ME_QUERY_KEY, user)
      } else {
        queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
      }
    },
    [queryClient],
  )

  const logout = useCallback(() => {
    tokenStore.clear()
    setHasSession(false)
    // Wipe everything, not just auth. Any cached user-scoped data (balances,
    // orders, KYC status) should disappear with the session.
    queryClient.clear()
  }, [queryClient])

  const status: AuthStatus = useMemo(() => {
    if (!hasSession) return 'guest'
    if (meQuery.isSuccess) return 'authenticated'
    if (meQuery.isError) return 'guest'
    return 'loading'
  }, [hasSession, meQuery.isSuccess, meQuery.isError])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isAuthenticated: status === 'authenticated',
      user: meQuery.data ?? null,
      login,
      logout,
    }),
    [status, meQuery.data, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
