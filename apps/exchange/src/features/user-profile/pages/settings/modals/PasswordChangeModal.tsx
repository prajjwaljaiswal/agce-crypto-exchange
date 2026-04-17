import { useEffect, useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal } from '@agce/ui'
import { authApi } from '../../../../../lib/auth-api.js'
import { formatApiError } from '../../../../../lib/errors.js'
import { useAuth } from '../../../../../providers/AuthProvider.js'

interface PasswordChangeModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchVerification?: () => void
}

const PASSWORD_RULES = [
  { id: 'length', label: '8-30 characters', test: (pw: string) => pw.length >= 8 && pw.length <= 30 },
  {
    id: 'complexity',
    label: 'At least one uppercase, lowercase, and number.',
    test: (pw: string) => /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw),
  },
  { id: 'no-space', label: 'Does not contain any spaces.', test: (pw: string) => !/\s/.test(pw) },
]

const RESEND_COOLDOWN_SECONDS = 60

const EYE_BTN_STYLE: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  padding: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'var(--color-primary, #D1AA67)',
  fontSize: 18,
  lineHeight: 1,
}

function maskIdentifier(identifier?: string): string {
  if (!identifier) return 'your registered email'
  const [local, domain] = identifier.split('@')
  if (!domain) return identifier
  const head = local.slice(0, 3)
  return `${head}***@${domain}`
}

export function PasswordChangeModal({
  isOpen,
  onClose,
  onSwitchVerification,
}: PasswordChangeModalProps) {
  const { user } = useAuth()
  const identifier = user?.email ?? user?.identifier
  const masked = maskIdentifier(identifier)

  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    if (!isOpen) return
    setOtp('')
    setNewPassword('')
    setConfirmPassword('')
    setShowNew(false)
    setShowConfirm(false)
    setResendIn(0)
  }, [isOpen])

  useEffect(() => {
    if (resendIn <= 0) return
    const t = window.setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(t)
  }, [resendIn])

  const sendOtpMutation = useMutation({
    mutationFn: () => {
      if (!identifier) throw new Error('No identifier on session — cannot send OTP.')
      return authApi.sendOtp({ identifier, type: 'RESET_PASSWORD' })
    },
    onSuccess: () => {
      toast.success(`Verification code sent to ${masked}.`)
      setResendIn(RESEND_COOLDOWN_SECONDS)
    },
    onError: (error) => toast.error(formatApiError(error, 'Could not send OTP.')),
  })

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      authApi.changePassword({
        otp,
        newPassword,
        confirmPassword,
      }),
    onSuccess: () => {
      toast.success('Password changed successfully')
      onClose()
    },
    onError: (error) => toast.error(formatApiError(error, 'Could not change password.')),
  })

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword
  const allRulesPass = PASSWORD_RULES.every((r) => r.test(newPassword))
  const canSubmit =
    otp.length === 6 &&
    allRulesPass &&
    passwordsMatch &&
    !changePasswordMutation.isPending

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    changePasswordMutation.mutate()
  }

  const otpButtonLabel = sendOtpMutation.isPending
    ? 'Sending…'
    : resendIn > 0
      ? `Resend in ${resendIn}s`
      : 'GET OTP'
  const otpButtonDisabled = sendOtpMutation.isPending || resendIn > 0 || !identifier

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      showHeader={false}
      contentClassName="anti-phishing-modal"
    >
      {/* Header */}
      <div
        style={{
          position: 'relative',
          padding: '26px 26px 22px',
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-primary, #D1AA67) 24%, transparent) 0%, color-mix(in srgb, var(--color-primary, #D1AA67) 6%, transparent) 100%)',
          borderBottom:
            '1px solid color-mix(in srgb, var(--color-primary, #D1AA67) 28%, transparent)',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          aria-hidden
          style={{
            flex: '0 0 auto',
            width: 52,
            height: 52,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--color-primary, #D1AA67) 55%, transparent), color-mix(in srgb, var(--color-primary, #D1AA67) 15%, transparent))',
            border:
              '1px solid color-mix(in srgb, var(--color-primary, #D1AA67) 45%, transparent)',
            boxShadow:
              '0 0 0 4px color-mix(in srgb, var(--color-primary, #D1AA67) 10%, transparent), 0 4px 16px color-mix(in srgb, var(--color-primary, #D1AA67) 30%, transparent)',
          }}
        >
          <i
            className="ri-lock-password-line"
            style={{
              fontSize: 26,
              color: 'var(--color-primary, #D1AA67)',
              lineHeight: 1,
            }}
          />
        </div>

        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <h5
            className="anti-phishing-header-title"
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 0.2,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Change Password
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 999,
                color: 'var(--color-primary, #D1AA67)',
                background:
                  'color-mix(in srgb, var(--color-primary, #D1AA67) 18%, transparent)',
                border:
                  '1px solid color-mix(in srgb, var(--color-primary, #D1AA67) 35%, transparent)',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Secure
            </span>
          </h5>
          <p
            className="anti-phishing-header-subtitle"
            style={{
              margin: '4px 0 0',
              fontSize: 12.5,
            }}
          >
            We&apos;ll send a verification code to {masked}
          </p>
        </div>

        <button
          type="button"
          aria-label="Close"
          className="anti-phishing-header-close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 30,
            height: 30,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
            transition: 'background-color 0.15s ease',
          }}
        >
          <i className="ri-close-line" style={{ fontSize: 16 }} />
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          padding: '20px 24px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Warning card */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: '12px 14px',
            borderRadius: 10,
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.28)',
          }}
        >
          <i
            className="ri-error-warning-line"
            style={{
              fontSize: 18,
              color: '#f59e0b',
              lineHeight: 1.35,
              flex: '0 0 auto',
            }}
          />
          <p
            className="anti-phishing-paragraph"
            style={{
              margin: 0,
              fontSize: 12.5,
              lineHeight: 1.55,
            }}
          >
            Never share your verification code or new password with anyone —
            not even our Customer Service. We will never ask for them.
          </p>
        </div>

        <form
          className="profile_form"
          onSubmit={handleSubmit}
          style={{ marginTop: 4 }}
        >
          {/* OTP */}
          <div className="emailinput">
            <label htmlFor="pwd-change-otp">Enter 6-digit Code</label>
            <div className="d-flex">
              <input
                id="pwd-change-otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter code here..."
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={changePasswordMutation.isPending}
              />
              <button
                type="button"
                className="getotp otp-button-enabled getotp_mobile"
                disabled={otpButtonDisabled}
                onClick={() => sendOtpMutation.mutate()}
                style={{
                  opacity: otpButtonDisabled ? 0.55 : 1,
                  cursor: otpButtonDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                {otpButtonLabel}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="cursor-pointer btn btn-link p-0"
            onClick={onSwitchVerification}
            style={{
              textAlign: 'left',
              color: 'var(--color-primary, #D1AA67)',
              textDecoration: 'none',
              fontSize: 12.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              alignSelf: 'flex-start',
            }}
          >
            Switch to Another Verification Option
            <i className="ri-external-link-line" />
          </button>

          {/* New Password */}
          <div className="emailinput">
            <label htmlFor="pwd-change-new">New Password</label>
            <div className="d-flex">
              <input
                id="pwd-change-new"
                type={showNew ? 'text' : 'password'}
                placeholder="Enter new password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={changePasswordMutation.isPending}
              />
              <button
                type="button"
                className="password-eye-btn"
                aria-label={showNew ? 'Hide password' : 'Show password'}
                aria-pressed={showNew}
                onClick={() => setShowNew((s) => !s)}
                style={EYE_BTN_STYLE}
              >
                <i className={showNew ? 'ri-eye-line' : 'ri-eye-off-line'} />
              </button>
            </div>
          </div>

          {/* Rules checklist */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              paddingLeft: 2,
            }}
          >
            {PASSWORD_RULES.map((rule) => {
              const empty = newPassword.length === 0
              const passed = !empty && rule.test(newPassword)
              const color = empty
                ? 'rgba(255,255,255,0.45)'
                : passed
                  ? '#22c55e'
                  : '#ef4444'
              const icon = empty
                ? 'ri-circle-line'
                : passed
                  ? 'ri-checkbox-circle-fill'
                  : 'ri-close-circle-fill'
              return (
                <span
                  key={rule.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color,
                    lineHeight: 1.3,
                  }}
                >
                  <i className={icon} style={{ fontSize: 13 }} />
                  {rule.label}
                </span>
              )
            })}
          </div>

          {/* Confirm Password */}
          <div className="emailinput">
            <label htmlFor="pwd-change-confirm">Confirm Password</label>
            <div className="d-flex">
              <input
                id="pwd-change-confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={changePasswordMutation.isPending}
              />
              <button
                type="button"
                className="password-eye-btn"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                aria-pressed={showConfirm}
                onClick={() => setShowConfirm((s) => !s)}
                style={EYE_BTN_STYLE}
              >
                <i className={showConfirm ? 'ri-eye-line' : 'ri-eye-off-line'} />
              </button>
            </div>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: '#ef4444',
                marginTop: -6,
              }}
            >
              <i className="ri-close-circle-fill" style={{ fontSize: 13 }} />
              Passwords do not match.
            </span>
          )}
        </form>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 24px 22px' }}>
        <button
          type="button"
          onClick={() => {
            if (canSubmit) changePasswordMutation.mutate()
          }}
          disabled={!canSubmit}
          style={{
            width: '100%',
            backgroundColor: canSubmit
              ? 'var(--color-primary, #D1AA67)'
              : 'rgba(255,255,255,0.15)',
            color: canSubmit ? '#000' : 'rgba(255,255,255,0.5)',
            fontWeight: 600,
            fontSize: 15,
            padding: '12px 20px',
            border: 'none',
            borderRadius: 50,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'filter 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (canSubmit) e.currentTarget.style.filter = 'brightness(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'none'
          }}
        >
          {changePasswordMutation.isPending ? (
            <>Saving…</>
          ) : (
            <>
              <i className="ri-check-line" />
              Change Password
            </>
          )}
        </button>
      </div>
    </Modal>
  )
}
