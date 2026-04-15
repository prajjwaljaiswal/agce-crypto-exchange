import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../lib/auth-api.js'
import { formatApiError } from '../../lib/errors.js'

type Tab = 'email' | 'phone'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const COUNTRY_OPTIONS = [
  { value: '+91', label: '🇮🇳 +91 India' },
  { value: '+971', label: '🇦🇪 +971 UAE' },
  { value: '+966', label: '🇸🇦 +966 Saudi Arabia' },
  { value: '+974', label: '🇶🇦 +974 Qatar' },
  { value: '+965', label: '🇰🇼 +965 Kuwait' },
  { value: '+973', label: '🇧🇭 +973 Bahrain' },
  { value: '+968', label: '🇴🇲 +968 Oman' },
  { value: '+1', label: '🇺🇸 +1 USA' },
  { value: '+44', label: '🇬🇧 +44 UK' },
]

export function ForgotPassword() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('email')
  const [countryCode, setCountryCode] = useState('+91')
  const [signId, setSignId] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const signIdInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus identifier input on tab switch
  useEffect(() => {
    const id = window.setTimeout(() => signIdInputRef.current?.focus(), 120)
    return () => window.clearTimeout(id)
  }, [tab])

  const showError = (msg: string) => alert(msg)
  const showSuccess = (msg: string) => alert(msg)

  const buildIdentifier = (): string | null => {
    if (tab === 'email') {
      if (!signId || !EMAIL_RE.test(signId)) return null
      return signId.trim()
    }
    const digits = signId.replace(/\D/g, '')
    if (digits.length < 6) return null
    return `${countryCode}${digits}`
  }

  // Get-OTP flow: check-identifier(PASSWORD_RESET) → send-otp(RESET_PASSWORD).
  // Note the backend uses different casing for the two endpoints (PASSWORD_RESET vs RESET_PASSWORD).
  const sendOtpMutation = useMutation({
    mutationFn: async (identifier: string) => {
      await authApi.checkIdentifier({ identifier, purpose: 'PASSWORD_RESET' })
      await authApi.sendOtp({ identifier, type: 'RESET_PASSWORD' })
    },
    onSuccess: () => showSuccess('OTP sent successfully!'),
    onError: (error) => showError(formatApiError(error, 'Could not send reset code.')),
  })

  const verifyOtpMutation = useMutation({
    mutationFn: (identifier: string) =>
      authApi.verifyOtp({ identifier, otp, purpose: 'RESET_PASSWORD' }),
    onSuccess: () => {
      // TODO(phase-3): the backend has no /reset-password commit endpoint yet
      // (see Phase 3 plan, question #2). The OTP is verified but the new password
      // is not actually persisted. Flag to user.
      showSuccess(
        'Code verified. Note: backend reset endpoint is not yet available — your new password was NOT saved. Please contact support.',
      )
      navigate('/login')
    },
    onError: (error) => showError(formatApiError(error, 'Invalid verification code.')),
  })

  const handleGetOtp = () => {
    const identifier = buildIdentifier()
    if (!identifier) {
      showError(
        tab === 'email'
          ? 'Please enter a valid email address'
          : 'Please enter a valid phone number for the selected country',
      )
      return
    }
    sendOtpMutation.mutate(identifier)
  }

  const handleForgetPass = () => {
    if (!otp) { showError('Please enter the verification code'); return }
    if (!newPassword || newPassword.length < 8) {
      showError('Password must be at least 8 characters')
      return
    }
    const identifier = buildIdentifier()
    if (!identifier) {
      showError('Please re-enter your email or phone.')
      return
    }
    verifyOtpMutation.mutate(identifier)
  }

  const switchTab = (t: Tab) => {
    setTab(t)
    setSignId('')
    setOtp('')
    setNewPassword('')
  }

  return (
    <div className="login_section m-auto mt-5 forgot_password">
      <div className="login_form_right">
        <div className="form_block_login">
          <h2>Forgot Password</h2>

          <div
            style={{
              background: 'rgba(255, 200, 0, 0.12)',
              border: '1px solid rgba(255, 200, 0, 0.35)',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 14,
              fontSize: '0.85rem',
              lineHeight: 1.4,
            }}
          >
            <strong>Heads up:</strong> the password reset commit endpoint is not yet
            available on the backend. You can receive and verify an OTP, but the new
            password will not be saved until the backend ships the reset endpoint.
          </div>

          <ul className="nav nav-tabs login-pills" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${tab === 'email' ? 'active' : ''}`}
                type="button"
                onClick={() => switchTab('email')}
              >
                Email
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${tab === 'phone' ? 'active' : ''}`}
                type="button"
                onClick={() => switchTab('phone')}
              >
                Phone
              </button>
            </li>
          </ul>

          <div className="tab-content" id="pills-tabContent">
            {/* Email tab */}
            {tab === 'email' && (
              <div className="tab-pane show active" role="tabpanel">
                <form onSubmit={(e) => { e.preventDefault(); handleForgetPass() }}>
                  <div className="row">
                    <div className="col-sm-12 input_block">
                      <label>Email*</label>
                      <input
                        ref={signIdInputRef}
                        className="input_filed"
                        type="email"
                        placeholder="Email"
                        value={signId}
                        onChange={(e) => setSignId(e.target.value)}
                      />
                    </div>
                    <div className="col-sm-12 input_block">
                      <label>Email Verification Code*</label>
                      <div className="email_code">
                        <input
                          type="text"
                          className="input_filed"
                          placeholder="Enter Code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                        />
                        <div
                          className="get_otp"
                          role="button"
                          tabIndex={0}
                          onClick={() => sendOtpMutation.isPending || handleGetOtp()}
                          aria-disabled={sendOtpMutation.isPending}
                        >
                          <span>{sendOtpMutation.isPending ? 'SENDING…' : 'GET OTP'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 input_block">
                      <label>New Password*</label>
                      <input
                        type="password"
                        className="input_filed"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-10 col-12 mx-auto mt-4">
                    <button
                      type="submit"
                      className="btn custom-btn w-100 btn-block btn-xl"
                      disabled={verifyOtpMutation.isPending}
                    >
                      {verifyOtpMutation.isPending ? 'Verifying…' : 'Reset Password'}
                    </button>
                  </div>
                  <div className="col-sm-12 registration__info mt-4">
                    <p>Back to <Link to="/login">Login</Link></p>
                  </div>
                </form>
              </div>
            )}

            {/* Phone tab */}
            {tab === 'phone' && (
              <div className="tab-pane show active" role="tabpanel">
                <form onSubmit={(e) => { e.preventDefault(); handleForgetPass() }}>
                  <div className="row">
                    <div className="col-sm-12 input_block">
                      <label>Mobile Number*</label>
                      <select
                        className="input_filed"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        style={{ padding: '12px 16px', marginBottom: 8 }}
                      >
                        {COUNTRY_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <input
                        ref={signIdInputRef}
                        className="input_filed"
                        type="text"
                        inputMode="numeric"
                        placeholder="Mobile Number"
                        value={signId}
                        onChange={(e) => setSignId(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    <div className="col-sm-12 input_block">
                      <label>Phone Verification Code*</label>
                      <div className="email_code">
                        <input
                          type="text"
                          className="input_filed"
                          placeholder="Enter Code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                        />
                        <div
                          className="get_otp"
                          role="button"
                          tabIndex={0}
                          onClick={() => sendOtpMutation.isPending || handleGetOtp()}
                          aria-disabled={sendOtpMutation.isPending}
                        >
                          <span>{sendOtpMutation.isPending ? 'SENDING…' : 'GET OTP'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 input_block">
                      <label>New Password</label>
                      <input
                        type="password"
                        className="input_filed"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-10 col-12 mx-auto mt-4">
                    <button
                      type="submit"
                      className="btn custom-btn w-100 btn-block btn-xl"
                      disabled={verifyOtpMutation.isPending}
                    >
                      {verifyOtpMutation.isPending ? 'Verifying…' : 'Reset Password'}
                    </button>
                  </div>
                  <div className="col-sm-12 registration__info mt-4">
                    <p>Back to <Link to="/login">Login</Link></p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
