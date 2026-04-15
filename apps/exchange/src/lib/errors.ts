import { ApiError } from './http.js'

export function formatApiError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof ApiError) {
    return error.message || fallback
  }
  if (error instanceof Error) {
    return error.message || fallback
  }
  if (typeof error === 'string' && error) {
    return error
  }
  return fallback
}

export function isApiErrorWithStatus(error: unknown, status: number): boolean {
  return error instanceof ApiError && error.status === status
}
