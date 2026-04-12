// In dev, leave empty so requests go through Vite's proxy (same-origin, no CORS).
// In production, set VITE_API_BASE_URL to the gateway's public URL.
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''

const ACCESS_TOKEN_KEY = 'agce.accessToken'

interface ApiEnvelope<T> {
  success: boolean
  data?: T
  error?: { code?: string; message?: string }
}

export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown
  headers?: Record<string, string>
  auth?: boolean
}

function readAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export async function apiFetch<T = unknown>(
  path: string,
  { body, headers, auth = true, method = 'GET', ...rest }: RequestOptions = {},
): Promise<T> {
  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  }

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = readAccessToken()
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
      ...rest,
    })
  } catch (err) {
    throw new ApiError(
      err instanceof Error ? err.message : 'Network request failed',
      0,
      'NETWORK_ERROR',
    )
  }

  let payload: ApiEnvelope<T> | null = null
  const text = await response.text()
  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<T>
    } catch {
      throw new ApiError(
        `Unexpected non-JSON response (${response.status})`,
        response.status,
      )
    }
  }

  if (!response.ok || (payload && payload.success === false)) {
    const message =
      payload?.error?.message ??
      `Request failed with status ${response.status}`
    throw new ApiError(message, response.status, payload?.error?.code)
  }

  return (payload?.data ?? (payload as unknown as T)) as T
}

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: ACCESS_TOKEN_KEY,
  REFRESH_TOKEN: 'agce.refreshToken',
  USER_ID: 'agce.userId',
  IDENTIFIER: 'agce.identifier',
} as const
