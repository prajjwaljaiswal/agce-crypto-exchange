import { Modal } from '@agce/ui'

interface PasswordChangeModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchVerification?: () => void
}

export function PasswordChangeModal({
  isOpen,
  onClose,
  onSwitchVerification,
}: PasswordChangeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      title="Enter Email Verification Code"
      subtitle="We'll send a verification code to dem***@example.com"
    >
      <form className="profile_form">
        <div className="emailinput">
          <label>Enter 6-digit Code</label>
          <div className="d-flex">
            <input
              type="text"
              placeholder="Enter code here..."
              maxLength={6}
              defaultValue=""
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
          <label>New Password</label>
          <div className="d-flex">
            <input
              type="password"
              placeholder="Enter new password"
              autoComplete="new-password"
              defaultValue=""
            />
            <div className="password-eye-btn">
              <i className="ri-eye-close-line" />
            </div>
          </div>
        </div>
        <div className="error_text">
          <span>8-30 characters</span>
          <span>At least one uppercase, lowercase, and number.</span>
          <span>Does not contain any spaces.</span>
        </div>
        <div className="emailinput">
          <label>Confirm Password</label>
          <div className="d-flex">
            <input
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              defaultValue=""
            />
            <div className="password-eye-btn">
              <i className="ri-eye-close-line" />
            </div>
          </div>
        </div>

        <button type="button" className="submit" onClick={onClose}>
          Submit
        </button>
      </form>
    </Modal>
  )
}
