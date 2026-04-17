import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from '@agce/ui'

interface PasswordChangeModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchVerification?: () => void
  onSubmit?: (data: { otp: string; newPassword: string }) => void
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

const EYE_BTN_STYLE: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  padding: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#FFFFFF',
  fontSize: 18,
  lineHeight: 1,
}

export function PasswordChangeModal({
  isOpen,
  onClose,
  onSwitchVerification,
  onSubmit,
}: PasswordChangeModalProps) {
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setOtp('')
    setNewPassword('')
    setConfirmPassword('')
    setShowNew(false)
    setShowConfirm(false)
  }, [isOpen])

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword
  const allRulesPass = PASSWORD_RULES.every((r) => r.test(newPassword))
  const canSubmit = otp.length === 6 && allRulesPass && passwordsMatch

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit?.({ otp, newPassword })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      title="Enter Email Verification Code"
      subtitle="We'll send a verification code to dem***@example.com"
    >
      <form className="profile_form" onSubmit={handleSubmit}>
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
            />
            <button
              type="button"
              className="getotp otp-button-enabled getotp_mobile"
            >
              GET OTP
            </button>
          </div>
        </div>

        <button
          type="button"
          className="cursor-pointer btn btn-link p-0"
          onClick={onSwitchVerification}
        >
          <small className="text-white">
            Switch to Another Verification Option
            <i className="ri-external-link-line" />
          </small>
        </button>

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
        <div className="error_text">
          {PASSWORD_RULES.map((rule) => {
            const passed = newPassword.length > 0 && rule.test(newPassword)
            return (
              <span
                key={rule.id}
                style={{
                  color: newPassword.length === 0 ? undefined : passed ? '#22c55e' : '#ef4444',
                }}
              >
                {rule.label}
              </span>
            )
          })}
        </div>
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
          <div className="error_text">
            <span style={{ color: '#ef4444' }}>Passwords do not match.</span>
          </div>
        )}

        <button
          type="submit"
          className="submit p-3"
          disabled={!canSubmit}
          style={{
            backgroundColor: canSubmit ? 'var(--color-primary, #D1AA67)' : '#FFFFFF40',
            color: canSubmit ? '#000' : '#FFFFFF80',
            fontWeight: 600,
            fontSize: 15,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s ease',
          }}
        >
          Submit
        </button>
      </form>
    </Modal>
  )
}
