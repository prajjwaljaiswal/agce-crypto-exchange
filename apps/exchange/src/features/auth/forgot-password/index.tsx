import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Phone, ArrowLeft } from 'lucide-react'
import type { ForgotPasswordTab, EmailResetForm, PhoneResetForm } from './types/index.js'

export function ForgotPasswordPage() {
  const [activeTab, setActiveTab] = useState<ForgotPasswordTab>('email')

  const [emailForm, setEmailForm] = useState<EmailResetForm>({
    email: '',
    otp: '',
    newPassword: '',
    showPassword: false,
    otpSent: false,
  })

  const [phoneForm, setPhoneForm] = useState<PhoneResetForm>({
    countryCode: '+91',
    phone: '',
    otp: '',
    newPassword: '',
    showPassword: false,
    otpSent: false,
  })

  function handleGetEmailOtp() {
    if (!emailForm.email) return
    // TODO: call OTP send API
    setEmailForm((prev) => ({ ...prev, otpSent: true }))
  }

  function handleGetPhoneOtp() {
    if (!phoneForm.phone) return
    // TODO: call OTP send API
    setPhoneForm((prev) => ({ ...prev, otpSent: true }))
  }

  function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: connect to reset password API
  }

  function handlePhoneSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: connect to reset password API
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
          className="text-center text-xl font-semibold mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          Forgot Password
        </h1>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Enter your details below to reset your password
        </p>

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
            onClick={() => setActiveTab('phone')}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors"
            style={
              activeTab === 'phone'
                ? { backgroundColor: 'var(--color-primary)', color: '#0d0d0d' }
                : { color: 'var(--color-text-muted)' }
            }
          >
            <Phone size={15} />
            Phone
          </button>
        </div>

        {/* Email reset form */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="reset-email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Email Address
              </label>
              <input
                id="reset-email"
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
                htmlFor="email-otp"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Verification Code
              </label>
              <div className="flex gap-2">
                <input
                  id="email-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={emailForm.otp}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, otp: e.target.value }))}
                  placeholder="Enter OTP"
                  className="flex-1 rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-[var(--color-text-subtle)]"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <button
                  type="button"
                  onClick={handleGetEmailOtp}
                  disabled={!emailForm.email}
                  className="px-4 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#0d0d0d' }}
                >
                  {emailForm.otpSent ? 'Resend' : 'GET OTP'}
                </button>
              </div>
              {emailForm.otpSent && (
                <p className="mt-1.5 text-xs" style={{ color: 'var(--color-green)' }}>
                  OTP sent to your email address.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email-new-password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="email-new-password"
                  type={emailForm.showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={emailForm.newPassword}
                  onChange={(e) =>
                    setEmailForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  placeholder="Enter new password"
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

            <button
              type="submit"
              className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)', color: '#0d0d0d' }}
            >
              Reset Password
            </button>
          </form>
        )}

        {/* Phone reset form */}
        {activeTab === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="reset-phone"
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
                  {phoneForm.countryCode}
                </div>
                <input
                  id="reset-phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phoneForm.phone}
                  onChange={(e) => setPhoneForm((prev) => ({ ...prev, phone: e.target.value }))}
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
                htmlFor="phone-otp"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Verification Code
              </label>
              <div className="flex gap-2">
                <input
                  id="phone-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={phoneForm.otp}
                  onChange={(e) => setPhoneForm((prev) => ({ ...prev, otp: e.target.value }))}
                  placeholder="Enter OTP"
                  className="flex-1 rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-[var(--color-text-subtle)]"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <button
                  type="button"
                  onClick={handleGetPhoneOtp}
                  disabled={!phoneForm.phone}
                  className="px-4 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#0d0d0d' }}
                >
                  {phoneForm.otpSent ? 'Resend' : 'GET OTP'}
                </button>
              </div>
              {phoneForm.otpSent && (
                <p className="mt-1.5 text-xs" style={{ color: 'var(--color-green)' }}>
                  OTP sent to your phone number.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone-new-password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="phone-new-password"
                  type={phoneForm.showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={phoneForm.newPassword}
                  onChange={(e) =>
                    setPhoneForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  placeholder="Enter new password"
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
                    setPhoneForm((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label={phoneForm.showPassword ? 'Hide password' : 'Show password'}
                >
                  {phoneForm.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)', color: '#0d0d0d' }}
            >
              Reset Password
            </button>
          </form>
        )}

        {/* Back to login */}
        <div className="flex justify-center mt-6">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm hover:underline"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <ArrowLeft size={15} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
