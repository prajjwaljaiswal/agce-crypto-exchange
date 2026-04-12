import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  DiditStatus,
  KycSessionResponse,
  KycStartSessionPayload,
  KycStatusResponse,
} from '@agce/types'
import { ApiError } from '../../../lib/api/index.js'
import { useAuth } from '../../../store/authStore.js'
import { getKycStatus, startKycSession } from './api.js'

const POLL_INTERVAL_MS = 5000
const POLLING_STATUSES: ReadonlySet<DiditStatus> = new Set<DiditStatus>([
  'In Progress',
  'In Review',
  'Resubmitted',
])

interface KycStatusState {
  data: KycStatusResponse | null
  error: string | null
  isLoading: boolean
}

function toErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message
  if (err instanceof Error) return err.message
  return 'Failed to load KYC status'
}

export function useKycStatus() {
  const { isAuthenticated } = useAuth()
  const [state, setState] = useState<KycStatusState>({
    data: null,
    error: null,
    isLoading: false,
  })
  const abortRef = useRef<AbortController | null>(null)

  const refetch = useCallback(async () => {
    abortRef.current?.abort()
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const data = await getKycStatus()
      setState({ data, error: null, isLoading: false })
      return data
    } catch (err) {
      setState({ data: null, error: toErrorMessage(err), isLoading: false })
      return null
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setState({ data: null, error: null, isLoading: false })
      return
    }
    void refetch()
  }, [isAuthenticated, refetch])

  useEffect(() => {
    const status = state.data?.status
    if (!status || !POLLING_STATUSES.has(status)) return
    const id = window.setInterval(() => {
      void refetch()
    }, POLL_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [state.data?.status, refetch])

  return { ...state, refetch }
}

interface StartSessionState {
  data: KycSessionResponse | null
  error: string | null
  isPending: boolean
}

export function useStartKycSession() {
  const [state, setState] = useState<StartSessionState>({
    data: null,
    error: null,
    isPending: false,
  })

  const mutate = useCallback(async (payload: KycStartSessionPayload = {}) => {
    setState({ data: null, error: null, isPending: true })
    try {
      const data = await startKycSession(payload)
      setState({ data, error: null, isPending: false })
      return data
    } catch (err) {
      setState({ data: null, error: toErrorMessage(err), isPending: false })
      throw err
    }
  }, [])

  return { ...state, mutate }
}
