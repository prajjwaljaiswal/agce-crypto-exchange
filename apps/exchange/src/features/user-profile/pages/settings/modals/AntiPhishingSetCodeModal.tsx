import { useEffect, useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal } from '@agce/ui'
import { authApi } from '../../../../../lib/auth-api.js'
import { formatApiError } from '../../../../../lib/errors.js'
import { useAuth } from '../../../../../providers/AuthProvider.js'

interface AntiPhishingSetCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchVerification?: () => void
}

const RESEND_COOLDOWN_SECONDS = 60

function maskIdentifier(identifier?: string): string {
  if (!identifier) return 'your registered email'
  const [local, domain] = identifier.split('@')
  if (!domain) return identifier
  const head = local.slice(0, 3)
  return `${head}***@${domain}`
}

function maskCode(code: string): string {
  if (!code) return ''
  if (code.length <= 2) return '••'
  return `${code[0]}${'•'.repeat(Math.max(2, code.length - 2))}${code[code.length - 1]}`
}

export function AntiPhishingSetCodeModal({
  isOpen,
  onClose,
  onSwitchVerification,
}: AntiPhishingSetCodeModalProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const identifier = user?.email ?? user?.identifier
  const masked = maskIdentifier(identifier)

  const existingCode = user?.antiPhishingCode ?? ''
  const hasCode = Boolean(user?.hasAntiPhishingCode || existingCode)

  const [code, setCode] = useState('')
  const [otp, setOtp] = useState('')
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    if (!isOpen) return
    setCode('')
    setOtp('')
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
      return authApi.sendOtp({ identifier, type: 'ANTI_PHISHING' })
    },
    onSuccess: () => {
      toast.success(`Verification code sent to ${masked}.`)
      setResendIn(RESEND_COOLDOWN_SECONDS)
    },
    onError: (error) => toast.error(formatApiError(error, 'Could not send OTP.')),
  })

  const setCodeMutation = useMutation({
    mutationFn: () => authApi.setAntiPhishingCode({ code, otp }),
    onSuccess: () => {
      toast.success(hasCode ? 'Anti-phishing code updated' : 'Anti-phishing code set')
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      onClose()
    },
    onError: (error) =>
      toast.error(formatApiError(error, 'Could not save anti-phishing code.')),
  })

  const removeCodeMutation = useMutation({
    mutationFn: () => authApi.removeAntiPhishingCode({ code: existingCode, otp }),
    onSuccess: () => {
      toast.success('Anti-phishing code removed')
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      onClose()
    },
    onError: (error) =>
      toast.error(formatApiError(error, 'Could not remove anti-phishing code.')),
  })

  const codeValid = code.length >= 5 && code.length <= 8 && /^[A-Za-z0-9]+$/.test(code)
  const otpValid = otp.length === 6
  const anyPending =
    setCodeMutation.isPending || removeCodeMutation.isPending
  const canSubmit = codeValid && otpValid && !anyPending
  const canRemove =
    hasCode && otpValid && existingCode.length > 0 && !anyPending

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    setCodeMutation.mutate()
  }

  const otpButtonLabel = sendOtpMutation.isPending
    ? 'Sending…'
    : resendIn > 0
      ? `Resend in ${resendIn}s`
      : 'GET OTP'
  const otpButtonDisabled =
    sendOtpMutation.isPending || resendIn > 0 || !identifier

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
            className="ri-shield-keyhole-line"
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
            {hasCode ? 'Update Anti-Phishing Code' : 'Set the Code'}
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 999,
                color: hasCode ? '#22c55e' : 'var(--color-primary, #D1AA67)',
                background: hasCode
                  ? 'rgba(34, 197, 94, 0.15)'
                  : 'color-mix(in srgb, var(--color-primary, #D1AA67) 18%, transparent)',
                border: `1px solid ${
                  hasCode
                    ? 'rgba(34, 197, 94, 0.35)'
                    : 'color-mix(in srgb, var(--color-primary, #D1AA67) 35%, transparent)'
                }`,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              {hasCode ? 'Active' : 'Verify'}
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
        {/* Current-code banner — only when already set */}
        {hasCode && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 10,
              background:
                'color-mix(in srgb, var(--color-primary, #D1AA67) 10%, transparent)',
              border:
                '1px solid color-mix(in srgb, var(--color-primary, #D1AA67) 28%, transparent)',
            }}
          >
            <i
              className="ri-shield-check-fill"
              style={{
                fontSize: 18,
                color: 'var(--color-primary, #D1AA67)',
                flex: '0 0 auto',
                lineHeight: 1,
              }}
            />
            <div style={{ flex: '1 1 auto', minWidth: 0 }}>
              <p
                className="anti-phishing-heading"
                style={{
                  margin: 0,
                  fontSize: 12.5,
                  fontWeight: 600,
                }}
              >
                Your anti-phishing code is active
              </p>
              {existingCode && (
                <p
                  className="anti-phishing-paragraph"
                  style={{
                    margin: '2px 0 0',
                    fontSize: 12,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    letterSpacing: 1,
                  }}
                >
                  Current: {maskCode(existingCode)}
                </p>
              )}
            </div>
          </div>
        )}

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
            Please do not reveal your password or Google/SMS verification code
            to anyone, including our exchange Customer Service.
          </p>
        </div>

        {/* Info block */}
        <section
          style={{
            display: 'flex',
            gap: 12,
            padding: '14px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            aria-hidden
            style={{
              flex: '0 0 auto',
              width: 34,
              height: 34,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'color-mix(in srgb, var(--color-primary, #D1AA67) 14%, transparent)',
              border:
                '1px solid color-mix(in srgb, var(--color-primary, #D1AA67) 28%, transparent)',
              color: 'var(--color-primary, #D1AA67)',
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            <i className="ri-lock-line" />
          </div>
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <h6
              className="anti-phishing-heading"
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1.35,
              }}
            >
              {hasCode ? 'Update your code' : 'Enable Anti-Phishing Code'}
            </h6>
            <p
              className="anti-phishing-paragraph"
              style={{
                margin: '6px 0 0',
                fontSize: 12.5,
                lineHeight: 1.55,
              }}
            >
              Please enter 5 to 8 characters. Use letters and numbers; avoid
              commonly used passwords.
            </p>
          </div>
        </section>

        {/* Form */}
        <form
          className="profile_form"
          onSubmit={handleFormSubmit}
          style={{ marginTop: 4 }}
        >
          <div className="emailinput">
            <label htmlFor="anti-phishing-code">
              {hasCode ? 'New' : 'Anti-phishing'} Code (5-8 characters)
            </label>
            <input
              id="anti-phishing-code"
              type="text"
              placeholder="Enter your code"
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^A-Za-z0-9]/g, ''))}
              disabled={anyPending}
              autoComplete="off"
            />
          </div>

          <div className="emailinput">
            <label htmlFor="anti-phishing-otp">Verification Code</label>
            <div className="d-flex">
              <input
                id="anti-phishing-otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={anyPending}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p
              className="anti-phishing-header-subtitle"
              style={{ margin: 0, fontSize: 12 }}
            >
              We&apos;ll send a verification code to {masked}
            </p>
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
          </div>
        </form>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px 24px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <button
          type="button"
          onClick={() => setCodeMutation.mutate()}
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
          {setCodeMutation.isPending ? (
            <>Saving…</>
          ) : (
            <>
              <i className="ri-check-line" />
              {hasCode ? 'Update Code' : 'Set Code'}
            </>
          )}
        </button>

        {hasCode && (
          <button
            type="button"
            onClick={() => {
              if (!canRemove) return
              removeCodeMutation.mutate()
            }}
            disabled={!canRemove}
            title={
              !existingCode
                ? 'Your current anti-phishing code is unavailable — refresh and try again'
                : !otpValid
                  ? 'Enter the 6-digit verification code to remove'
                  : undefined
            }
            style={{
              width: '100%',
              backgroundColor: canRemove
                ? 'rgba(239, 68, 68, 0.12)'
                : 'rgba(239, 68, 68, 0.06)',
              color: canRemove ? '#ef4444' : 'rgba(239, 68, 68, 0.5)',
              fontWeight: 600,
              fontSize: 14,
              padding: '10px 20px',
              border: `1px solid ${
                canRemove ? 'rgba(239, 68, 68, 0.45)' : 'rgba(239, 68, 68, 0.2)'
              }`,
              borderRadius: 50,
              cursor: canRemove ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (canRemove)
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.22)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = canRemove
                ? 'rgba(239, 68, 68, 0.12)'
                : 'rgba(239, 68, 68, 0.06)'
            }}
          >
            {removeCodeMutation.isPending ? (
              <>Removing…</>
            ) : (
              <>
                <i className="ri-delete-bin-line" />
                Remove Code
              </>
            )}
          </button>
        )}
      </div>
    </Modal>
  )
}
