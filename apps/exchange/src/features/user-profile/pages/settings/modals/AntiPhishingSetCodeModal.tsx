import { Modal } from '@agce/ui'

interface AntiPhishingSetCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchVerification?: () => void
}

export function AntiPhishingSetCodeModal({
  isOpen,
  onClose,
  onSwitchVerification,
}: AntiPhishingSetCodeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      title={
        <>
          <i className="ri-shield-keyhole-line anti-phishing-icon-spaced" />
          Set the Code
        </>
      }
      subtitle="We'll send a verification code to de***o@example.com"
    >
      <div className="anti-phishing-info-content anti-phishing-info-block">
        <section className="anti-phishing-warning-section">
          <div className="anti-phishing-warning-box">
            <p className="anti-phishing-warning-text">
              <i className="ri-error-warning-line anti-phishing-warning-icon" />
              Please do not reveal your password or Google/SMS verification code
              to anyone, including our exchange Customer Service.
            </p>
          </div>
        </section>
        <section className="anti-phishing-section anti-phishing-section-no-margin">
          <h6 className="anti-phishing-heading anti-phishing-heading-tight">
            <i className="ri-lock-line anti-phishing-icon-spaced" />
            Enable Anti-Phishing Code
          </h6>
          <p className="anti-phishing-paragraph">
            Please enter 5 to 8 digits. Do not use commonly used passwords.
          </p>
        </section>
      </div>
      <form className="profile_form">
        <div className="emailinput">
          <label>Anti-phishing Code (5-8 digits)</label>
          <input type="text" placeholder="Enter your code" maxLength={8} defaultValue="" />
        </div>
        <div className="emailinput">
          <label>Verification Code</label>
          <div className="d-flex">
            <input
              type="text"
              placeholder="Enter 6-digit code"
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
        <div>
          <p className="small anti-phishing-muted-text">
            We&apos;ll send a verification code to de***o@example.com
          </p>
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
        </div>
        <button type="button" className="submit" onClick={onClose}>
          <i className="ri-check-line anti-phishing-icon-tight" />
          Submit
        </button>
      </form>
    </Modal>
  )
}
