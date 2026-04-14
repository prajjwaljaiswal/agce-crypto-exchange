import { Modal } from '@agce/ui'

interface KycVerificationCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onBack?: () => void
  onSwitchVerification?: () => void
  onSubmit?: () => void
}

export function KycVerificationCodeModal({
  isOpen,
  onClose,
  onBack,
  onSwitchVerification,
  onSubmit,
}: KycVerificationCodeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      title="Enter Email Verification Code"
      subtitle="We'll send a verification code to dem***@example.com"
    >
      <div className="verify_authenticator_form">
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
            className="submit"
            onClick={() => {
              onSubmit?.()
              onClose()
            }}
          >
            Verify & Submit KYC
          </button>
          <button
            type="button"
            className="cursor-pointer btn btn-link p-0"
            onClick={onSwitchVerification}
          >
            <small className="text-white">
              Switch to Another Verification Option{' '}
              <i className="ri-external-link-line" />
            </small>
          </button>
          <div>
            <button
              type="button"
              className="primary_btn"
              style={{ width: '100%' }}
              onClick={onBack}
            >
              Back to Review
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
