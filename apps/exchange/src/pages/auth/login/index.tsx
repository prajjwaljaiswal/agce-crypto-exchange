import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Phone } from 'lucide-react'
import type { LoginTab, EmailLoginForm, MobileLoginForm } from './types/index.js'

export function LoginPage() {
  const [activeTab, setActiveTab] = useState<LoginTab>('email')

  const [emailForm, setEmailForm] = useState<EmailLoginForm>({
    email: '',
    password: '',
    showPassword: false,
  })

  const [mobileForm, setMobileForm] = useState<MobileLoginForm>({
    countryCode: '+91',
    phone: '',
    password: '',
    showPassword: false,
  })

  function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: connect to auth API
  }

  function handleMobileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: connect to auth API
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/images/logo_light.svg" alt="AGCE" className="h-10 object-contain" />
        </div>

        {/* Heading */}
        <h1
          className="text-center text-xl font-semibold mb-6"
          style={{ color: 'var(--color-text)' }}
        >
          Welcome To Arab Global Crypto Exchange
        </h1>

        {/* Tab switcher */}
        <div
          className="flex rounded-lg p-1 mb-6"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors"
            style={
              activeTab === 'email'
                ? { backgroundColor: 'var(--color-primary)', color: '#0d0d0d' }
                : { color: 'var(--color-text-muted)' }
            }
          >
            <Mail size={15} />
            Email
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mobile')}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors"
            style={
              activeTab === 'mobile'
                ? { backgroundColor: 'var(--color-primary)', color: '#0d0d0d' }
                : { color: 'var(--color-text-muted)' }
            }
          >
            <Phone size={15} />
            Mobile
          </button>
        </div>

        {/* Email form */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={emailForm.email}
                onChange={(e) => setEmailForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-[var(--color-text-subtle)]"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="email-password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="email-password"
                  type={emailForm.showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={emailForm.password}
                  onChange={(e) =>
                    setEmailForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Enter your password"
                  className="w-full rounded-lg px-4 py-3 pr-11 text-sm outline-none transition-colors placeholder:text-[var(--color-text-subtle)]"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setEmailForm((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label={emailForm.showPassword ? 'Hide password' : 'Show password'}
                >
                  {emailForm.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot_password"
                className="text-xs hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)', color: '#0d0d0d' }}
            >
              Log In
            </button>
          </form>
        )}

        {/* Mobile form */}
        {activeTab === 'mobile' && (
          <form onSubmit={handleMobileSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div
                  className="flex items-center px-3 rounded-lg text-sm font-medium select-none"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    minWidth: '64px',
                  }}
                >
                  {mobileForm.countryCode}
                </div>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={mobileForm.phone}
                  onChange={(e) => setMobileForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                  className="flex-1 rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-[var(--color-text-subtle)]"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="mobile-password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="mobile-password"
                  type={mobileForm.showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={mobileForm.password}
                  onChange={(e) =>
                    setMobileForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Enter your password"
                  className="w-full rounded-lg px-4 py-3 pr-11 text-sm outline-none transition-colors placeholder:text-[var(--color-text-subtle)]"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setMobileForm((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label={mobileForm.showPassword ? 'Hide password' : 'Show password'}
                >
                  {mobileForm.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot_password"
                className="text-xs hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)', color: '#0d0d0d' }}
            >
              Log In
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <hr className="flex-1" style={{ borderColor: 'var(--color-border)' }} />
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Or continue with
          </span>
          <hr className="flex-1" style={{ borderColor: 'var(--color-border)' }} />
        </div>

        {/* Google sign in */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 rounded-lg py-3 text-sm font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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
          Sign in with Google
        </button>

        {/* Register link */}
        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
