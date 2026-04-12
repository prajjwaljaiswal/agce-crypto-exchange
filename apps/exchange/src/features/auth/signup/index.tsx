import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { Navbar } from '../../../components/layout/Navbar.js'
import { ROUTES } from '../../../constants/routes.js'
import type { SignupTab, SignupStep1Form } from './types/index.js'

export function SignupPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<SignupTab>('email')
  const [showReferral, setShowReferral] = useState(false)
  const [form, setForm] = useState<SignupStep1Form>({
    email: '',
    phone: '',
    countryCode: '+91',
    referralCode: '',
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (activeTab === 'email' && form.email) {
      navigate(ROUTES.AUTH.VERIFY_EMAIL, { state: { email: form.email } })
    }
    // TODO: phone verification flow
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <Navbar />

      <div className="flex flex-1">
        {/* ─── Left: dark hero (stays black in both themes — brand panel) ───── */}
        <aside className="hidden lg:flex flex-col items-center justify-center relative w-[800px] bg-black overflow-hidden">
          <h1 className="text-white text-[44px] font-semibold leading-[70px] text-center max-w-[642px] px-6">
            Create your account and get rewarded instantly with{' '}
            <span style={{ color: 'var(--color-primary)' }}>AGCE coins</span>.
          </h1>

          <img
            src="/images/signup_hero.png"
            alt="AGCE signup rewards"
            className="w-[413px] h-[413px] object-contain mt-10 pointer-events-none select-none"
          />

          {/* Bottom fade */}
          <div
            className="absolute left-0 right-0 bottom-0 h-24 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, #000000)' }}
          />
        </aside>

        {/* ─── Right: form (theme-aware) ────────────────────────────────────── */}
        <main
          className="flex-1 flex items-center justify-center px-6 py-12"
          style={{ backgroundColor: 'var(--color-bg)' }}
        >
          <div className="w-full mx-auto" style={{ maxWidth: '520px' }}>
            <h2
              className="text-[41px] font-semibold leading-[56px] mb-10"
              style={{ color: 'var(--color-text)' }}
            >
              Create Account
            </h2>

            {/* Tab switcher */}
            <div className="flex items-center gap-6 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className="relative pb-1 text-base font-medium transition-colors"
                style={{
                  color:
                    activeTab === 'email'
                      ? 'var(--color-text)'
                      : 'var(--color-text-muted)',
                }}
              >
                Email
                {activeTab === 'email' && (
                  <span
                    className="absolute left-0 right-2 -bottom-0.5 h-[2px] rounded-full"
                    style={{ backgroundColor: 'var(--color-text)' }}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('phone')}
                className="relative pb-1 text-base font-medium transition-colors"
                style={{
                  color:
                    activeTab === 'phone'
                      ? 'var(--color-text)'
                      : 'var(--color-text-muted)',
                }}
              >
                Phone
                {activeTab === 'phone' && (
                  <span
                    className="absolute left-0 right-2 -bottom-0.5 h-[2px] rounded-full"
                    style={{ backgroundColor: 'var(--color-text)' }}
                  />
                )}
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email/Phone input */}
              {activeTab === 'email' ? (
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter email address"
                  className="w-full h-[54px] rounded-[9px] px-4 text-[14px] font-medium outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    color: 'var(--color-text)',
                  }}
                />
              ) : (
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

              {/* Referral code */}
              <button
                type="button"
                onClick={() => setShowReferral((prev) => !prev)}
                className="mt-8 inline-flex items-center gap-1 text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Referral code
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showReferral ? 'rotate-180' : ''}`}
                />
              </button>

              {showReferral && (
                <input
                  type="text"
                  value={form.referralCode}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, referralCode: e.target.value }))
                  }
                  placeholder="Enter referral code"
                  className="mt-3 w-full h-[54px] rounded-[9px] px-4 text-[14px] font-medium outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    color: 'var(--color-text)',
                  }}
                />
              )}

              {/* Next */}
              <button
                type="submit"
                className="mt-8 w-full h-[60px] rounded-full text-lg font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-surface-3)',
                  color: 'var(--color-text)',
                }}
              >
                Next
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

            {/* Social buttons */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                aria-label="Continue with Google"
                className="h-[50px] w-[104px] rounded-2xl flex items-center justify-center transition-opacity hover:opacity-80"
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
                className="h-[50px] w-[104px] rounded-2xl flex items-center justify-center transition-opacity hover:opacity-80"
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

            {/* Login link */}
            <p
              className="text-center text-sm mt-8"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Already have an account?{' '}
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="font-medium underline"
                style={{ color: 'var(--color-text)' }}
              >
                Log In
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
