import { tokenStore } from './tokenStore.js'
import { refreshAccessToken } from './refresh.js'

export interface ApiEnvelope<T> {
  success: boolean
  data: T[]
  message?: string
}

export interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
  auth?: boolean
  signal?: AbortSignal
}

export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export const AUTH_EXPIRED_EVENT = 'agce:auth-expired'

function getBaseUrl(): string {
  const raw = (import.meta.env as Record<string, string>)['VITE_AUTH_API_URL']
  if (!raw) {
    throw new Error(
      'VITE_AUTH_API_URL is not set. Add it to apps/exchange/.env — see .env.example.',
    )
  }
  return raw.replace(/\/+$/, '')
}

function buildHeaders(opts: HttpOptions): Headers {
  const headers = new Headers(opts.headers)
  if (opts.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (opts.auth !== false) {
    const token = tokenStore.getAccess()
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }
  return headers
}

async function parseEnvelope<T>(response: Response): Promise<T> {
  const text = await response.text()
  let body: ApiEnvelope<T> | undefined
  if (text) {
    try {
      body = JSON.parse(text) as ApiEnvelope<T>
    } catch {
      throw new ApiError(
        `Non-JSON response from ${response.url} (status ${response.status})`,
        response.status,
      )
    }
  }

  if (!response.ok || (body && body.success === false)) {
    const message = body?.message ?? `Request failed with status ${response.status}`
    throw new ApiError(message, response.status)
  }

  if (!body) {
    throw new ApiError('Empty response body', response.status)
  }

  // Auth service wraps singletons in data[0] (array envelope).
  // KYC service returns data as a plain object. Handle both.
  if (Array.isArray(body.data)) {
    return body.data[0] as T
  }
  return body.data as unknown as T
}

function emitAuthExpired(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))
}

export async function http<T>(path: string, opts: HttpOptions = {}): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const init: RequestInit = {
    method: opts.method ?? 'GET',
    headers: buildHeaders(opts),
    signal: opts.signal,
  }
  if (opts.body !== undefined) {
    init.body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body)
  }

  const response = await fetch(url, init)

  if (response.status === 401 && opts.auth !== false) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      const retryInit: RequestInit = {
        ...init,
        headers: buildHeaders(opts),
      }
      const retryResponse = await fetch(url, retryInit)
      return parseEnvelope<T>(retryResponse)
    }
    tokenStore.clear()
    emitAuthExpired()
    throw new ApiError('Session expired', 401)
  }

  return parseEnvelope<T>(response)
}
