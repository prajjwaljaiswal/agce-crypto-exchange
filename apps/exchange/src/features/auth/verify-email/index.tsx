import { useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Copy } from 'lucide-react'
import { Navbar } from '../../../components/layout/Navbar.js'
import { ROUTES } from '../../../constants/routes.js'
import type { VerifyEmailLocationState } from './types/index.js'

const OTP_LENGTH = 6

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  if (local.length <= 2) return `${local[0]}***@${domain}`
  return `${local[0]}***${local[local.length - 1]}@${domain}`
}

export function VerifyEmailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as VerifyEmailLocationState | null
  const email = state?.email ?? 'j***9@gmail.com'
  const displayEmail = state?.email ? maskEmail(email) : email

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const focusInput = (idx: number) => {
    inputsRef.current[idx]?.focus()
  }

  const handleChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) {
      setDigits((prev) => {
        const next = [...prev]
        next[idx] = ''
        return next
      })
      return
    }
    setDigits((prev) => {
      const next = [...prev]
      next[idx] = raw[0]
      return next
    })
    if (idx < OTP_LENGTH - 1) focusInput(idx + 1)
  }

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      focusInput(idx - 1)
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      focusInput(idx - 1)
    } else if (e.key === 'ArrowRight' && idx < OTP_LENGTH - 1) {
      focusInput(idx + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!text) return
    e.preventDefault()
    const next = Array(OTP_LENGTH).fill('')
    for (let i = 0; i < text.length; i++) next[i] = text[i]
    setDigits(next)
    focusInput(Math.min(text.length, OTP_LENGTH - 1))
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const digitsOnly = text.replace(/\D/g, '').slice(0, OTP_LENGTH)
      if (!digitsOnly) return
      const next = Array(OTP_LENGTH).fill('')
      for (let i = 0; i < digitsOnly.length; i++) next[i] = digitsOnly[i]
      setDigits(next)
      focusInput(Math.min(digitsOnly.length, OTP_LENGTH - 1))
    } catch {
      // Clipboard permission denied — silently ignore
    }
  }

  const handleResend = () => {
    // TODO: call resend API
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isComplete) return
    // TODO: verify OTP with API before continuing
    if (state?.mode === 'login') {
      navigate(ROUTES.PROFILE.DASHBOARD)
    } else {
      navigate(ROUTES.AUTH.SET_PASSWORD, { state: { email: state?.email } })
    }
  }

  const isComplete = digits.every((d) => d !== '')

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-6 py-20">
        <div className="w-full mx-auto" style={{ maxWidth: '576px' }}>
          <h1
            className="text-[40px] font-semibold leading-[62px] mb-3"
            style={{ color: 'var(--color-text)' }}
          >
            Verify Your Email
          </h1>

          <p
            className="text-[16px] leading-[22px] mb-8"
            style={{ color: 'var(--color-text-muted)' }}
          >
            The verification code has been sent to your email {displayEmail},
            <br />
            valid for 10 minutes.
          </p>

          <form onSubmit={handleSubmit}>
            {/* OTP inputs */}
            <div className="grid grid-cols-6 gap-[10px]">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputsRef.current[idx] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  size={1}
                  aria-label={`Digit ${idx + 1}`}
                  className="h-[60px] w-full min-w-0 rounded-[9.56px] text-center text-[22px] font-medium outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    border: `1px solid ${
                      digit || idx === 0
                        ? 'var(--color-border-strong)'
                        : 'transparent'
                    }`,
                    color: 'var(--color-text)',
                  }}
                />
              ))}
            </div>

            {/* Resend / Paste row */}
            <div className="flex items-center justify-between mt-3">
              <button
                type="button"
                onClick={handleResend}
                className="text-[16px] font-medium underline"
                style={{ color: 'var(--color-text)' }}
              >
                Resend
              </button>

              <button
                type="button"
                onClick={pasteFromClipboard}
                className="inline-flex items-center gap-1.5 text-[16px] font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Paste
                <Copy size={16} />
              </button>
            </div>

            {/* Next */}
            <button
              type="submit"
              disabled={!isComplete}
              className="mt-10 w-full h-[67px] rounded-full text-[20px] font-medium transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-surface-3)',
                color: 'var(--color-text)',
              }}
            >
              Next
            </button>
          </form>

          {/* Didn't receive link */}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleResend}
              className="text-[16px] font-medium underline"
              style={{ color: 'var(--color-text)' }}
            >
              Didn't receive the code?
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
