import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './signup-wizard.css'
import './login-wizard.css'

type AccountTab = 'email_user' | 'phone' | 'qr'

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

interface AuthMethod {
  type: number
  label: string
  icon: string
  description: string
  maskedValue?: string
}

export function LoginPage() {
  const navigate = useNavigate()

  const [wizardStep, setWizardStep] = useState(1)
  const [accountTab, setAccountTab] = useState<AccountTab>('email_user')
  const [signId, setSignId] = useState('')
  const [password, setPassword] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [showPassword, setShowPassword] = useState(false)
  const [bindIp, setBindIp] = useState(false)

  // Step 2 — 2FA verification
  const [loginPendingVerification, setLoginPendingVerification] = useState(false)
  const [selectedAuthMethod, setSelectedAuthMethod] = useState(1)
  const [availableMethods, setAvailableMethods] = useState<AuthMethod[]>([])
  const [resendTimer, setResendTimer] = useState(0)
  const [otpSingle, setOtpSingle] = useState('')
  const [showMethodModal, setShowMethodModal] = useState(false)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    document.title = 'Arab Global Crypto Exchange – Log In'
    document.body.classList.add('loginbg')
    return () => document.body.classList.remove('loginbg')
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [wizardStep, accountTab])

  // Auto-focus first OTP cell on step 2
  useEffect(() => {
    if (wizardStep !== 2 || selectedAuthMethod === 4) return
    const id = window.setTimeout(() => otpInputRefs.current[0]?.focus(), 120)
    return () => window.clearTimeout(id)
  }, [wizardStep, selectedAuthMethod])

  // Guard: if step 2 without pending verification, go back
  useEffect(() => {
    if (wizardStep === 2 && !loginPendingVerification) setWizardStep(1)
  }, [wizardStep, loginPendingVerification])

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const showError = (msg: string) => alert(msg)
  const showSuccess = (msg: string) => alert(msg)

  const switchLoginTab = (tab: AccountTab) => {
    if (wizardStep === 2) return
    setAccountTab(tab)
    setSignId('')
    setPassword('')
    setShowPassword(false)
    setBindIp(false)
    setWizardStep(1)
    setLoginPendingVerification(false)
    setOtpSingle('')
    setAvailableMethods([])
    setResendTimer(0)
  }

  /* ── Step 1 submit ── */
  const submitLoginStep1 = () => {
    if (accountTab === 'qr') { showError('QR code login is coming soon.'); return }
    if (!password) { showError('Please enter your password'); return }
    if (accountTab === 'email_user') {
      const raw = signId.trim()
      if (!raw) { showError('Please enter your email or username'); return }
    } else {
      const digits = signId.replace(/\D/g, '').replace(/^0+/, '')
      if (!digits || digits.length < 6) { showError('Please enter a valid phone number'); return }
    }

    // Stub: simulate 2FA required
    const stubMethods: AuthMethod[] = [
      { type: 1, label: 'Email', icon: 'ri-mail-line', description: 'Receive verification codes via email', maskedValue: 'u***@example.com' },
      { type: 2, label: 'Google Authenticator', icon: 'ri-shield-keyhole-line', description: 'Use Google Authenticator app' },
    ]
    setAvailableMethods(stubMethods)
    setSelectedAuthMethod(1)
    setResendTimer(60)
    setOtpSingle('')
    setLoginPendingVerification(true)
    setWizardStep(2)
    showSuccess('Verification code sent to your email.')
  }

  /* ── Step 2: OTP verify stub ── */
  const handleAuthVerify = () => {
    const code = getOtpDigitsStr()
    if (code.length < 6) { showError('Please enter a valid 6-digit code'); return }
    showSuccess('Login successful!')
    navigate('/user_profile/dashboard')
  }

  const sendLoginOtp = (method: number) => {
    if (method === 2 || method === 4) return
    showSuccess('OTP sent successfully')
    setResendTimer(60)
  }

  const goBackFromVerificationStep = () => {
    setWizardStep(1)
    setLoginPendingVerification(false)
    setOtpSingle('')
    setResendTimer(0)
    setAvailableMethods([])
  }

  const getVerificationTitle = () => {
    switch (selectedAuthMethod) {
      case 1: return 'Verify Your Email'
      case 2: return 'Verify with authenticator'
      case 3: return 'Verify Your Phone'
      case 4: return 'Passkey Authentication'
      default: return 'Verification'
    }
  }

  const getVerificationDescription = () => {
    const method = availableMethods.find((m) => m.type === selectedAuthMethod)
    if (selectedAuthMethod === 1) return `The verification code has been sent to your email ${method?.maskedValue ?? '—'}, valid for 10 minutes.`
    if (selectedAuthMethod === 2) return 'Enter the 6-digit code from your authenticator app.'
    if (selectedAuthMethod === 3) return `The verification code has been sent to your phone ${method?.maskedValue ?? '—'}, valid for 10 minutes.`
    if (selectedAuthMethod === 4) return 'Click the button below to authenticate with your passkey.'
    return 'Enter your verification code.'
  }

  /* OTP cell helpers */
  const getOtpDigitsStr = () => otpSingle.replace(/\D/g, '').slice(0, 6)

  const focusOtpIndex = (idx: number) => {
    requestAnimationFrame(() => {
      otpInputRefs.current[Math.min(Math.max(0, idx), 5)]?.focus()
    })
  }

  const handleOtpCellChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    const d = getOtpDigitsStr()
    const before = d.slice(0, index)
    const after = d.slice(index + 1)
    if (!raw) { setOtpSingle(before + after); return }
    const merged = (before + raw + after).replace(/\D/g, '').slice(0, 6)
    setOtpSingle(merged)
    focusOtpIndex(Math.min(index + raw.length, 5))
  }

  const handleOtpCellKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const d = getOtpDigitsStr()
    if (e.key === 'Backspace') {
      if (d[index]) { e.preventDefault(); setOtpSingle(d.slice(0, index) + d.slice(index + 1)) }
      else if (index > 0) { e.preventDefault(); setOtpSingle(d.slice(0, index - 1) + d.slice(index)); focusOtpIndex(index - 1) }
    }
  }

  const handleOtpRowPaste = (e: React.ClipboardEvent) => {
    const raw = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6)
    if (!raw) return
    e.preventDefault()
    setOtpSingle(raw)
    focusOtpIndex(Math.min(raw.length, 5))
  }

  const handleOtpPaste = useCallback(async () => {
    try {
      const raw = (await navigator.clipboard.readText()).replace(/\D/g, '').slice(0, 6)
      setOtpSingle(raw)
      focusOtpIndex(Math.min(raw.length, 5))
    } catch { showError('Unable to read clipboard.') }
  }, [])

  const otpDigitsDisplay = getOtpDigitsStr()

  return (
    <>
      <div className="login_fullhieght login-page-center">
        <div className="login_section">
          <div className="login_form_right">
            <div className="form_block_login login-wizard-root">

              {/* ── Step 1: credentials ── */}
              {wizardStep === 1 && (
                <>
                  <h1 className="login-wizard-title">Log In</h1>

                  <ul className="login-wizard-tabs" role="tablist">
                    <li>
                      <button
                        type="button"
                        className={accountTab === 'email_user' ? 'is-active' : ''}
                        onClick={() => switchLoginTab('email_user')}
                      >
                        Email/Username
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className={accountTab === 'phone' ? 'is-active' : ''}
                        onClick={() => switchLoginTab('phone')}
                      >
                        Phone
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className={accountTab === 'qr' ? 'is-active' : ''}
                        onClick={() => switchLoginTab('qr')}
                      >
                        QR Code
                      </button>
                    </li>
                  </ul>

                  <form onSubmit={(e) => { e.preventDefault(); submitLoginStep1() }} noValidate>
                    <div className="row">
                      {accountTab === 'email_user' && (
                        <div className="col-sm-12 input_block">
                          <div className="email_code">
                            <input
                              className="input_filed"
                              type="text"
                              placeholder="Email/Username"
                              value={signId}
                              onChange={(e) => setSignId(e.target.value)}
                              onBlur={(e) => setSignId(e.target.value.trim())}
                              autoComplete="username"
                            />
                          </div>
                        </div>
                      )}

                      {accountTab === 'phone' && (
                        <>
                          <div className="col-sm-12 input_block">
                            <select
                              className="input_filed"
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              style={{ padding: '12px 16px' }}
                            >
                              {COUNTRY_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-sm-12 input_block">
                            <div className="phone-input-wrapper">
                              <input
                                className="input_filed"
                                type="text"
                                inputMode="numeric"
                                placeholder="Phone number"
                                value={signId}
                                onChange={(e) => setSignId(e.target.value.replace(/\D/g, ''))}
                                autoComplete="tel"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {accountTab === 'qr' && (
                        <div className="col-sm-12 input_block qrcode_scan_block">
                          <div className="qrcode_scan">
                            <img src="/images/qrcode_img.svg" alt="QR Code" />
                          </div>
                          <sub>Log in with QR code</sub>
                          <p className="signup-wizard-subtitle">
                            Scan this code with your <span>AGCE App</span>
                          </p>
                          <label>
                            <input
                              type="checkbox"
                              checked={bindIp}
                              onChange={() => setBindIp((v) => !v)}
                            />{' '}
                            Bind IP (Security option)
                          </label>
                        </div>
                      )}

                      {accountTab !== 'qr' && (
                        <div className="col-sm-12 input_block">
                          <div className="email_code">
                            <input
                              id="login-wizard-password"
                              className="input_filed"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              autoComplete="current-password"
                              style={{ paddingRight: 44 }}
                            />
                            <div
                              className="get_otp otp2"
                              role="button"
                              tabIndex={0}
                              onClick={() => setShowPassword((v) => !v)}
                              onKeyDown={(e) => e.key === 'Enter' && setShowPassword((v) => !v)}
                            >
                              {showPassword
                                ? <i className="ri-eye-line" />
                                : <i className="ri-eye-off-line" />}
                            </div>
                          </div>
                        </div>
                      )}

                      {accountTab !== 'qr' && (
                        <div className="col-sm-12">
                          <div className="login-wizard-bind-row">
                            <label>
                              <input
                                type="checkbox"
                                checked={bindIp}
                                onChange={() => setBindIp((v) => !v)}
                              />
                              Bind IP (Security option)
                            </label>
                            <Link to="/forgot_password">Forgot password</Link>
                          </div>
                        </div>
                      )}

                      {accountTab !== 'qr' && (
                        <>
                          <div className="col-sm-12 login_btn">
                            <button
                              type="button"
                              className="login-wizard-next-btn"
                              onClick={submitLoginStep1}
                            >
                              Next
                            </button>
                          </div>

                          <div className="col-sm-12">
                            <div className="signup-wizard-divider">Or log in with</div>
                            <div className="signup-wizard-social-row" style={{ marginTop: 14 }}>
                              <button
                                type="button"
                                className="signup-wizard-social-btn"
                                onClick={() => showError('Google sign-in coming soon.')}
                                aria-label="Google"
                              >
                                <img src="/images/google_icon.svg" alt="" />
                              </button>
                              <button
                                type="button"
                                className="signup-wizard-social-btn"
                                onClick={() => showError('Apple sign-in coming soon.')}
                                aria-label="Apple"
                              >
                                <img src="/images/appleicon2.svg" alt="" />
                              </button>
                            </div>
                          </div>

                          <div className="col-sm-12">
                            <Link className="login-wizard-create-link" to="/signup">
                              Create a AGCE Account
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </form>
                </>
              )}

              {/* ── Step 2: 2FA verification ── */}
              {wizardStep === 2 && (
                <form onSubmit={(e) => e.preventDefault()} noValidate>
                  <div className="row">
                    <div className="col-sm-12 input_block">
                      <h1 className="login-wizard-title" style={{ fontSize: '1.35rem' }}>
                        {getVerificationTitle()}
                      </h1>
                      <p className="signup-wizard-subtitle">{getVerificationDescription()}</p>
                    </div>

                    {selectedAuthMethod === 4 ? (
                      <>
                        <div className="col-sm-12 input_block" style={{ textAlign: 'center' }}>
                          <div style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: 'linear-gradient(135deg,#00c853 0%,#00a844 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                          }}>
                            <i className="ri-fingerprint-line" style={{ fontSize: 40, color: '#fff' }} />
                          </div>
                          <p style={{ marginBottom: 8 }}>Use your registered passkey to verify</p>
                          <p style={{ opacity: 0.75, fontSize: '0.85rem' }}>
                            This will prompt Face ID, Touch ID, or Windows Hello
                          </p>
                        </div>
                        <div className="col-sm-12 login_btn">
                          <button type="button" className="login-wizard-next-btn" onClick={() => showError('Passkey auth coming soon.')}>
                            Authenticate with Passkey
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-sm-12 input_block">
                          <label htmlFor="login-otp-cell-0">Verification code</label>
                          <div
                            className="signup-wizard-otp-stack"
                            onPaste={handleOtpRowPaste}
                            role="group"
                            aria-label="6-digit verification code"
                          >
                            <div className="signup-wizard-otp-row">
                              {[0, 1, 2, 3, 4, 5].map((i) => (
                                <input
                                  key={i}
                                  id={i === 0 ? 'login-otp-cell-0' : undefined}
                                  ref={(el) => { otpInputRefs.current[i] = el }}
                                  type="text"
                                  inputMode="numeric"
                                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                                  name={i === 0 ? 'one-time-code' : undefined}
                                  className="signup-wizard-otp-cell"
                                  maxLength={1}
                                  value={otpDigitsDisplay[i] ?? ''}
                                  onChange={(e) => handleOtpCellChange(i, e)}
                                  onKeyDown={(e) => handleOtpCellKeyDown(i, e)}
                                  onPaste={handleOtpRowPaste}
                                  aria-label={`Digit ${i + 1} of 6`}
                                />
                              ))}
                            </div>
                            <div className={`signup-wizard-otp-actions${selectedAuthMethod === 2 ? ' login-otp-actions-paste-only' : ''}`}>
                              {selectedAuthMethod !== 2 && (
                                <button
                                  type="button"
                                  className="signup-wizard-otp-link"
                                  disabled={resendTimer > 0}
                                  onClick={() => sendLoginOtp(selectedAuthMethod)}
                                >
                                  {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
                                </button>
                              )}
                              <button
                                type="button"
                                className="signup-wizard-otp-link signup-wizard-otp-paste"
                                onClick={handleOtpPaste}
                              >
                                Paste <i className="ri-file-copy-line" aria-hidden />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-12 login_btn">
                          <button
                            type="button"
                            className="login-wizard-next-btn"
                            onClick={handleAuthVerify}
                            disabled={otpSingle.replace(/\D/g, '').length < 6}
                          >
                            Next
                          </button>
                        </div>

                        {(selectedAuthMethod === 1 || selectedAuthMethod === 3) && (
                          <div className="col-sm-12" style={{ textAlign: 'center', marginTop: 4 }}>
                            <button
                              type="button"
                              className="signup-wizard-otp-link"
                              onClick={() => sendLoginOtp(selectedAuthMethod)}
                              disabled={resendTimer > 0}
                              style={{ margin: '0 auto' }}
                            >
                              Didn&apos;t receive the code?
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {availableMethods.length > 1 && (
                      <div className="col-sm-12">
                        <button
                          type="button"
                          className="signup-wizard-back"
                          onClick={() => setShowMethodModal(true)}
                        >
                          Switch verification method{' '}
                          <i className="ri-external-link-line" aria-hidden />
                        </button>
                      </div>
                    )}

                    <div className="col-sm-12">
                      <button type="button" className="signup-wizard-back" onClick={goBackFromVerificationStep}>
                        ← Back
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Method switcher modal */}
      {showMethodModal && (
        <div
          className="modal fade show search_form"
          style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowMethodModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select a Verification Option</h5>
                <p>Choose how you want to verify your identity</p>
                <button type="button" className="btn-close" onClick={() => setShowMethodModal(false)} aria-label="Close" />
              </div>
              <div className="modal-body">
                {availableMethods.map((method) => (
                  <div
                    key={method.type}
                    className="login-method-row"
                    role="button"
                    tabIndex={0}
                    onClick={() => { setSelectedAuthMethod(method.type); setOtpSingle(''); setResendTimer(0); setShowMethodModal(false) }}
                    onKeyDown={(e) => e.key === 'Enter' && (() => { setSelectedAuthMethod(method.type); setOtpSingle(''); setShowMethodModal(false) })()}
                  >
                    <div className="login-method-row-left">
                      <i className={`${method.icon} me-3`} />
                      <div>
                        <strong>{method.label}</strong>
                        <p className="mb-0 small">{method.description}</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
