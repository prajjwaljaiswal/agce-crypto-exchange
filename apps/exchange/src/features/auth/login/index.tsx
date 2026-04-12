import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Eye, EyeOff, Fingerprint } from 'lucide-react'
import { Navbar } from '../../../components/layout/Navbar.js'
import { ROUTES } from '../../../constants/routes.js'
import { useAuth } from '../../../store/authStore.js'
import type { LoginTab, LoginForm } from './types/index.js'

// Demo credentials — hard-coded until a real auth backend is wired up.
const DEMO_USERNAME = 'agce'
const DEMO_PASSWORD = '1234'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState<LoginTab>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<LoginForm>({
    identifier: '',
    countryCode: '+91',
    phone: '',
    password: '',
    bindIp: false,
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (activeTab === 'qrcode') return

    const username =
      activeTab === 'email'
        ? form.identifier.trim()
        : `${form.countryCode}${form.phone}`.trim()

    if (username === DEMO_USERNAME && form.password === DEMO_PASSWORD) {
      setError(null)
      login(`agce-demo-${Date.now()}`)
      navigate(ROUTES.PROFILE.DASHBOARD, { replace: true })
      return
    }

    setError('Invalid username or password. Try agce / 1234.')
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-6 py-16">
        <div className="w-full mx-auto" style={{ maxWidth: '520px' }}>
          <h1
            className="text-[41px] font-semibold leading-[56px] mb-10"
            style={{ color: 'var(--color-text)' }}
          >
            Log In
          </h1>

          {/* Tab switcher */}
          <div className="flex items-center gap-6 mb-4">
            {(
              [
                { key: 'email', label: 'Email/Username' },
                { key: 'phone', label: 'Phone' },
                { key: 'qrcode', label: 'QR Code' },
              ] as Array<{ key: LoginTab; label: string }>
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className="relative pb-1 text-base font-medium transition-colors"
                style={{
                  color:
                    activeTab === key
                      ? 'var(--color-text)'
                      : 'var(--color-text-muted)',
                }}
              >
                {label}
                {activeTab === key && (
                  <span
                    className="absolute left-0 right-2 -bottom-0.5 h-[2px] rounded-full"
                    style={{ backgroundColor: 'var(--color-text)' }}
                  />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Input */}
            {activeTab === 'email' && (
              <input
                type="text"
                autoComplete="username"
                required
                value={form.identifier}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, identifier: e.target.value }))
                }
                placeholder="Email/Username"
                className="w-full h-[54px] rounded-[9px] px-4 text-[14px] font-medium outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  color: 'var(--color-text)',
                }}
              />
            )}

            {activeTab === 'phone' && (
              <div className="flex items-stretch gap-2">
                <div
                  className="flex items-center px-4 rounded-[9px] text-[14px] font-medium select-none"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    color: 'var(--color-text)',
                    minWidth: '72px',
                  }}
                >
                  {form.countryCode}
                </div>
                <input
                  type="tel"
                  autoComplete="tel"
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Enter phone number"
                  className="flex-1 h-[54px] rounded-[9px] px-4 text-[14px] font-medium outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            )}

            {activeTab === 'qrcode' && (
              <div className="flex flex-col items-center">
                <div className="flex items-end gap-4">
                  {/* QR code */}
                  <div
                    className="flex items-center justify-center rounded-[12px] p-3"
                    style={{
                      width: 174,
                      height: 174,
                      backgroundColor: 'var(--color-surface)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fagce.com%2Flogin%3Ftoken%3DAGCE-DEMO&margin=0&color=070808"
                      alt="AGCE login QR code"
                      className="w-full h-full"
                    />
                  </div>

                  {/* Phone mockup */}
                  <div
                    className="relative overflow-hidden flex-shrink-0"
                    style={{
                      width: 134,
                      height: 258,
                      borderRadius: 18,
                      border: '4px solid var(--color-text)',
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    {/* Status bar */}
                    <div
                      className="flex items-center justify-between px-3 pt-1.5 pb-1 text-[7px]"
                      style={{ color: 'var(--color-text)' }}
                    >
                      <span>9:41</span>
                      <span>••• ●</span>
                    </div>

                    {/* Profile row */}
                    <div className="flex items-center gap-2 px-3 pt-1 pb-2">
                      <div
                        className="h-6 w-6 rounded-full flex items-center justify-center text-[8px] font-bold"
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: '#0d0d0d',
                        }}
                      >
                        JW
                      </div>
                      <div className="leading-tight">
                        <p
                          className="text-[8px] font-semibold"
                          style={{ color: 'var(--color-text)' }}
                        >
                          John Wick
                        </p>
                        <p
                          className="text-[6px]"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          +91 85965 86935
                        </p>
                      </div>
                    </div>

                    {/* Deposit + Withdraw buttons */}
                    <div className="grid grid-cols-2 gap-1.5 px-3 pb-2">
                      <div
                        className="h-8 rounded-md flex items-center justify-center text-[7px] font-semibold"
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: '#0d0d0d',
                        }}
                      >
                        Deposit
                      </div>
                      <div
                        className="h-8 rounded-md flex items-center justify-center text-[7px] font-semibold"
                        style={{
                          backgroundColor: 'var(--color-surface-2)',
                          color: 'var(--color-text)',
                        }}
                      >
                        Withdraw
                      </div>
                    </div>

                    {/* General features grid */}
                    <div className="px-3 pt-1">
                      <p
                        className="text-[6px] font-semibold mb-1"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        General Features
                      </p>
                      <div className="grid grid-cols-5 gap-1 mb-2">
                        {['Spot', 'Bot', 'Swap', 'Earn', 'Wallet'].map((label) => (
                          <div key={label} className="flex flex-col items-center gap-0.5">
                            <div
                              className="h-4 w-4 rounded"
                              style={{ backgroundColor: 'var(--color-surface-2)' }}
                            />
                            <span
                              className="text-[5px]"
                              style={{ color: 'var(--color-text-muted)' }}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <p
                        className="text-[6px] font-semibold mb-1"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        Support Tools
                      </p>
                      <div className="grid grid-cols-5 gap-1 mb-2">
                        {['Help', 'KYC', 'Set', 'Sec', 'Cur'].map((label) => (
                          <div key={label} className="flex flex-col items-center gap-0.5">
                            <div
                              className="h-4 w-4 rounded"
                              style={{ backgroundColor: 'var(--color-surface-2)' }}
                            />
                            <span
                              className="text-[5px]"
                              style={{ color: 'var(--color-text-muted)' }}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <p
                        className="text-[6px] font-semibold mb-1"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        History
                      </p>
                      <div className="grid grid-cols-5 gap-1">
                        {['Open', 'Trade', 'Xfer', 'Swap', 'Tx'].map((label) => (
                          <div key={label} className="flex flex-col items-center gap-0.5">
                            <div
                              className="h-4 w-4 rounded"
                              style={{ backgroundColor: 'var(--color-surface-2)' }}
                            />
                            <span
                              className="text-[5px]"
                              style={{ color: 'var(--color-text-muted)' }}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom fade/blur overlay */}
                    <div
                      className="absolute left-0 right-0 bottom-0 h-10"
                      style={{
                        background:
                          'linear-gradient(to bottom, transparent, var(--color-surface))',
                      }}
                    />
                  </div>
                </div>

                {/* Caption */}
                <div className="mt-5 text-center">
                  <p
                    className="text-[15px] font-medium"
                    style={{ color: 'var(--color-text)' }}
                  >
                    Log in with QR code
                  </p>
                  <p
                    className="text-[13px] mt-1"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Scan this code with your{' '}
                    <span
                      className="font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      AGCE App
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Password (hidden on QR Code tab) */}
            {activeTab !== 'qrcode' && (
              <div className="relative mt-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Password"
                  className="w-full h-[54px] rounded-[9px] px-4 pr-12 text-[14px] font-medium outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
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
            )}

            {/* Bind IP + Forgot password row */}
            <div className="flex items-center justify-between mt-4">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form.bindIp}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, bindIp: e.target.checked }))
                  }
                />
                <span
                  className="inline-flex items-center justify-center rounded-[2px] h-[16px] w-[16px]"
                  style={{
                    border: '1px solid var(--color-border-strong)',
                    backgroundColor: form.bindIp
                      ? 'var(--color-text)'
                      : 'transparent',
                  }}
                >
                  {form.bindIp && (
                    <Check
                      size={11}
                      strokeWidth={3}
                      style={{ color: 'var(--color-bg)' }}
                    />
                  )}
                </span>
                <span
                  className="text-[14px] font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  Bind IP(Security option)
                </span>
              </label>

              <Link
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                className="text-[14px] font-medium underline"
                style={{ color: 'var(--color-text)' }}
              >
                Forgot password
              </Link>
            </div>

            {error && activeTab !== 'qrcode' && (
              <div
                role="alert"
                className="mt-4 px-4 py-3 rounded-lg text-sm"
                style={{
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                {error}
              </div>
            )}

            {/* Next */}
            <button
              type="submit"
              className="mt-8 w-full h-[60px] rounded-full text-[18px] font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-surface-3)',
                color: 'var(--color-text)',
              }}
            >
              {activeTab === 'qrcode' ? 'Next' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div
            className="flex items-center gap-4 mt-8 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="flex-1 h-px"
              style={{ backgroundColor: 'var(--color-border)' }}
            />
            Or log in with
            <span
              className="flex-1 h-px"
              style={{ backgroundColor: 'var(--color-border)' }}
            />
          </div>

          {/* Passkey button */}
          <button
            type="button"
            className="mt-5 w-full h-[54px] rounded-[9px] flex items-center justify-center gap-2 text-[14px] font-medium transition-colors hover:opacity-90"
            style={{
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              backgroundColor: 'transparent',
            }}
          >
            <Fingerprint size={20} />
            Log In with Passkey
          </button>

          {/* Social buttons */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <button
              type="button"
              aria-label="Continue with Google"
              className="h-[50px] w-[104px] rounded-2xl flex items-center justify-center transition-colors hover:opacity-80"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Continue with Apple"
              className="h-[50px] w-[104px] rounded-2xl flex items-center justify-center transition-colors hover:opacity-80"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                aria-hidden="true"
                style={{ fill: 'var(--color-text)' }}
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </button>
          </div>

          {/* Create account link */}
          <div className="flex justify-center mt-8">
            <Link
              to={ROUTES.AUTH.SIGNUP}
              className="text-[14px] font-medium underline"
              style={{ color: 'var(--color-text)' }}
            >
              Create a AGCE Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
