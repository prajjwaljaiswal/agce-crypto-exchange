import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../../../../providers/AuthProvider.js'
import { useOtpCountdown } from '../../../hooks/useOtpCountdown.js'
import { authApi } from '../../../../../lib/auth-api.js'
import { formatApiError } from '../../../../../lib/errors.js'

interface RemoveGoogleAuthModalProps {
  onClose: () => void
}

const REMOVE_BTN_STYLE: React.CSSProperties = {
  border: '1px solid #ef4444',
  color: '#ef4444',
  background: 'transparent',
}

// Mounted only while the "Remove Google Authenticator" flow is active. The
// parent gates this via `{isOpen && <RemoveGoogleAuthModal … />}` so local
// state and the auto-send OTP effect reset on every open.
export function RemoveGoogleAuthModal({ onClose }: RemoveGoogleAuthModalProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const identifier = user?.email ?? user?.phone ?? ''

  const [emailOtp, setEmailOtp] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const { countdown, start: startCooldown } = useOtpCountdown()

  const sendOtpMutation = useMutation({
    mutationFn: () => authApi.sendOtp({ identifier, type: 'BIND' }),
    onSuccess: () => {
      toast.success('Verification code sent to your email.')
      startCooldown()
    },
    onError: (error) => toast.error(formatApiError(error, 'Failed to send code.')),
  })

  const removeMutation = useMutation({
    mutationFn: () =>
      authApi.bindMfa({
        target: 'google',
        identifier,
        otp: emailOtp,
        totp: totpCode,
      }),
    onSuccess: () => {
      toast.success('Google Authenticator removed.')
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      onClose()
    },
    onError: (error) => toast.error(formatApiError(error, 'Failed to remove Google Authenticator.')),
  })

  useEffect(() => {
    sendOtpMutation.mutate()
    // Fire-and-forget — mutate is stable, identifier only changes if the user
    // actually switches, which unmounts the modal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canConfirm = emailOtp.length >= 6 && totpCode.length >= 6 && !removeMutation.isPending

  return (
    <div className="tf-sec-page__l2sv-overlay" role="presentation">
      <div className="tf-sec-page__l2sv-modal" role="dialog" aria-modal="true" aria-labelledby="tf-remove-ga-title">
        <button
          type="button"
          className="tf-sec-page__l2sv-close"
          aria-label="Close"
          onClick={onClose}
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
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            <button
              type="button"
              className="tf-sec-page__l2sv-verifybox-resend"
              disabled={sendOtpMutation.isPending || countdown > 0}
              onClick={() => sendOtpMutation.mutate()}
            >
              {sendOtpMutation.isPending ? 'Sending…' : countdown > 0 ? `${countdown}s` : 'Resend'}
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
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </div>

          <div className="tf-sec-page__l2sv-verifybox-actions">
            <button type="button" className="tf-sec-page__l2sv-verifybox-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="tf-sec-page__l2sv-verifybox-confirm"
              style={REMOVE_BTN_STYLE}
              disabled={!canConfirm}
              onClick={() => removeMutation.mutate()}
            >
              {removeMutation.isPending ? 'Removing…' : 'Confirm Remove'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
