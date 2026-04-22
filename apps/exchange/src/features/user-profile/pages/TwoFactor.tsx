import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../../providers/AuthProvider.js'
import { useRemovePasskey } from '../hooks/useRemovePasskey.js'
import { authApi } from '../../../lib/auth-api.js'
import { formatApiError } from '../../../lib/errors.js'
import "./security.css";

const REMOVE_BTN_STYLE: React.CSSProperties = {
  border: '1px solid #ef4444',
  color: '#ef4444',
  background: 'transparent',
}

function maskEmail(email?: string) {
  if (!email || !email.includes('@')) return email ?? ''
  const [u, d] = email.split('@')
  if (u.length <= 2) return `${u[0]}***@${d}`
  return `${u[0]}***${u.slice(-1)}@${d}`
}

interface StatusPillProps {
  enabled: boolean
}

function StatusPill({ enabled }: StatusPillProps) {
  return (
    <div className={`tf-sec-page__status${enabled ? ' is-on' : ''}`}>
      <div className="tf_checkfill">
        <i className="ri-check-fill"></i>
      </div>
      <span>{enabled ? 'Enabled' : 'Off'}</span>
    </div>
  )
}

export function TwoFactor() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const removePasskey = useRemovePasskey()
  const queryClient = useQueryClient()

  const [isLogin2StepOpen, setIsLogin2StepOpen] = useState(false)
  const [isWithdrawSettingsOpen, setIsWithdrawSettingsOpen] = useState(false)

  // Login 2-Step: which method is being verified to toggle
  type L2svMethod = 'ga' | 'email' | 'phone'
  const [verifyingMethod, setVerifyingMethod] = useState<L2svMethod | null>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current) }, [])

  const startCooldown = () => {
    setResendCountdown(60)
    countdownRef.current = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(countdownRef.current!); countdownRef.current = null; return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const sendL2svOtpMutation = useMutation({
    mutationFn: (method: 'email' | 'phone') => {
      const identifier = method === 'phone'
        ? (user?.phone ?? '')
        : (user?.email ?? '')
      return authApi.sendOtp({ identifier, type: 'LOGIN' })
    },
    onSuccess: (_data, method) => {
      toast.success(method === 'email' ? 'Email code sent.' : 'Phone code sent.')
      startCooldown()
    },
    onError: (error) => toast.error(formatApiError(error, 'Failed to send code.')),
  })

  const toggleMfaMutation = useMutation({
    mutationFn: () => {
      const target = verifyingMethod === 'ga' ? 'google' : verifyingMethod === 'phone' ? 'mobile' : 'email'
      return authApi.toggleMfa({ target, otp: verifyCode })
    },
    onSuccess: () => {
      toast.success('MFA setting updated.')
      setVerifyingMethod(null)
      setVerifyCode('')
      setResendCountdown(0)
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
    onError: (error) => toast.error(formatApiError(error, 'Failed to update MFA setting.')),
  })

  const openL2svVerify = (method: L2svMethod) => {
    setVerifyingMethod(method)
    setVerifyCode('')
    setResendCountdown(0)
    if (method === 'email' || method === 'phone') sendL2svOtpMutation.mutate(method)
  }

  const cancelL2svVerify = () => {
    setVerifyingMethod(null)
    setVerifyCode('')
    setResendCountdown(0)
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null }
  }

  // ── Remove GA modal ────────────────────────────────────────────────────────
  const [isRemoveGaOpen, setIsRemoveGaOpen] = useState(false)
  const [removeEmailOtp, setRemoveEmailOtp] = useState('')
  const [removeTotpCode, setRemoveTotpCode] = useState('')
  const [removeResendCountdown, setRemoveResendCountdown] = useState(0)
  const removeCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => () => { if (removeCountdownRef.current) clearInterval(removeCountdownRef.current) }, [])

  const startRemoveCooldown = () => {
    setRemoveResendCountdown(60)
    removeCountdownRef.current = setInterval(() => {
      setRemoveResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(removeCountdownRef.current!); removeCountdownRef.current = null; return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const sendRemoveOtpMutation = useMutation({
    mutationFn: () => authApi.sendOtp({ identifier: user?.email ?? user?.phone ?? '', type: 'BIND' }),
    onSuccess: () => { toast.success('Verification code sent to your email.'); startRemoveCooldown() },
    onError: (error) => toast.error(formatApiError(error, 'Failed to send code.')),
  })

  const removeGaMutation = useMutation({
    mutationFn: () =>
      authApi.bindMfa({
        target: 'google',
        identifier: user?.email ?? user?.phone ?? '',
        otp: removeEmailOtp,
        totp: removeTotpCode,
      }),
    onSuccess: () => {
      toast.success('Google Authenticator removed.')
      setIsRemoveGaOpen(false)
      setRemoveEmailOtp('')
      setRemoveTotpCode('')
      setRemoveResendCountdown(0)
      if (removeCountdownRef.current) { clearInterval(removeCountdownRef.current); removeCountdownRef.current = null }
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
    onError: (error) => toast.error(formatApiError(error, 'Failed to remove Google Authenticator.')),
  })

  const openRemoveGa = () => {
    setIsRemoveGaOpen(true)
    setRemoveEmailOtp('')
    setRemoveTotpCode('')
    setRemoveResendCountdown(0)
    sendRemoveOtpMutation.mutate()
  }

  const closeRemoveGa = () => {
    setIsRemoveGaOpen(false)
    setRemoveEmailOtp('')
    setRemoveTotpCode('')
    setRemoveResendCountdown(0)
    if (removeCountdownRef.current) { clearInterval(removeCountdownRef.current); removeCountdownRef.current = null }
  }

  const [withdrawSettings, setWithdrawSettings] = useState({
    smsVerification: false,
    fundPassword: false,
    emailVerification: false,
    trustedAddresses: false,
  })
  const [withdrawAddressMode, setWithdrawAddressMode] =
    useState<'addressBook' | 'verificationFree'>('addressBook')

  // Prefer the nested `security` object on /me; fall back to the older
  // top-level flags so the UI keeps working against both backend shapes.
  const security = user?.security
  const isPasskeyEnabled = Boolean(
    security?.isPasskeyEnabled ?? user?.isPasskeyEnabled,
  )
  const isGoogleAuthEnabled = Boolean(
    security?.googleAuthenticatorEnabled ??
      security?.isGoogleAuthenticatorEnabled ??
      user?.isGoogleAuthenticatorEnabled ??
      user?.googleAuthenticatorEnabled,
  )
  const isEmailVerified = Boolean(
    security?.emailVerification ?? user?.isEmailVerified,
  )
  const isPhoneVerified = Boolean(
    security?.mobileVerification ?? user?.isPhoneVerified,
  )

  // isBind flags: whether the user has actually set up (bound) each method.
  // When false, the method isn't configured yet — show "Bind Now" instead of a toggle.
  const isBind = security?.isBind
  const isGaBound = Boolean(isBind?.googleAuthenticator)
  const isSmsBound = Boolean(isBind?.mobileVerification)
  const isEmailBound = Boolean(isBind?.emailVerification)
  const isPasskeyBound = Boolean(isBind?.passkey)

  const go = (path: string) => navigate(path)
  const maskedEmail = maskEmail(user?.email)

  return (
    <>
      <div className="dashboard_right">
        <div className="tf-sec-page">
          <div className="tf-sec-page__hero">
            <div className="tf-sec-page__hero-content">
              <h1 className="tf-sec-page__hero-title">Security Settings</h1>
              <p className="tf-sec-page__hero-description">
                Take full control of your account security with advanced verification options like passkeys, email OTP, and mobile
                authentication for a safer experience.
              </p>
            </div>
            <div className="tf-sec-page__hero-media">
              <img src="/images/security/417923014-aaa37ef0-270c-49ed-99d0-02b7e5924263-1.svg" alt="" />
            </div>
          </div>

          <section className="tf-sec-page__card">
            <div className="tf-sec-page__card-header">
              <h2 className="tf-sec-page__card-title">Two-Factor Authentication (2FA)</h2>
              <p className="tf-sec-page__card-subtitle">
                Choose Passkeys, Verification Code, or Trading Password to ensure the safety of your assets
              </p>
            </div>
            <div className="tf-sec-page__card-body">
              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container4.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Passkeys</span>
                      <span className="tf-sec-page__badge">Recommended</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Enables secure, passwordless authentication using device-based credentials. Provides faster logins and stronger
                      protection against phishing and unauthorized access.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <StatusPill enabled={isPasskeyBound} />
                </div>
                <div className="tf-sec-page__row-actions">
                  {isPasskeyBound ? (
                    <button
                      type="button"
                      className="tf-sec-page__btn"
                      style={REMOVE_BTN_STYLE}
                      disabled={removePasskey.isPending}
                      onClick={() => removePasskey.mutate()}
                    >
                      {removePasskey.isPending ? 'Removing…' : 'Remove'}
                    </button>
                  ) : (
                    <button type="button" className="tf-sec-page__btn" onClick={() => navigate('/user_profile/security/passkey')}>
                      Turn on
                    </button>
                  )}
                </div>
              </div>

              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container8.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Google Authenticator</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Generates time-based one-time codes for secure login verification. Adds an extra layer of protection beyond
                      passwords to prevent unauthorized access.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <StatusPill enabled={isGaBound} />
                </div>
                <div className="tf-sec-page__row-actions">
                  {isGaBound ? (
                    <button
                      type="button"
                      className="tf-sec-page__btn"
                      style={REMOVE_BTN_STYLE}
                      onClick={openRemoveGa}
                    >
                      Remove
                    </button>
                  ) : (
                    <button type="button" className="tf-sec-page__btn" onClick={() => navigate('/user_profile/security/google-authenticator')}>
                      Turn on
                    </button>
                  )}
                </div>
              </div>

              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container6.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Phone Verification</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Securely verifies user identity using SMS-based OTP. Ensures safe logins and protects sensitive actions with an
                      added layer of security.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <StatusPill enabled={isSmsBound} />
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/smsVerification')}>
                    {isSmsBound ? 'Change' : 'Turn on'}
                  </button>
                </div>
              </div>

              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container9.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Email Verification</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Securely verifies user identity via email confirmation, adding an extra layer of protection.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  {isEmailBound && maskedEmail ? (
                    <span className="tf-sec-page__status-email">{maskedEmail}</span>
                  ) : (
                    <StatusPill enabled={isEmailBound} />
                  )}
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/emailVerification')}>
                    {isEmailBound ? 'Change' : 'Turn on'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="tf-sec-page__card">
            <div className="tf-sec-page__card-header">
              <h2 className="tf-sec-page__card-title">Advanced Security</h2>
            </div>
            <div className="tf-sec-page__card-body">
              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container14.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Login 2-Step Verification</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Adds a second verification step for secure login. Protects accounts even if the password is compromised.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <div className="tf-sec-page__status">
                    <div className="email_verify">
                      <img src="/images/emailicon2.svg" alt="" />
                    </div>
                    <div className="tf_checkfill">
                      <i className="ri-check-fill"></i>
                    </div>
                    <span>Off</span>
                  </div>
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => setIsLogin2StepOpen(true)}>
                    Turn on
                  </button>
                </div>
              </div>

              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container13.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Anti-Phishing Code</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Adds a personal code to verify authentic messages. Helps users identify and avoid phishing attempts.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <StatusPill enabled={Boolean(user?.antiPhishingCode || user?.hasAntiPhishingCode)} />
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/antiPhishing')}>
                    {(user?.antiPhishingCode || user?.hasAntiPhishingCode) ? 'Turn off' : 'Turn on'}
                  </button>
                </div>
              </div>

              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container3.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Withdrawal Settings</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Manages withdrawal options and security controls. Ensures safe and authorized fund transfers.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <div className="tf-sec-page__status">
                    <div className="email_verify">
                      <img src="/images/emailicon2.svg" alt="" />
                    </div>
                    <div className="tf_checkfill">
                      <i className="ri-check-fill"></i>
                    </div>
                    <span>Off</span>
                  </div>
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => setIsWithdrawSettingsOpen(true)}>
                    Change
                  </button>
                </div>
              </div>

              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container10.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Emergency Contact</span>
                    </div>
                    <p className="tf-sec-page__row-description">Adds a trusted contact for account recovery. Helps in case of emergencies.</p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <StatusPill enabled={false} />
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/emergencyContact')}>
                    Turn on
                  </button>
                </div>
              </div>

              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container5.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Account Connections</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Manages linked accounts and services. Helps control access and maintain security.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <StatusPill enabled={false} />
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/accountConnections')}>
                    Turn on
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="tf-sec-page__card">
            <div className="tf-sec-page__card-header">
              <h2 className="tf-sec-page__card-title">Password Management</h2>
            </div>
            <div className="tf-sec-page__card-body">
              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container1.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Password</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Protects account access with secure authentication. Helps prevent unauthorized logins.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <StatusPill enabled />
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/changeLoginPassword')}>
                    Change
                  </button>
                </div>
              </div>

              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container11.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Fund Password</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Adds an extra password layer for transactions and withdrawals. Ensures stronger protection for funds against
                      unauthorized actions.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <StatusPill enabled={Boolean(user?.isFundPasswordSet)} />
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/setFundPassword')}>
                    {user?.isFundPasswordSet ? 'Change' : 'Setup'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="tf-sec-page__card">
            <div className="tf-sec-page__card-header">
              <h2 className="tf-sec-page__card-title">Devices &amp; activity</h2>
            </div>
            <div className="tf-sec-page__card-body">
              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container12.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Authorized Devices</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Manages and recognizes trusted devices for secure account access. Helps prevent unauthorized logins by allowing
                      access only from approved devices.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <StatusPill enabled={false} />
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/authorizedDevices')}>
                    Change
                  </button>
                </div>
              </div>

              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Security Logs</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Tracks and records account activity, including logins and security actions. Helps monitor suspicious behavior and
                      maintain account safety.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <StatusPill enabled={false} />
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/securityLogs')}>
                    Setup
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="tf-sec-page__card">
            <div className="tf-sec-page__card-header">
              <h2 className="tf-sec-page__card-title">Account Management</h2>
            </div>
            <div className="tf-sec-page__card-body">
              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container15.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Disable Account</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Allows users to temporarily deactivate their account for added security. Prevents access and protects data until
                      the account is re-enabled.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <StatusPill enabled={false} />
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/disableAccount')}>
                    Disable
                  </button>
                </div>
              </div>

              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Close Account</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Permanently deletes the user account and associated data. Ensures complete removal of access and disables all
                      related services.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <StatusPill enabled={false} />
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/closeAccount')}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="tf-sec-page__card">
            <div className="tf-sec-page__card-header">
              <h2 className="tf-sec-page__card-title">Other Settings</h2>
            </div>
            <div className="tf-sec-page__card-body">
              <div className="tf-sec-page__row">
                <div className="tf-sec-page__row-main">
                  <div className="tf-sec-page__row-icon-wrap">
                    <img className="tf-sec-page__row-icon" src="/images/security/Container2.svg" alt="" />
                  </div>
                  <div className="tf-sec-page__row-body">
                    <div className="tf-sec-page__row-heading-line">
                      <span className="tf-sec-page__row-heading">Third Party Account Access Management</span>
                    </div>
                    <p className="tf-sec-page__row-description">
                      Controls and manages access granted to external apps and services. Helps protect account data by allowing users to
                      review and revoke permissions anytime.
                    </p>
                  </div>
                </div>
                <div className="tf-sec-page__row-meta">
                  <span className="tf-sec-page__google-badge">
                    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                      <path
                        fill="#FFC107"
                        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                      />
                      <path
                        fill="#FF3D00"
                        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="tf-sec-page__row-actions">
                  <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/thirdPartyAccess')}>
                    Change
                  </button>
                </div>
              </div>
            </div>
          </section>

          {isRemoveGaOpen ? (
            <div className="tf-sec-page__l2sv-overlay" role="presentation">
              <div className="tf-sec-page__l2sv-modal" role="dialog" aria-modal="true" aria-labelledby="tf-remove-ga-title">
                <button
                  type="button"
                  className="tf-sec-page__l2sv-close"
                  aria-label="Close"
                  onClick={closeRemoveGa}
                >
                  ×
                </button>

                <h2 id="tf-remove-ga-title" className="tf-sec-page__l2sv-title">
                  Remove Google Authenticator
                </h2>
                <p className="tf-sec-page__l2sv-subtitle">
                  Please verify your identity to remove Google Authenticator.
                </p>

                <div className="tf-sec-page__l2sv-verifybox">
                  <p className="tf-sec-page__l2sv-verifybox-label">Email Verification Code</p>
                  <div className="tf-sec-page__l2sv-verifybox-row">
                    <input
                      className="tf-sec-page__l2sv-verifybox-input"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter email code"
                      value={removeEmailOtp}
                      onChange={(e) => setRemoveEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                    <button
                      type="button"
                      className="tf-sec-page__l2sv-verifybox-resend"
                      disabled={sendRemoveOtpMutation.isPending || removeResendCountdown > 0}
                      onClick={() => sendRemoveOtpMutation.mutate()}
                    >
                      {sendRemoveOtpMutation.isPending ? 'Sending…' : removeResendCountdown > 0 ? `${removeResendCountdown}s` : 'Resend'}
                    </button>
                  </div>

                  <p className="tf-sec-page__l2sv-verifybox-label" style={{ marginTop: '1rem' }}>
                    Google Authenticator Code
                  </p>
                  <div className="tf-sec-page__l2sv-verifybox-row">
                    <input
                      className="tf-sec-page__l2sv-verifybox-input"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter TOTP code"
                      value={removeTotpCode}
                      onChange={(e) => setRemoveTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </div>

                  <div className="tf-sec-page__l2sv-verifybox-actions">
                    <button type="button" className="tf-sec-page__l2sv-verifybox-cancel" onClick={closeRemoveGa}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="tf-sec-page__l2sv-verifybox-confirm"
                      style={REMOVE_BTN_STYLE}
                      disabled={removeEmailOtp.length < 6 || removeTotpCode.length < 6 || removeGaMutation.isPending}
                      onClick={() => removeGaMutation.mutate()}
                    >
                      {removeGaMutation.isPending ? 'Removing…' : 'Confirm Remove'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {isLogin2StepOpen ? (
            <div className="tf-sec-page__l2sv-overlay" role="presentation">
              <div className="tf-sec-page__l2sv-modal" role="dialog" aria-modal="true" aria-labelledby="tf-l2sv-title">
                <button
                  type="button"
                  className="tf-sec-page__l2sv-close"
                  aria-label="Close"
                  onClick={() => setIsLogin2StepOpen(false)}
                >
                  ×
                </button>

                <h2 id="tf-l2sv-title" className="tf-sec-page__l2sv-title">
                  Login 2-Step Verification
                </h2>
                <p className="tf-sec-page__l2sv-subtitle">
                  Once enabled, these methods will be used to verify your identity when you log in.
                </p>

                {!verifyingMethod ? (
                  <div className="tf-sec-page__l2sv-list" role="list">
                    <div className="tf-sec-page__l2sv-item" role="listitem">
                      <div className="tf-sec-page__l2sv-left">
                        <span className="tf-sec-page__l2sv-icon" aria-hidden="true">
                          <img src="/images/security/verification_icon.svg" alt="" />
                        </span>
                        <span className="tf-sec-page__l2sv-text">Google Authenticator</span>
                      </div>
                      {!isGaBound ? (
                        <button
                          type="button"
                          className="tf-sec-page__l2sv-bind-btn"
                          onClick={() => { setIsLogin2StepOpen(false); navigate('/user_profile/security/google-authenticator') }}
                        >
                          Bind Now
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`tf-sec-page__l2sv-switch ${isGoogleAuthEnabled ? 'is-on' : ''}`}
                          role="switch"
                          aria-checked={isGoogleAuthEnabled}
                          onClick={() => openL2svVerify('ga')}
                        >
                          <span className="tf-sec-page__l2sv-knob" aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <div className="tf-sec-page__l2sv-item" role="listitem">
                      <div className="tf-sec-page__l2sv-left">
                        <span className="tf-sec-page__l2sv-icon" aria-hidden="true">
                          <img src="/images/security/verification_icontwo.svg" alt="" />
                        </span>
                        <span className="tf-sec-page__l2sv-text">SMS verification</span>
                      </div>
                      {!isSmsBound ? (
                        <button
                          type="button"
                          className="tf-sec-page__l2sv-bind-btn"
                          onClick={() => { setIsLogin2StepOpen(false); navigate('/user_profile/security/smsVerification') }}
                        >
                          Bind Now
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`tf-sec-page__l2sv-switch ${isPhoneVerified ? 'is-on' : ''}`}
                          role="switch"
                          aria-checked={isPhoneVerified}
                          onClick={() => openL2svVerify('phone')}
                        >
                          <span className="tf-sec-page__l2sv-knob" aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <div className="tf-sec-page__l2sv-item" role="listitem">
                      <div className="tf-sec-page__l2sv-left">
                        <span className="tf-sec-page__l2sv-icon" aria-hidden="true">
                          <img src="/images/security/verification_icon3.svg" alt="" />
                        </span>
                        <span className="tf-sec-page__l2sv-text">Email verification</span>
                      </div>
                      {!isEmailBound ? (
                        <button
                          type="button"
                          className="tf-sec-page__l2sv-bind-btn"
                          onClick={() => { setIsLogin2StepOpen(false); navigate('/user_profile/security/emailVerification') }}
                        >
                          Bind Now
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`tf-sec-page__l2sv-switch ${isEmailVerified ? 'is-on' : ''}`}
                          role="switch"
                          aria-checked={isEmailVerified}
                          onClick={() => openL2svVerify('email')}
                        >
                          <span className="tf-sec-page__l2sv-knob" aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <div className="tf-sec-page__l2sv-item" role="listitem">
                      <div className="tf-sec-page__l2sv-left">
                        <span className="tf-sec-page__l2sv-icon" aria-hidden="true">
                          <img src="/images/security/verification_icon4.svg" alt="" />
                        </span>
                        <span className="tf-sec-page__l2sv-text">Passkey</span>
                      </div>
                      {!isPasskeyBound ? (
                        <button
                          type="button"
                          className="tf-sec-page__l2sv-bind-btn"
                          onClick={() => { setIsLogin2StepOpen(false); navigate('/user_profile/security/passkey') }}
                        >
                          Bind Now
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`tf-sec-page__l2sv-switch ${isPasskeyEnabled ? 'is-on' : ''}`}
                          role="switch"
                          aria-checked={isPasskeyEnabled}
                          disabled
                        >
                          <span className="tf-sec-page__l2sv-knob" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="tf-sec-page__l2sv-verifybox">
                    <p className="tf-sec-page__l2sv-verifybox-label">
                      {verifyingMethod === 'ga' && 'Enter your Google Authenticator code'}
                      {verifyingMethod === 'email' && 'Enter the code sent to your email'}
                      {verifyingMethod === 'phone' && 'Enter the code sent to your phone'}
                    </p>
                    <div className="tf-sec-page__l2sv-verifybox-row">
                      <input
                        className="tf-sec-page__l2sv-verifybox-input"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={verifyCode}
                        autoFocus
                        onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      />
                      {(verifyingMethod === 'email' || verifyingMethod === 'phone') && (
                        <button
                          type="button"
                          className="tf-sec-page__l2sv-verifybox-resend"
                          disabled={sendL2svOtpMutation.isPending || resendCountdown > 0}
                          onClick={() => sendL2svOtpMutation.mutate(verifyingMethod)}
                        >
                          {resendCountdown > 0 ? `${resendCountdown}s` : 'Resend'}
                        </button>
                      )}
                    </div>
                    <div className="tf-sec-page__l2sv-verifybox-actions">
                      <button type="button" className="tf-sec-page__l2sv-verifybox-cancel" onClick={cancelL2svVerify}>
                        ← Back
                      </button>
                      <button
                        type="button"
                        className="tf-sec-page__l2sv-verifybox-confirm"
                        disabled={verifyCode.length < 6 || toggleMfaMutation.isPending}
                        onClick={() => toggleMfaMutation.mutate()}
                      >
                        {toggleMfaMutation.isPending ? 'Verifying…' : 'Confirm'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {isWithdrawSettingsOpen ? (
            <div className="tf-sec-page__wds-overlay" role="presentation">
              <div className="tf-sec-page__wds-modal" role="dialog" aria-modal="true" aria-labelledby="tf-wds-title">
                <button
                  type="button"
                  className="tf-sec-page__wds-close"
                  aria-label="Close"
                  onClick={() => setIsWithdrawSettingsOpen(false)}
                >
                  ×
                </button>

                <h2 id="tf-wds-title" className="tf-sec-page__wds-title">
                  Withdrawal Settings
                </h2>
                <p className="tf-sec-page__wds-subtitle">Manage security verification for asset withdrawals.</p>

                <div className="tf-sec-page__wds-list" role="list">
                  <div className="tf-sec-page__wds-item" role="listitem">
                    <div className="tf-sec-page__wds-left">
                      <span className="tf-sec-page__wds-icon" aria-hidden="true">
                        <img src="/images/security/setting_icon.svg" alt="" />
                      </span>
                      <span className="tf-sec-page__wds-text">SMS verification</span>
                    </div>
                    <button
                      type="button"
                      className={`tf-sec-page__wds-switch ${withdrawSettings.smsVerification ? 'is-on' : ''}`}
                      role="switch"
                      aria-checked={withdrawSettings.smsVerification}
                      onClick={() => setWithdrawSettings((s) => ({ ...s, smsVerification: !s.smsVerification }))}
                    >
                      <span className="tf-sec-page__wds-knob" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="tf-sec-page__wds-item" role="listitem">
                    <div className="tf-sec-page__wds-left">
                      <span className="tf-sec-page__wds-icon" aria-hidden="true">
                        <img src="/images/security/setting_icon2.svg" alt="" />
                      </span>
                      <span className="tf-sec-page__wds-text">Fund Password</span>
                    </div>
                    <button
                      type="button"
                      className={`tf-sec-page__wds-switch ${withdrawSettings.fundPassword ? 'is-on' : ''}`}
                      role="switch"
                      aria-checked={withdrawSettings.fundPassword}
                      onClick={() => setWithdrawSettings((s) => ({ ...s, fundPassword: !s.fundPassword }))}
                    >
                      <span className="tf-sec-page__wds-knob" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="tf-sec-page__wds-item" role="listitem">
                    <div className="tf-sec-page__wds-left">
                      <span className="tf-sec-page__wds-icon" aria-hidden="true">
                        <img src="/images/security/setting_icon3.svg" alt="" />
                      </span>
                      <span className="tf-sec-page__wds-text">Email verification</span>
                    </div>
                    <button
                      type="button"
                      className={`tf-sec-page__wds-switch ${withdrawSettings.emailVerification ? 'is-on' : ''}`}
                      role="switch"
                      aria-checked={withdrawSettings.emailVerification}
                      onClick={() => setWithdrawSettings((s) => ({ ...s, emailVerification: !s.emailVerification }))}
                    >
                      <span className="tf-sec-page__wds-knob" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="tf-sec-page__wds-item" role="listitem">
                    <div className="tf-sec-page__wds-left">
                      <span className="tf-sec-page__wds-icon" aria-hidden="true">
                        <img src="/images/security/setting_icon4.svg" alt="" />
                      </span>
                      <span className="tf-sec-page__wds-text">Withdraw Only to Trusted Addresses</span>
                    </div>
                    <button
                      type="button"
                      className={`tf-sec-page__wds-switch ${withdrawSettings.trustedAddresses ? 'is-on' : ''}`}
                      role="switch"
                      aria-checked={withdrawSettings.trustedAddresses}
                      onClick={() => setWithdrawSettings((s) => ({ ...s, trustedAddresses: !s.trustedAddresses }))}
                    >
                      <span className="tf-sec-page__wds-knob" aria-hidden="true" />
                    </button>
                  </div>

                  <button type="button" className="tf-sec-page__wds-item tf-sec-page__wds-item--link">
                    <div className="tf-sec-page__wds-left">
                      <span className="tf-sec-page__wds-icon" aria-hidden="true">
                        <img src="/images/security/Icon.svg" alt="" />
                      </span>
                      <span className="tf-sec-page__wds-text">API Withdrawal Settings</span>
                    </div>
                    <span className="tf-sec-page__wds-right">
                      <span className="tf-sec-page__wds-muted">More options</span>
                      <span className="tf-sec-page__wds-chev" aria-hidden="true">
                        ›
                      </span>
                    </span>
                  </button>
                </div>

                <div className="tf-sec-page__wds-radioGroup" role="radiogroup" aria-label="Withdrawal address options">
                  <button
                    type="button"
                    className={`tf-sec-page__wds-radioRow ${withdrawAddressMode === 'addressBook' ? 'is-selected' : ''}`}
                    onClick={() => setWithdrawAddressMode('addressBook')}
                  >
                    <span className="tf-sec-page__wds-radio" aria-hidden="true" />
                    <span className="tf-sec-page__wds-radioText">To Address Book Addresses Only</span>
                  </button>
                  <button
                    type="button"
                    className={`tf-sec-page__wds-radioRow ${withdrawAddressMode === 'verificationFree' ? 'is-selected' : ''}`}
                    onClick={() => setWithdrawAddressMode('verificationFree')}
                  >
                    <span className="tf-sec-page__wds-radio" aria-hidden="true" />
                    <span className="tf-sec-page__wds-radioText">Verification-free addresses only</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

    </>
  )
}
