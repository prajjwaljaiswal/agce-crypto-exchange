import { useCallback, useState } from 'react'
import type {
  AuthResponse,
  OtpPurpose,
  PasswordLoginPayload,
  SignupPayload,
} from '@agce/types'
import { ApiError } from '../../lib/api/index.js'
import { loginWithPassword, requestOtp, signup } from './api.js'

interface AsyncState<TData> {
  data: TData | null
  error: string | null
  isPending: boolean
}

function initialState<T>(): AsyncState<T> {
  return { data: null, error: null, isPending: false }
}

function toErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message
  if (err instanceof Error) return err.message
  return 'Something went wrong. Please try again.'
}

export function useRequestOtp() {
  const [state, setState] = useState<AsyncState<true>>(() => initialState<true>())

  const mutate = useCallback(async (identifier: string, purpose: OtpPurpose) => {
    setState({ data: null, error: null, isPending: true })
    try {
      await requestOtp(identifier, purpose)
      setState({ data: true, error: null, isPending: false })
      return true
    } catch (err) {
      setState({ data: null, error: toErrorMessage(err), isPending: false })
      throw err
    }
  }, [])

  return { ...state, mutate }
}

export function useSignup() {
  const [state, setState] = useState<AsyncState<AuthResponse>>(() =>
    initialState<AuthResponse>(),
  )

  const mutate = useCallback(async (payload: SignupPayload) => {
    setState({ data: null, error: null, isPending: true })
    try {
      const data = await signup(payload)
      setState({ data, error: null, isPending: false })
      return data
    } catch (err) {
      setState({ data: null, error: toErrorMessage(err), isPending: false })
      throw err
    }
  }, [])

  return { ...state, mutate }
}

export function useLogin() {
  const [state, setState] = useState<AsyncState<AuthResponse>>(() =>
    initialState<AuthResponse>(),
  )

  const mutate = useCallback(async (payload: PasswordLoginPayload) => {
    setState({ data: null, error: null, isPending: true })
    try {
      const data = await loginWithPassword(payload)
      setState({ data, error: null, isPending: false })
      return data
    } catch (err) {
      setState({ data: null, error: toErrorMessage(err), isPending: false })
      throw err
    }
  }, [])

  return { ...state, mutate }
}
