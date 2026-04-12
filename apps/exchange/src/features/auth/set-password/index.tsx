import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, Eye, EyeOff } from 'lucide-react'
import { useInstanceConfig } from '@agce/hooks'
import { Navbar } from '../../../components/layout/Navbar.js'
import { ROUTES } from '../../../constants/routes.js'
import { useSignup } from '../hooks.js'
import { jurisdictionFromInstance } from '../api.js'
import { useAuth } from '../../../store/authStore.js'
import type { SetPasswordLocationState, PasswordRuleState } from './types/index.js'

function evaluatePassword(password: string, username: string): PasswordRuleState {
  const isAllDigits = password.length > 0 && /^\d+$/.test(password)
  const isAllLetters = password.length > 0 && /^[a-zA-Z]+$/.test(password)
  const containsUsername =
    username.length > 0 && password.toLowerCase().includes(username.toLowerCase())

  return {
    notAllNumbers: password.length > 0 && !isAllDigits,
    notAllLetters: password.length > 0 && !isAllLetters,
    minLength: password.length >= 8,
    notUsername: password.length > 0 && !containsUsername,
  }
}

function Rule({ valid, label }: { valid: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-flex items-center justify-center rounded-full"
        style={{
          width: 14,
          height: 14,
          backgroundColor: valid
            ? 'var(--color-green)'
            : 'var(--color-text-subtle)',
          color: '#ffffff',
        }}
      >
        <Check size={10} strokeWidth={3} />
      </span>
      <span
        className="text-[11.4px] leading-4"
        style={{
          color: valid ? 'var(--color-text)' : 'var(--color-text-muted)',
        }}
      >
        {label}
      </span>
    </div>
  )
}

export function SetPasswordPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const signupMutation = useSignup()
  const instanceConfig = useInstanceConfig()
  const state = location.state as SetPasswordLocationState | null
  const email = state?.email ?? ''
  const otp = state?.otp ?? ''
  const username = email.split('@')[0] ?? ''

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const rules = useMemo(() => evaluatePassword(password, username), [password, username])
  const isValid =
    rules.notAllNumbers && rules.notAllLetters && rules.minLength && rules.notUsername

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid) return
    if (!email || !otp) {
      setFormError('Missing signup details. Please restart signup.')
      return
    }
    setFormError(null)
    try {
      const result = await signupMutation.mutate({
        identifier: email,
        otp,
        password,
        jurisdiction: jurisdictionFromInstance(instanceConfig.id),
      })
      setSession({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        userId: result.userId,
        identifier: email,
      })
      navigate(ROUTES.AUTH.SIGNUP_SUCCESS, { replace: true })
    } catch {
      /* error surfaced via signupMutation.error */
    }
  }

  const errorText = formError ?? signupMutation.error

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-6 py-20">
        <div className="w-full mx-auto" style={{ maxWidth: '588px' }}>
          <h1
            className="text-[40px] font-semibold leading-[52px] mb-2"
            style={{ color: 'var(--color-text)' }}
          >
            Set Your Password
          </h1>

          <p
            className="text-[15px] leading-6 mb-8"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Set the password to complete the signup
          </p>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="signup-password"
              className="block text-[14px] font-medium mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              Password
            </label>

            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password"
                className="w-full h-[54px] rounded-[8px] px-4 pr-12 text-[15.3px] font-medium outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-surface-2)',
                  color: 'var(--color-text)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Validation rules */}
            <div className="mt-5 space-y-2">
              <Rule valid={rules.notAllNumbers} label="Cannot be all numbers" />
              <Rule valid={rules.notAllLetters} label="Cannot be all letters (case-sensitive)" />
              <Rule valid={rules.minLength} label="Minimum 8 characters required" />
              <Rule valid={rules.notUsername} label="Cannot contain username" />
            </div>

            {errorText && (
              <div
                role="alert"
                className="mt-5 px-4 py-3 rounded-lg text-sm"
                style={{
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                {errorText}
              </div>
            )}

            {/* Confirm */}
            <button
              type="submit"
              disabled={!isValid || signupMutation.isPending}
              className="mt-8 w-full h-[56px] rounded-full text-[20px] font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: 'var(--color-surface-3)',
                color: 'var(--color-text)',
              }}
            >
              {signupMutation.isPending ? 'Creating account…' : 'Confirm'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
