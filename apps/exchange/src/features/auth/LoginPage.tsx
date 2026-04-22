import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser'
import type { LoginMethodKind, LoginResponse, LoginSuccess, TwoFactorChallenge } from '@agce/types'
import { useAuth } from '../../providers/index.js'
import { authApi } from '../../lib/auth-api.js'
import { formatApiError } from '../../lib/errors.js'
import { SocialLoginButtons } from './SocialLoginButtons.js'
import { CountryCodeSelect } from './CountryCodeSelect.js'
import './signup-wizard.css'
import './login-wizard.css'

function isLoginSuccess(response: LoginResponse): response is LoginSuccess {
  return 'accessToken' in response
}

type AccountTab = 'email_user' | 'phone' | 'qr'

interface AuthMethod {
  type: number
  label: string
  icon: string
  description: string
  maskedValue?: string
}

const METHOD_DEFS: Record<LoginMethodKind, AuthMethod> = {
  EMAIL: {
    type: 1,
    label: 'Email OTP',
    icon: 'ri-mail-line',
    description: 'Receive a verification code via email',
  },
  GOOGLE_AUTHENTICATOR: {
    type: 2,
    label: 'Google Authenticator',
    icon: 'ri-shield-keyhole-line',
    description: 'Enter the 6-digit code from your authenticator app',
  },
  MOBILE: {
    type: 3,
    label: 'Phone OTP',
    icon: 'ri-phone-line',
    description: 'Receive a verification code via SMS',
  },
  PASSKEY: {
    type: 4,
    label: 'Passkey',
    icon: 'ri-fingerprint-line',
    description: 'Authenticate with your registered passkey',
  },
}

// Resolve the enabled methods list from whichever challenge shape the backend
// returned. Preference order: explicit `methods[]` → nested `security` flags
// → legacy flat flags on the challenge root.
function resolveAuthMethods(challenge: TwoFactorChallenge): AuthMethod[] {
  if (challenge.methods?.length) {
    return challenge.methods
      .map((kind) => METHOD_DEFS[kind])
      .filter((m): m is AuthMethod => Boolean(m))
  }
  const security = challenge.security ?? challenge
  const googleEnabled =
    security.googleAuthenticatorEnabled ?? security.isGoogleAuthenticatorEnabled
  const kinds: LoginMethodKind[] = []
  if (security.emailVerification) kinds.push('EMAIL')
  if (security.mobileVerification) kinds.push('MOBILE')
  if (googleEnabled) kinds.push('GOOGLE_AUTHENTICATOR')
  if (security.isPasskeyEnabled) kinds.push('PASSKEY')
  return kinds.map((k) => METHOD_DEFS[k])
}

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [wizardStep, setWizardStep] = useState(1)
  const [accountTab, setAccountTab] = useState<AccountTab>('email_user')
  const [signId, setSignId] = useState('')
  const [password, setPassword] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [showPassword, setShowPassword] = useState(false)
  const [bindIp, setBindIp] = useState(false)

  // The identifier in backend-ready form (email as-is, phone as E.164).
  // Captured on step-1 submit so step 2 can re-use it without re-parsing.
  const [pendingIdentifier, setPendingIdentifier] = useState('')

  // Step 2 — 2FA verification. Every enabled method is rendered as its own
  // section on the page, so codes are tracked per-method in a single map.
  const [loginPendingVerification, setLoginPendingVerification] = useState(false)
  const [availableMethods, setAvailableMethods] = useState<AuthMethod[]>([])
  const [resendTimer, setResendTimer] = useState(0)
  const [otpByMethod, setOtpByMethod] = useState<Record<number, string>>({})
  const otpRefsByMethod = useRef<Record<number, Array<HTMLInputElement | null>>>({})
  const signIdInputRef = useRef<HTMLInputElement>(null)

  const getOtpDigits = (method: number) =>
    (otpByMethod[method] ?? '').replace(/\D/g, '').slice(0, 6)

  const setOtpForMethod = (method: number, next: string) => {
    setOtpByMethod((prev) => ({ ...prev, [method]: next }))
  }

  const getRefArrayForMethod = (method: number) => {
    if (!otpRefsByMethod.current[method]) {
      otpRefsByMethod.current[method] = []
    }
    return otpRefsByMethod.current[method]
  }

  useEffect(() => {
    document.title = 'Arab Global Crypto Exchange – Log In'
    document.body.classList.add('loginbg')
    return () => document.body.classList.remove('loginbg')
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [wizardStep, accountTab])

  // Auto-focus identifier input on step 1 (also fires on tab switch)
  useEffect(() => {
    if (wizardStep !== 1 || accountTab === 'qr') return
    const id = window.setTimeout(() => signIdInputRef.current?.focus(), 120)
    return () => window.clearTimeout(id)
  }, [wizardStep, accountTab])

  // Auto-focus the first OTP cell of the first non-passkey method on step 2
  useEffect(() => {
    if (wizardStep !== 2) return
    const target = availableMethods.find((m) => m.type !== 4)
    if (!target) return
    const id = window.setTimeout(() => {
      const refs = otpRefsByMethod.current[target.type]
      refs?.[0]?.focus()
    }, 120)
    return () => window.clearTimeout(id)
  }, [wizardStep, availableMethods])

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

  const showError = (msg: string) => toast.error(msg)
  const showSuccess = (msg: string) => toast.success(msg)

  const handleLoginSuccess = useCallback(
    (response: LoginSuccess) => {
      login(
        { accessToken: response.accessToken, refreshToken: response.refreshToken },
        { id: response.userId, userId: response.userId, identifier: pendingIdentifier },
      )
      navigate('/user_profile/dashboard')
    },
    [login, navigate, pendingIdentifier],
  )

  const loginMutation = useMutation({
    mutationFn: (payload: { identifier: string; password: string; bindIp: boolean }) =>
      authApi.login(payload),
    onSuccess: (response) => {
      if (isLoginSuccess(response)) {
        showSuccess('Login successful!')
        handleLoginSuccess(response)
        return
      }
      // 2FA branch. The backend returns which verification channels are
      // enabled for this account — build the list from whichever shape it
      // sent (methods[] array or security flags).
      const methods = resolveAuthMethods(response)
      if (methods.length === 0) {
        showError('No verification methods are enabled for this account.')
        return
      }
      setAvailableMethods(methods)
      setResendTimer(0)
      setOtpByMethod({})
      otpRefsByMethod.current = {}
      setLoginPendingVerification(true)
      setWizardStep(2)
      showSuccess(
        methods.some((m) => m.type === 1 || m.type === 3)
          ? 'Verification code sent — check your inbox.'
          : 'Enter your authenticator code.',
      )
    },
    onError: (error) => showError(formatApiError(error, 'Login failed.')),
  })

  const verifyOtpMutation = useMutation({
    mutationFn: (payload: {
      identifier: string
      bindIp: boolean
      emailOtp?: string
      mobileOtp?: string
      googleTotp?: string
    }) => authApi.verifyOtp({ ...payload, purpose: 'LOGIN' }),
    onSuccess: (response) => {
      if (response && typeof response === 'object' && 'accessToken' in response) {
        showSuccess('Login successful!')
        handleLoginSuccess(response as LoginSuccess)
      } else {
        showError('Verification succeeded but no session was returned.')
      }
    },
    onError: (error) => showError(formatApiError(error, 'Invalid verification code.')),
  })

  const resendLoginOtpMutation = useMutation({
    mutationFn: (identifier: string) => authApi.sendOtp({ identifier, type: 'LOGIN' }),
    onSuccess: () => {
      setResendTimer(60)
      showSuccess('Verification code resent.')
    },
    onError: (error) => showError(formatApiError(error, 'Could not resend code.')),
  })

  const passkeyLoginMutation = useMutation({
    mutationFn: async (payload: { identifier: string }) => {
      const { challengeId, options } = await authApi.passkeyLoginOptions({
        identifier: payload.identifier,
      })
      const assertion = await startAuthentication({
        optionsJSON: options as unknown as Parameters<
          typeof startAuthentication
        >[0]['optionsJSON'],
      })
      return authApi.loginWithPasskey({
        provider: 'PASSKEY',
        identifier: payload.identifier,
        challengeId,
        response: assertion as unknown as Record<string, unknown>,
      })
    },
    onSuccess: (response) => {
      showSuccess('Login successful!')
      const userId = response.user?.userId ?? response.user?.id ?? ''
      handleLoginSuccess({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        userId,
      })
    },
    onError: (error) => {
      const err = error as { name?: string; message?: string }
      if (err?.name === 'NotAllowedError' || err?.name === 'AbortError') {
        showError('Passkey prompt was cancelled.')
        return
      }
      showError(formatApiError(error, 'Passkey login failed.'))
    },
  })

  const switchLoginTab = (tab: AccountTab) => {
    if (wizardStep === 2) return
    setAccountTab(tab)
    setSignId('')
    setPassword('')
    setShowPassword(false)
    setBindIp(false)
    setWizardStep(1)
    setLoginPendingVerification(false)
    setOtpByMethod({})
    otpRefsByMethod.current = {}
    setAvailableMethods([])
    setResendTimer(0)
  }

  // Resolve the identifier from the current form state.
  // Returns null (and shows a toast) if the input is missing/invalid.
  const resolveIdentifier = (): string | null => {
    if (accountTab === 'email_user') {
      const raw = signId.trim()
      if (!raw) { showError('Please enter your email or username'); return null }
      return raw
    }
    const digits = signId.replace(/\D/g, '').replace(/^0+/, '')
    if (!digits || digits.length < 6) { showError('Please enter a valid phone number'); return null }
    return `${countryCode}${digits}`
  }

  /* ── Step 1 submit ── */
  const submitLoginStep1 = () => {
    if (accountTab === 'qr') { showError('QR code login is coming soon.'); return }
    if (!password) { showError('Please enter your password'); return }

    const identifier = resolveIdentifier()
    if (!identifier) return

    setPendingIdentifier(identifier)
    loginMutation.mutate({ identifier, password, bindIp })
  }

  const submitPasskeyLogin = () => {
    if (accountTab === 'qr') return
    if (!browserSupportsWebAuthn()) {
      showError('Your browser does not support passkeys.')
      return
    }
    const identifier = resolveIdentifier()
    if (!identifier) return
    setPendingIdentifier(identifier)
    passkeyLoginMutation.mutate({ identifier })
  }

  /* ── Step 2: OTP verify ── */
  const handleAuthVerify = () => {
    if (!pendingIdentifier) { showError('Session expired — please log in again.'); return }
    // Collect every filled 6-digit code and post them together. Backend maps:
    //   email   → emailOtp    (type 1)
    //   google  → googleTotp  (type 2)
    //   mobile  → mobileOtp   (type 3)
    // Passkey is handled by its own button and not part of this submit.
    const payload: {
      identifier: string
      bindIp: boolean
      emailOtp?: string
      mobileOtp?: string
      googleTotp?: string
    } = { identifier: pendingIdentifier, bindIp }
    for (const m of availableMethods) {
      if (m.type === 4) continue
      const code = getOtpDigits(m.type)
      if (code.length !== 6) continue
      if (m.type === 1) payload.emailOtp = code
      else if (m.type === 2) payload.googleTotp = code
      else if (m.type === 3) payload.mobileOtp = code
    }
    if (!payload.emailOtp && !payload.mobileOtp && !payload.googleTotp) {
      showError('Please enter a 6-digit code for at least one verification method.')
      return
    }
    verifyOtpMutation.mutate(payload)
  }

  const sendLoginOtp = (method: number) => {
    // Authenticator and passkey don't use OTPs.
    if (method === 2 || method === 4) return
    if (!pendingIdentifier) return
    resendLoginOtpMutation.mutate(pendingIdentifier)
  }

  const goBackFromVerificationStep = () => {
    setWizardStep(1)
    setLoginPendingVerification(false)
    setOtpByMethod({})
    otpRefsByMethod.current = {}
    setResendTimer(0)
    setAvailableMethods([])
  }

  /* OTP cell helpers — all parametrised by method type so each enabled 2FA
     section on the verification page owns its own input ring. */
  const focusOtpIndex = (method: number, idx: number) => {
    requestAnimationFrame(() => {
      const refs = otpRefsByMethod.current[method]
      refs?.[Math.min(Math.max(0, idx), 5)]?.focus()
    })
  }

  const handleOtpCellChange = (
    method: number,
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const raw = e.target.value.replace(/\D/g, '')
    const d = getOtpDigits(method)
    const before = d.slice(0, index)
    const after = d.slice(index + 1)
    if (!raw) { setOtpForMethod(method, before + after); return }
    const merged = (before + raw + after).replace(/\D/g, '').slice(0, 6)
    setOtpForMethod(method, merged)
    focusOtpIndex(method, Math.min(index + raw.length, 5))
  }

  const handleOtpCellKeyDown = (
    method: number,
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const d = getOtpDigits(method)
    if (e.key === 'Backspace') {
      if (d[index]) {
        e.preventDefault()
        setOtpForMethod(method, d.slice(0, index) + d.slice(index + 1))
      } else if (index > 0) {
        e.preventDefault()
        setOtpForMethod(method, d.slice(0, index - 1) + d.slice(index))
        focusOtpIndex(method, index - 1)
      }
    }
  }

  const handleOtpRowPaste = (method: number, e: React.ClipboardEvent) => {
    const raw = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6)
    if (!raw) return
    e.preventDefault()
    setOtpForMethod(method, raw)
    focusOtpIndex(method, Math.min(raw.length, 5))
  }

  const handleOtpPaste = useCallback(
    async (method: number) => {
      try {
        const raw = (await navigator.clipboard.readText()).replace(/\D/g, '').slice(0, 6)
        setOtpForMethod(method, raw)
        focusOtpIndex(method, Math.min(raw.length, 5))
      } catch {
        showError('Unable to read clipboard.')
      }
    },
    [],
  )

  const methodDescription = (method: AuthMethod): string => {
    switch (method.type) {
      case 1: return `Code sent to your email${method.maskedValue ? ` ${method.maskedValue}` : ''}. Valid for 10 minutes.`
      case 2: return 'Enter the 6-digit code from your authenticator app.'
      case 3: return `Code sent to your phone${method.maskedValue ? ` ${method.maskedValue}` : ''}. Valid for 10 minutes.`
      case 4: return 'Authenticate with your registered passkey.'
      default: return ''
    }
  }

  const submitDisabled =
    verifyOtpMutation.isPending ||
    !availableMethods.some((m) => m.type !== 4 && getOtpDigits(m.type).length === 6)

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
                              ref={signIdInputRef}
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
                            <CountryCodeSelect
                              value={countryCode}
                              onChange={(dial) => setCountryCode(dial)}
                            />
                          </div>
                          <div className="col-sm-12 input_block">
                            <div className="phone-input-wrapper">
                              <input
                                ref={signIdInputRef}
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
                              type="submit"
                              className="login-wizard-next-btn"
                              disabled={loginMutation.isPending}
                            >
                              {loginMutation.isPending ? 'Signing in…' : 'Next'}
                            </button>
                          </div>

                          <div className="col-sm-12" style={{ marginTop: 10 }}>
                            <button
                              type="button"
                              className="login-wizard-passkey-outline"
                              onClick={submitPasskeyLogin}
                              disabled={passkeyLoginMutation.isPending}
                            >
                              <i className="ri-fingerprint-line" aria-hidden />
                              {passkeyLoginMutation.isPending
                                ? 'Authenticating…'
                                : 'Sign in with passkey'}
                            </button>
                          </div>

                          <div className="col-sm-12" style={{ marginTop: 14 }}>
                            <SocialLoginButtons
                              dividerLabel="Or log in with"
                              mode="login"
                              onSuccess={() => navigate('/user_profile/dashboard')}
                            />
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

              {/* ── Step 2: 2FA verification — every enabled method shown ── */}
              {wizardStep === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); handleAuthVerify() }} noValidate>
                  <div className="row">
                    <div className="col-sm-12 input_block">
                      <h1 className="login-wizard-title" style={{ fontSize: '1.35rem' }}>
                        Verify Your Identity
                      </h1>
                      <p className="signup-wizard-subtitle">
                        {availableMethods.length > 1
                          ? 'Complete any one of the verification methods below.'
                          : methodDescription(availableMethods[0])}
                      </p>
                    </div>

                    {availableMethods.map((method) => {
                      if (method.type === 4) {
                        return (
                          <div key={method.type} className="col-sm-12 input_block">
                            <label>{method.label}</label>
                            <div style={{ textAlign: 'center', padding: '12px 0' }}>
                              <div style={{
                                width: 64, height: 64, borderRadius: '50%',
                                background: 'linear-gradient(135deg,#00c853 0%,#00a844 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 12px',
                              }}>
                                <i className="ri-fingerprint-line" style={{ fontSize: 28, color: '#fff' }} />
                              </div>
                              <p style={{ opacity: 0.75, fontSize: '0.85rem', margin: 0 }}>
                                Face ID / Touch ID / Windows Hello
                              </p>
                              <button
                                type="button"
                                className="login-wizard-passkey-outline"
                                style={{ marginTop: 10 }}
                                onClick={submitPasskeyLogin}
                                disabled={passkeyLoginMutation.isPending}
                              >
                                <i className="ri-fingerprint-line" aria-hidden />
                                {passkeyLoginMutation.isPending ? 'Authenticating…' : 'Authenticate with Passkey'}
                              </button>
                            </div>
                          </div>
                        )
                      }
                      const digits = getOtpDigits(method.type)
                      const cellIdPrefix = `login-otp-${method.type}-cell`
                      const isAuthenticator = method.type === 2
                      return (
                        <div key={method.type} className="col-sm-12 input_block">
                          <label htmlFor={`${cellIdPrefix}-0`}>{method.label}</label>
                          <p className="signup-wizard-subtitle" style={{ marginTop: -4, marginBottom: 8 }}>
                            {methodDescription(method)}
                          </p>
                          <div
                            className="signup-wizard-otp-stack"
                            onPaste={(e) => handleOtpRowPaste(method.type, e)}
                            role="group"
                            aria-label={`${method.label} 6-digit code`}
                          >
                            <div className="signup-wizard-otp-row">
                              {[0, 1, 2, 3, 4, 5].map((i) => (
                                <input
                                  key={i}
                                  id={i === 0 ? `${cellIdPrefix}-0` : undefined}
                                  ref={(el) => { getRefArrayForMethod(method.type)[i] = el }}
                                  type="text"
                                  inputMode="numeric"
                                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                                  name={i === 0 ? `one-time-code-${method.type}` : undefined}
                                  className="signup-wizard-otp-cell"
                                  maxLength={1}
                                  value={digits[i] ?? ''}
                                  onChange={(e) => handleOtpCellChange(method.type, i, e)}
                                  onKeyDown={(e) => handleOtpCellKeyDown(method.type, i, e)}
                                  onPaste={(e) => handleOtpRowPaste(method.type, e)}
                                  aria-label={`${method.label} digit ${i + 1} of 6`}
                                />
                              ))}
                            </div>
                            <div className={`signup-wizard-otp-actions${isAuthenticator ? ' login-otp-actions-paste-only' : ''}`}>
                              {!isAuthenticator && (
                                <button
                                  type="button"
                                  className="signup-wizard-otp-link"
                                  disabled={resendTimer > 0}
                                  onClick={() => sendLoginOtp(method.type)}
                                >
                                  {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
                                </button>
                              )}
                              <button
                                type="button"
                                className="signup-wizard-otp-link signup-wizard-otp-paste"
                                onClick={() => handleOtpPaste(method.type)}
                              >
                                Paste <i className="ri-file-copy-line" aria-hidden />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    <div className="col-sm-12 login_btn">
                      <button
                        type="submit"
                        className="login-wizard-next-btn"
                        disabled={submitDisabled}
                      >
                        {verifyOtpMutation.isPending ? 'Verifying…' : 'Next'}
                      </button>
                    </div>

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
    </>
  )
}
