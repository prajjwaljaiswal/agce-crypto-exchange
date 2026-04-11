import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Phone, Check, X } from 'lucide-react'
import type { SignupTab, PasswordValidation, EmailSignupForm, MobileSignupForm } from './types/index.js'

function getPasswordValidation(password: string): PasswordValidation {
  return {
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    hasCapital: /[A-Z]/.test(password),
    hasMinLength: password.length >= 8,
  }
}

function ValidationRow({ valid, label }: { valid: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {valid ? (
        <Check size={13} style={{ color: 'var(--color-green)' }} />
      ) : (
        <X size={13} style={{ color: 'var(--color-red)' }} />
      )}
      <span
        className="text-xs"
        style={{ color: valid ? 'var(--color-green)' : 'var(--color-text-subtle)' }}
      >
        {label}
      </span>
    </div>
  )
}

export function SignupPage() {
  const [activeTab, setActiveTab] = useState<SignupTab>('email')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const [emailForm, setEmailForm] = useState<EmailSignupForm>({
    email: '',
    password: '',
    showPassword: false,
    inviteCode: '',
  })

  const [mobileForm, setMobileForm] = useState<MobileSignupForm>({
    countryCode: '+91',
    phone: '',
    password: '',
    showPassword: false,
    inviteCode: '',
  })

  const emailValidation = getPasswordValidation(emailForm.password)
  const mobileValidation = getPasswordValidation(mobileForm.password)

  function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: connect to auth API
  }

  function handleMobileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: connect to auth API
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Left — rewards banner */}
      <div
        className="hidden lg:flex flex-col justify-center items-center flex-1 px-12 py-16 relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Decorative gradient blob */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(209,170,103,0.12) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 text-center max-w-sm">
          <img
            src="/images/logo_light.svg"
            alt="AGCE"
            className="h-10 object-contain mx-auto mb-12"
          />

          <div
            className="rounded-2xl p-8 mb-6"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
            }}
          >
            <img
              src="/images/signup_rewards.png"
              alt="Sign Up Rewards"
              className="w-40 h-40 object-contain mx-auto mb-6"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
              Up to 100 USD
            </h2>
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
              Sign Up Rewards
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Create your account today and unlock exclusive rewards. Start trading on the Arab
              Global Crypto Exchange.
            </p>
          </div>

          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 rounded-full"
                style={{
                  width: i === 0 ? '24px' : '8px',
                  backgroundColor: i === 0 ? 'var(--color-primary)' : 'var(--color-surface-3)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col justify-center items-center flex-1 px-6 py-12">
        <div
          className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          {/* Logo (mobile only) */}
          <div className="flex justify-center mb-4 lg:hidden">
            <img src="/images/logo_light.svg" alt="AGCE" className="h-8 object-contain" />
          </div>

          <h1
            className="text-center text-xl font-semibold mb-6"
            style={{ color: 'var(--color-text)' }}
          >
            Register to Arab Global Crypto Exchange
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
                  htmlFor="reg-email"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Email Address
                </label>
                <input
                  id="reg-email"
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
                  htmlFor="reg-email-password"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-email-password"
                    type={emailForm.showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={emailForm.password}
                    onChange={(e) =>
                      setEmailForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder="Create a password"
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

                {/* Password validation */}
                {emailForm.password.length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5 mt-2.5 px-1">
                    <ValidationRow valid={emailValidation.hasNumber} label="Contains a number" />
                    <ValidationRow
                      valid={emailValidation.hasSpecial}
                      label="Special character"
                    />
                    <ValidationRow
                      valid={emailValidation.hasCapital}
                      label="Capital letter"
                    />
                    <ValidationRow valid={emailValidation.hasMinLength} label="Min. 8 characters" />
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="email-invite"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Invite Code{' '}
                  <span style={{ color: 'var(--color-text-subtle)' }}>(Optional)</span>
                </label>
                <input
                  id="email-invite"
                  type="text"
                  value={emailForm.inviteCode}
                  onChange={(e) =>
                    setEmailForm((prev) => ({ ...prev, inviteCode: e.target.value }))
                  }
                  placeholder="Enter invite code"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-[var(--color-text-subtle)]"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <TermsCheckbox checked={agreedToTerms} onChange={setAgreedToTerms} />

              <button
                type="submit"
                disabled={!agreedToTerms}
                className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--color-primary)', color: '#0d0d0d' }}
              >
                Register
              </button>
            </form>
          )}

          {/* Mobile form */}
          {activeTab === 'mobile' && (
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="reg-phone"
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
                    id="reg-phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={mobileForm.phone}
                    onChange={(e) =>
                      setMobileForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
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
                  htmlFor="reg-mobile-password"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-mobile-password"
                    type={mobileForm.showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={mobileForm.password}
                    onChange={(e) =>
                      setMobileForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder="Create a password"
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

                {/* Password validation */}
                {mobileForm.password.length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5 mt-2.5 px-1">
                    <ValidationRow valid={mobileValidation.hasNumber} label="Contains a number" />
                    <ValidationRow
                      valid={mobileValidation.hasSpecial}
                      label="Special character"
                    />
                    <ValidationRow
                      valid={mobileValidation.hasCapital}
                      label="Capital letter"
                    />
                    <ValidationRow
                      valid={mobileValidation.hasMinLength}
                      label="Min. 8 characters"
                    />
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="mobile-invite"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Invite Code{' '}
                  <span style={{ color: 'var(--color-text-subtle)' }}>(Optional)</span>
                </label>
                <input
                  id="mobile-invite"
                  type="text"
                  value={mobileForm.inviteCode}
                  onChange={(e) =>
                    setMobileForm((prev) => ({ ...prev, inviteCode: e.target.value }))
                  }
                  placeholder="Enter invite code"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-[var(--color-text-subtle)]"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <TermsCheckbox checked={agreedToTerms} onChange={setAgreedToTerms} />

              <button
                type="submit"
                disabled={!agreedToTerms}
                className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--color-primary)', color: '#0d0d0d' }}
              >
                Register
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1" style={{ borderColor: 'var(--color-border)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Or sign up with
            </span>
            <hr className="flex-1" style={{ borderColor: 'var(--color-border)' }} />
          </div>

          {/* Google */}
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
            Sign up with Google
          </button>

          {/* Login link */}
          <p className="text-center text-sm mt-5" style={{ color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Shared sub-component ─────────────────────────────────────────────────────

function TermsCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className="h-4 w-4 rounded flex items-center justify-center transition-colors"
          style={{
            backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-surface-2)',
            border: `1px solid ${checked ? 'var(--color-primary)' : 'var(--color-border-strong)'}`,
          }}
        >
          {checked && <Check size={11} color="#0d0d0d" strokeWidth={3} />}
        </div>
      </div>
      <span className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        I agree to the{' '}
        <Link
          to="/TermsofUse"
          className="hover:underline"
          style={{ color: 'var(--color-primary)' }}
        >
          Terms of Use
        </Link>{' '}
        and{' '}
        <Link
          to="/PrivacyDataProtectionPolicy"
          className="hover:underline"
          style={{ color: 'var(--color-primary)' }}
        >
          Privacy Policy
        </Link>
      </span>
    </label>
  )
}
