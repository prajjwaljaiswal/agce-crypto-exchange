import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useInstanceConfig } from '@agce/hooks'
import { mapInstanceToJurisdiction } from '@agce/config'
import { useAuth } from '../../providers/index.js'
import { authApi } from '../../lib/auth-api.js'
import { formatApiError, isApiErrorWithStatus } from '../../lib/errors.js'
import './signup-wizard.css'

const API_PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

type AccountTab = 'email' | 'phone'

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

export function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [params] = useSearchParams()
  const instance = useInstanceConfig()

  const invitationFromUrl = params.get('reffcode') ?? params.get('referral') ?? ''
  const emailFromUrl = params.get('emailId') ?? ''

  const [accountTab, setAccountTab] = useState<AccountTab>('email')
  const [wizardStep, setWizardStep] = useState(1)
  const [referralOpen, setReferralOpen] = useState(!!invitationFromUrl)
  const [signId, setSignId] = useState(emailFromUrl)
  const [password, setPassword] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [invitation, setInvitation] = useState(invitationFromUrl)
  const [showPassword, setShowPassword] = useState(false)
  const [registrationToken, setRegistrationToken] = useState('')
  const [registeredBy, setRegisteredBy] = useState('')
  const [otpTimer, setOtpTimer] = useState(0)
  const [otpResendBusy, setOtpResendBusy] = useState(false)
  const [attemptLeft, setAttemptLeft] = useState<string | number>('')
  const [otpSingle, setOtpSingle] = useState('')
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const step1InputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  // Identifier in backend format (email as-is, phone as E.164). Stable across steps 2–3.
  const [pendingIdentifier, setPendingIdentifier] = useState('')

  const referralLocked = Boolean(invitationFromUrl)
  const passwordInputType = showPassword ? 'text' : 'password'

  const usernamePart =
    accountTab === 'email' && signId.includes('@')
      ? signId.split('@')[0]
      : signId.replace(/\D/g, '')

  const notAllNumbers = password.length === 0 || !/^\d+$/.test(password)
  const notAllLetters = password.length === 0 || !/^[a-zA-Z]+$/.test(password)
  const passLenOk = password.length >= 8
  const notContainsUsername =
    !usernamePart ||
    usernamePart.length < 2 ||
    !password.toLowerCase().includes(usernamePart.toLowerCase())

  // body class: signupbg (always) + signup-wizard-full-steps (steps 2–4)
  useEffect(() => {
    document.title = 'Sign Up at AGCE – Start Crypto Trading Today'
    document.body.classList.add('signupbg')
    window.scrollTo(0, 0)
    return () => {
      document.body.classList.remove('signupbg')
      document.body.classList.remove('signup-wizard-full-steps')
    }
  }, [])

  useEffect(() => {
    const cls = 'signup-wizard-full-steps'
    if (wizardStep > 1) {
      document.body.classList.add(cls)
    } else {
      document.body.classList.remove(cls)
    }
  }, [wizardStep])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [wizardStep, accountTab])

  // OTP countdown
  useEffect(() => {
    if (otpTimer <= 0) return
    const t = setInterval(() => setOtpTimer((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [otpTimer])

  // Auto-focus identifier input on step 1 (also fires on tab switch)
  useEffect(() => {
    if (wizardStep !== 1) return
    const id = window.setTimeout(() => step1InputRef.current?.focus(), 120)
    return () => window.clearTimeout(id)
  }, [wizardStep, accountTab])

  // Auto-focus password input on step 2
  useEffect(() => {
    if (wizardStep !== 2) return
    const id = window.setTimeout(() => passwordInputRef.current?.focus(), 120)
    return () => window.clearTimeout(id)
  }, [wizardStep])

  // Auto-focus first OTP cell on step 3
  useEffect(() => {
    if (wizardStep !== 3) return
    const id = window.setTimeout(() => otpInputRefs.current[0]?.focus(), 120)
    return () => window.clearTimeout(id)
  }, [wizardStep])

  const switchAccountTab = (tab: AccountTab) => {
    setAccountTab(tab)
    setWizardStep(1)
    setSignId(tab === 'email' ? emailFromUrl : '')
    setPassword('')
    setRegistrationToken('')
    setRegisteredBy('')
    setShowPassword(false)
    setAttemptLeft('')
    setOtpTimer(0)
    setOtpSingle('')
    setReferralOpen(!!invitationFromUrl)
  }

  const showError = (msg: string) => alert(msg)
  const showSuccess = (msg: string) => alert(msg)

  // Step 1: check the identifier is available before advancing.
  const checkIdentifierMutation = useMutation({
    mutationFn: (identifier: string) =>
      authApi.checkIdentifier({ identifier, purpose: 'SIGNUP' }),
    onSuccess: () => setWizardStep(2),
    onError: (error) => {
      if (isApiErrorWithStatus(error, 409)) {
        showError('This email/phone is already registered. Please log in instead.')
      } else {
        showError(formatApiError(error, 'Could not verify identifier. Please try again.'))
      }
    },
  })

  // Signup flow: sendOtp → verifyOtp → register.
  // Step 2 (password confirm) sends the OTP and advances to step 3.
  // Step 3 (OTP entry) verifies the code and *then* calls register.
  const sendSignupOtpMutation = useMutation({
    mutationFn: (identifier: string) =>
      authApi.sendOtp({ identifier, type: 'SIGNUP' }),
    onSuccess: () => {
      showSuccess('Verification code sent. Please check your inbox.')
      setRegisteredBy(accountTab === 'email' ? 'Email' : 'Mobile')
      setOtpSingle('')
      setOtpTimer(60)
      setWizardStep(3)
    },
    onError: (error) => showError(formatApiError(error, 'Could not send verification code.')),
  })

  const verifyAndRegisterMutation = useMutation({
    mutationFn: async (otp: string) => {
      await authApi.verifyOtp({
        identifier: pendingIdentifier,
        otp,
        purpose: 'SIGNUP',
      })
      return authApi.register({
        identifier: pendingIdentifier,
        password,
        jurisdiction: mapInstanceToJurisdiction(instance.id),
      })
    },
    onSuccess: (response) => {
      login(
        { accessToken: response.accessToken, refreshToken: response.refreshToken },
        { id: response.userId, userId: response.user.userId, identifier: pendingIdentifier },
      )
      setRegistrationToken(response.userId)
      setWizardStep(4)
    },
    onError: (error) => showError(formatApiError(error, 'Could not complete signup.')),
  })

  const resendSignupOtpMutation = useMutation({
    mutationFn: () => authApi.sendOtp({ identifier: pendingIdentifier, type: 'SIGNUP' }),
    onSuccess: () => {
      showSuccess('Code resent!')
      setOtpTimer(60)
      setOtpSingle('')
      setAttemptLeft('')
    },
    onError: (error) => showError(formatApiError(error, 'Could not resend code.')),
  })

  /* ── Step 1: validate email / phone → checkIdentifier → go to step 2 ── */
  const step1Next = () => {
    let identifier: string
    if (accountTab === 'email') {
      const email = signId.trim()
      if (!email) { showError('Please enter your email'); return }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('Please enter a valid email address')
        return
      }
      if (email !== signId) setSignId(email)
      identifier = email
    } else {
      const digits = signId.replace(/\D/g, '').replace(/^0+/, '')
      if (!digits || digits.length < 6) {
        showError('Please enter a valid phone number for the selected country')
        return
      }
      if (digits !== signId) setSignId(digits)
      identifier = `${countryCode}${digits}`
    }
    checkIdentifierMutation.mutate(identifier)
  }

  /* ── Step 2: validate password → stub register → go to step 3 ── */
  const validatePasswordStep = (): boolean => {
    if (!password) { showError('Please enter your password'); return false }
    if (!notAllNumbers) { showError('Password cannot be only numbers.'); return false }
    if (!notAllLetters) { showError('Password cannot be only letters.'); return false }
    if (!passLenOk) { showError('Password must be at least 8 characters.'); return false }
    if (!notContainsUsername) {
      showError('Password cannot contain your email username or phone number.')
      return false
    }
    if (!API_PASSWORD_REGEX.test(password)) {
      showError(
        'Use at least 8 characters with uppercase, lowercase, a number, and a special character (#?!@$%^&*-).',
      )
      return false
    }
    return true
  }

  const submitPasswordAndRegister = () => {
    if (!validatePasswordStep()) return
    const identifier =
      accountTab === 'email' ? signId.trim() : `${countryCode}${signId.replace(/\D/g, '')}`
    setPendingIdentifier(identifier)
    sendSignupOtpMutation.mutate(identifier)
  }

  /* ── Step 3: OTP ── */
  const getOtpDigitsStr = () => otpSingle.replace(/\D/g, '').slice(0, 6)

  const handleOtpSubmit = () => {
    const code = getOtpDigitsStr()
    if (code.length < 6) { showError('Please enter the 6-digit code'); return }
    if (!pendingIdentifier) { showError('Session expired — please restart signup.'); return }
    verifyAndRegisterMutation.mutate(code)
  }

  const handleResendOtp = () => {
    if (otpTimer > 0 || otpResendBusy || !pendingIdentifier) return
    setOtpResendBusy(true)
    resendSignupOtpMutation.mutate(undefined, {
      onSettled: () => setOtpResendBusy(false),
    })
  }

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
      if (d[index]) {
        e.preventDefault()
        setOtpSingle(d.slice(0, index) + d.slice(index + 1))
      } else if (index > 0) {
        e.preventDefault()
        setOtpSingle(d.slice(0, index - 1) + d.slice(index))
        focusOtpIndex(index - 1)
      }
    }
  }

  const handleOtpRowPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData?.getData('text') ?? ''
    const raw = text.replace(/\D/g, '').slice(0, 6)
    if (!raw) return
    e.preventDefault()
    setOtpSingle(raw)
    focusOtpIndex(Math.min(raw.length, 5))
  }

  const handleOtpPaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      const raw = text.replace(/\D/g, '').slice(0, 6)
      setOtpSingle(raw)
      focusOtpIndex(Math.min(raw.length, 5))
    } catch {
      showError('Unable to read clipboard.')
    }
  }, [])

  const goBackFromPasswordStep = () => setWizardStep(1)

  const goBackFromVerificationStep = () => {
    setWizardStep(2)
    setRegistrationToken('')
    setRegisteredBy('')
    setOtpSingle('')
    setOtpTimer(0)
    setAttemptLeft('')
  }

  const maskedEmail = (email: string) => {
    if (!email.includes('@')) return email
    const [u, d] = email.split('@')
    if (u.length <= 2) return `${u[0]}***@${d}`
    return `${u[0]}***${u.slice(-1)}@${d}`
  }

  const maskedPhoneDisplay = () => {
    const raw = signId
    if (raw.length <= 4) return `${countryCode} ${raw}`
    return `${countryCode} ${raw.slice(0, 2)}***${raw.slice(-2)}`
  }

  const registeredKind = registeredBy || (accountTab === 'email' ? 'Email' : 'Mobile')

  const signupFormTitle =
    wizardStep === 1
      ? 'Create Account'
      : wizardStep === 2
        ? 'Set your password'
        : wizardStep === 3
          ? accountTab === 'email'
            ? 'Verify your email'
            : 'Verify your phone'
          : ''

  const otpDigitsDisplay = getOtpDigitsStr()

  return (
    <>
      <div className="login_fullhieght">
        <div className="sign_in_form_s">

          {/* Left promo panel (visible on step 1 only via CSS) */}
          <div className="sign_rewards">
            <h2>
              Create your account and get rewarded instantly with <br />
              <span>AGCE coins</span>.
            </h2>
            <div className="rewards_vector">
              <img
                className="rewards_vector"
                src="/images/new-images/rewards_vector.png"
                alt="rewards"
              />
            </div>
          </div>

          {/* Right form panel */}
          <div className="login_section bgsignup">
            <div className={`login_form_right${wizardStep === 4 ? " signup-wizard-welcome-wide" : ""}`}>
              <div className="form_block_login">
                <h2>{signupFormTitle}</h2>

                {wizardStep === 1 && (
                  <ul className="nav nav-tabs login-pills" id="signupTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        type="button"
                        className={`nav-link ${accountTab === 'email' ? 'active' : ''}`}
                        role="tab"
                        aria-selected={accountTab === 'email'}
                        onClick={() => switchAccountTab('email')}
                      >
                        Email
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        type="button"
                        className={`nav-link ${accountTab === 'phone' ? 'active' : ''}`}
                        role="tab"
                        aria-selected={accountTab === 'phone'}
                        onClick={() => switchAccountTab('phone')}
                      >
                        Mobile
                      </button>
                    </li>
                  </ul>
                )}

                <div className="tab-content" id="signupTabContent">
                  <div className="tab-pane fade show active" role="tabpanel">

                    {/* ── Step 1: identifier ── */}
                    {wizardStep === 1 && (
                      <form onSubmit={(e) => { e.preventDefault(); step1Next() }} noValidate>
                        <div className="row">
                          {accountTab === 'email' ? (
                            <div className="col-sm-12 input_block">
                              <div className="email_code">
                                <input
                                  ref={step1InputRef}
                                  className="input_filed"
                                  type="email"
                                  placeholder="Enter email address"
                                  value={signId}
                                  onChange={(e) => setSignId(e.target.value)}
                                  onBlur={(e) => setSignId(e.target.value.trim())}
                                  autoComplete="email"
                                />
                              </div>
                            </div>
                          ) : (
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
                                    ref={step1InputRef}
                                    className="input_filed"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Enter phone number"
                                    value={signId}
                                    onChange={(e) => setSignId(e.target.value.replace(/\D/g, ''))}
                                    autoComplete="tel"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          <div className="col-sm-12 input_block">
                            <button
                              type="button"
                              className={`signup-wizard-referral-toggle ${referralOpen ? 'is-open' : ''}`}
                              onClick={() => setReferralOpen((o) => !o)}
                              aria-expanded={referralOpen}
                            >
                              Referral code (optional){' '}
                              <i className="ri-arrow-down-s-line" aria-hidden />
                            </button>
                            {referralOpen && (
                              <div className="email_code">
                                <input
                                  className="input_filed"
                                  type="text"
                                  placeholder="Referral code (optional)"
                                  value={invitation}
                                  onChange={(e) => setInvitation(e.target.value)}
                                  disabled={referralLocked}
                                />
                              </div>
                            )}
                          </div>

                          <div className="col-sm-12 login_btn">
                            <button
                              className="next_btn"
                              type="submit"
                              disabled={checkIdentifierMutation.isPending}
                            >
                              {checkIdentifierMutation.isPending ? 'Checking…' : 'Next'}
                            </button>
                          </div>

                          <div className="col-sm-12">
                            <div className="signup-wizard-divider">Or log in with</div>
                            <div className="signup-wizard-social-row">
                              <button
                                type="button"
                                className="signup-wizard-social-btn"
                                onClick={() => showError('Google sign-up coming soon.')}
                                aria-label="Google"
                              >
                                <img src="/images/google_icon.svg" alt="" />
                              </button>
                              <button
                                type="button"
                                className="signup-wizard-social-btn"
                                onClick={() => showError('Apple sign-up coming soon.')}
                                aria-label="Apple"
                              >
                                <img src="/images/appleicon2.svg" alt="" />
                              </button>
                            </div>
                          </div>

                          <div className="col-sm-12 registration__info agreetext">
                            <p>
                              Already have an account? <Link to="/login">Log In</Link>
                            </p>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* ── Step 2: password ── */}
                    {wizardStep === 2 && (
                      <form
                        onSubmit={(e) => { e.preventDefault(); submitPasswordAndRegister() }}
                        noValidate
                      >
                        <div className="row">
                          <div className="col-sm-12 input_block">
                            <p className="signup-wizard-subtitle">
                              Set the password to complete the signup
                            </p>
                          </div>
                          <div className="col-sm-12 input_block">
                            <label htmlFor="signup-password-field">Password</label>
                            <div className="email_code">
                              <input
                                ref={passwordInputRef}
                                id="signup-password-field"
                                className="input_filed"
                                type={passwordInputType}
                                placeholder="Enter a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                style={{ paddingRight: 44 }}
                              />
                              <div
                                className="get_otp otp2"
                                role="button"
                                tabIndex={0}
                                onClick={() => setShowPassword((s) => !s)}
                                onKeyDown={(e) => e.key === 'Enter' && setShowPassword((s) => !s)}
                              >
                                {showPassword
                                  ? <i className="ri-eye-line" />
                                  : <i className="ri-eye-off-line" />}
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-12 input_block">
                            <div className={`signup-wizard-rule-row ${notAllNumbers ? 'is-ok' : 'is-bad'}`}>
                              <i className={notAllNumbers ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill'} aria-hidden />
                              <span>Cannot be all numbers</span>
                            </div>
                            <div className={`signup-wizard-rule-row ${notAllLetters ? 'is-ok' : 'is-bad'}`}>
                              <i className={notAllLetters ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill'} aria-hidden />
                              <span>Cannot be all letters (case-sensitive)</span>
                            </div>
                            <div className={`signup-wizard-rule-row ${passLenOk ? 'is-ok' : 'is-bad'}`}>
                              <i className={passLenOk ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill'} aria-hidden />
                              <span>Minimum 8 characters required</span>
                            </div>
                            <div className={`signup-wizard-rule-row ${notContainsUsername ? 'is-ok' : 'is-bad'}`}>
                              <i className={notContainsUsername ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill'} aria-hidden />
                              <span>Cannot contain username</span>
                            </div>
                          </div>

                          <div className="col-sm-12 login_btn">
                            <input
                              type="submit"
                              value={sendSignupOtpMutation.isPending ? 'Sending code…' : 'Confirm'}
                              disabled={sendSignupOtpMutation.isPending}
                            />
                          </div>
                          <div className="col-sm-12">
                            <button
                              type="button"
                              className="signup-wizard-back"
                              onClick={goBackFromPasswordStep}
                            >
                              ← Back
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* ── Step 3: OTP verification ── */}
                    {wizardStep === 3 && (
                      <form
                        onSubmit={(e) => { e.preventDefault(); handleOtpSubmit() }}
                        noValidate
                      >
                        <div className="row">
                          <div className="col-sm-12 input_block">
                            <p className="signup-wizard-subtitle">
                              Enter the verification code sent to your{' '}
                              {registeredKind === 'Email' ? 'email' : 'phone'}{' '}
                              <strong>
                                {accountTab === 'email'
                                  ? maskedEmail(signId)
                                  : maskedPhoneDisplay()}
                              </strong>
                              , valid for 10 minutes.
                            </p>
                          </div>

                          <div className="col-sm-12 input_block">
                            <label htmlFor="signup-otp-cell-0">Verification code</label>
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
                                    id={i === 0 ? 'signup-otp-cell-0' : undefined}
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
                              <div className="signup-wizard-otp-actions">
                                <button
                                  type="button"
                                  className="signup-wizard-otp-link"
                                  disabled={otpTimer > 0 || otpResendBusy}
                                  onClick={handleResendOtp}
                                >
                                  {otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Resend'}
                                </button>
                                <button
                                  type="button"
                                  className="signup-wizard-otp-link signup-wizard-otp-paste"
                                  onClick={handleOtpPaste}
                                >
                                  Paste{' '}
                                  <i className="ri-file-copy-line" aria-hidden />
                                </button>
                              </div>
                            </div>
                            {attemptLeft !== '' && attemptLeft != null && (
                              <p className="signup-wizard-subtitle" style={{ marginTop: -8 }}>
                                Attempts left: {attemptLeft}
                              </p>
                            )}
                          </div>

                          <div className="col-sm-12 login_btn">
                            <button
                              className="next_btn"
                              type="submit"
                              disabled={verifyAndRegisterMutation.isPending}
                            >
                              {verifyAndRegisterMutation.isPending ? 'Creating account…' : 'Next'}
                            </button>
                          </div>
                          <div
                            className="col-sm-12 signup-wizard-otp-actions"
                            style={{ justifyContent: 'flex-start', marginTop: 4 }}
                          >
                            <button
                              type="button"
                              className="signup-wizard-back"
                              style={{ margin: 0 }}
                              onClick={goBackFromVerificationStep}
                            >
                              ← Back
                            </button>
                            <button
                              type="button"
                              className="signup-wizard-back"
                              style={{ margin: 0 }}
                              onClick={handleResendOtp}
                              disabled={otpTimer > 0}
                            >
                              Didn&apos;t receive the code?
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* ── Step 4: welcome / verify identity ── */}
                    {wizardStep === 4 && (
                      <div className="row">
                        <div className="col-sm-12 input_block text-center">
                          <div className="signup-wizard-welcome-img">
                            <img src="/images/login_sucessfull_img.png" alt="" />
                          </div>
                          <h3 className="mb-2 verify_hd">
                            Welcome to AGCE Verify your identity to claim{' '}
                            <span>exciting bonus</span>.
                          </h3>
                        </div>
                        <div className="col-sm-12 input_block">
                          <table className="signup-wizard-priv-table">
                            <thead>
                              <tr>
                                <th>Privileges</th>
                                <th>Not Verified</th>
                                <th>Verified</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Withdrawal</td>
                                <td>—</td>
                                <td><strong>3M USDT</strong></td>
                              </tr>
                              <tr>
                                <td>Deposit</td>
                                <td>—</td>
                                <td>
                                  <i
                                    className="ri-check-line"
                                    style={{ color: '#d1aa67' }}
                                    aria-hidden
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Trading</td>
                                <td>—</td>
                                <td>
                                  <i
                                    className="ri-check-line"
                                    style={{ color: '#d1aa67' }}
                                    aria-hidden
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>P2P</td>
                                <td>—</td>
                                <td>
                                  <i
                                    className="ri-check-line"
                                    style={{ color: '#d1aa67' }}
                                    aria-hidden
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col-sm-12 login_btn">
                          <button
                            type="button"
                            className="next_btn"
                            onClick={() => navigate(`/account-activate/${registrationToken}`)}
                          >
                            Verify Now
                          </button>
                        </div>
                        <div className="col-sm-12">
                          <div className="signup-wizard-secure">
                            <i className="ri-shield-check-line" aria-hidden />
                            Your information is securely encrypted on AGCE.
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
