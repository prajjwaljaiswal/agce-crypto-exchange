import { useCallback, useEffect, useRef, useState } from 'react'

export interface OtpCountdown {
  countdown: number
  start: () => void
  reset: () => void
}

// Shared resend-cooldown timer for OTP flows. Replaces the ~8 hand-rolled
// setInterval/useRef/cleanup blocks previously duplicated across the
// security screens. Calling `start` restarts any in-flight timer so the
// caller doesn't have to reset first.
export function useOtpCountdown(initialSeconds = 60): OtpCountdown {
  const [countdown, setCountdown] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    clear()
    setCountdown(0)
  }, [clear])

  const start = useCallback(() => {
    clear()
    setCountdown(initialSeconds)
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clear()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clear, initialSeconds])

  useEffect(() => clear, [clear])

  return { countdown, start, reset }
}
