import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../../../../providers/AuthProvider.js'
import { useOtpCountdown } from '../../../hooks/useOtpCountdown.js'
import * as sec from '../../../lib/security-selectors.js'
import { authApi } from '../../../../../lib/auth-api.js'
import { formatApiError } from '../../../../../lib/errors.js'

interface Login2StepModalProps {
  onClose: () => void
}

type L2svMethod = 'ga' | 'email' | 'phone'

interface MethodOption {
  id: 'ga' | 'phone' | 'email' | 'passkey'
  icon: string
  label: string
  route: string
  bound: boolean
  // `enabled` is only meaningful when `bound` is true; otherwise we show
  // "Bind Now" and skip the toggle entirely.
  enabled: boolean
  // Passkey's toggle is disabled in the UI even when bound — backend doesn't
  // support toggling it via this flow yet.
  toggleDisabled?: boolean
  // Which verify target maps to this row ('ga' | 'email' | 'phone'). Passkey
  // has none — its switch is read-only.
  verifyMethod?: L2svMethod
}

export function Login2StepModal({ onClose }: Login2StepModalProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [verifyingMethod, setVerifyingMethod] = useState<L2svMethod | null>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const { countdown, start: startCooldown, reset: resetCountdown } = useOtpCountdown()

  const sendOtpMutation = useMutation({
    mutationFn: (method: 'email' | 'phone') => {
      const identifier = method === 'phone' ? (user?.phone ?? '') : (user?.email ?? '')
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
      resetCountdown()
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
    onError: (error) => toast.error(formatApiError(error, 'Failed to update MFA setting.')),
  })

  const openVerify = (method: L2svMethod) => {
    setVerifyingMethod(method)
    setVerifyCode('')
    resetCountdown()
    if (method === 'email' || method === 'phone') sendOtpMutation.mutate(method)
  }

  const cancelVerify = () => {
    setVerifyingMethod(null)
    setVerifyCode('')
    resetCountdown()
  }

  const bindThenClose = (route: string) => {
    onClose()
    navigate(route)
  }

  const methods: MethodOption[] = [
    {
      id: 'ga',
      icon: '/images/security/verification_icon.svg',
      label: 'Google Authenticator',
      route: '/user_profile/security/google-authenticator',
      bound: sec.isGaBound(user),
      enabled: sec.isGoogleAuthEnabled(user),
      verifyMethod: 'ga',
    },
    {
      id: 'phone',
      icon: '/images/security/verification_icontwo.svg',
      label: 'SMS verification',
      route: '/user_profile/security/smsVerification',
      bound: sec.isSmsBound(user),
      enabled: sec.isPhoneVerified(user),
      verifyMethod: 'phone',
    },
    {
      id: 'email',
      icon: '/images/security/verification_icon3.svg',
      label: 'Email verification',
      route: '/user_profile/security/emailVerification',
      bound: sec.isEmailBound(user),
      enabled: sec.isEmailVerified(user),
      verifyMethod: 'email',
    },
    {
      id: 'passkey',
      icon: '/images/security/verification_icon4.svg',
      label: 'Passkey',
      route: '/user_profile/security/passkey',
      bound: sec.isPasskeyBound(user),
      enabled: sec.isPasskeyEnabled(user),
      toggleDisabled: true,
    },
  ]

  const verifyPrompt =
    verifyingMethod === 'ga'
      ? 'Enter your Google Authenticator code'
      : verifyingMethod === 'email'
        ? 'Enter the code sent to your email'
        : 'Enter the code sent to your phone'

  return (
    <div className="tf-sec-page__l2sv-overlay" role="presentation">
      <div className="tf-sec-page__l2sv-modal" role="dialog" aria-modal="true" aria-labelledby="tf-l2sv-title">
        <button type="button" className="tf-sec-page__l2sv-close" aria-label="Close" onClick={onClose}>
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
            {methods.map((m) => (
              <div key={m.id} className="tf-sec-page__l2sv-item" role="listitem">
                <div className="tf-sec-page__l2sv-left">
                  <span className="tf-sec-page__l2sv-icon" aria-hidden="true">
                    <img src={m.icon} alt="" />
                  </span>
                  <span className="tf-sec-page__l2sv-text">{m.label}</span>
                </div>
                {!m.bound ? (
                  <button
                    type="button"
                    className="tf-sec-page__l2sv-bind-btn"
                    onClick={() => bindThenClose(m.route)}
                  >
                    Bind Now
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`tf-sec-page__l2sv-switch ${m.enabled ? 'is-on' : ''}`}
                    role="switch"
                    aria-checked={m.enabled}
                    disabled={m.toggleDisabled}
                    onClick={() => m.verifyMethod && openVerify(m.verifyMethod)}
                  >
                    <span className="tf-sec-page__l2sv-knob" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="tf-sec-page__l2sv-verifybox">
            <p className="tf-sec-page__l2sv-verifybox-label">{verifyPrompt}</p>
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
                  disabled={sendOtpMutation.isPending || countdown > 0}
                  onClick={() => sendOtpMutation.mutate(verifyingMethod)}
                >
                  {countdown > 0 ? `${countdown}s` : 'Resend'}
                </button>
              )}
            </div>
            <div className="tf-sec-page__l2sv-verifybox-actions">
              <button type="button" className="tf-sec-page__l2sv-verifybox-cancel" onClick={cancelVerify}>
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
  )
}
