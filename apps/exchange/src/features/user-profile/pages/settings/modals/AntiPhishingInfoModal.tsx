import { Modal } from '@agce/ui'

interface AntiPhishingInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onGetStarted: () => void
}

export function AntiPhishingInfoModal({
  isOpen,
  onClose,
  onGetStarted,
}: AntiPhishingInfoModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      title={
        <>
          <i className="ri-shield-check-line anti-phishing-icon-spaced" />
          Anti-Phishing Code
        </>
      }
    >
      <form className="profile_form">
        <div className="anti-phishing-info-content">
          <section className="anti-phishing-section">
            <h6 className="anti-phishing-heading">
              <i className="ri-information-line anti-phishing-icon-spaced" />
              What is an anti-phishing code?
            </h6>
            <p className="anti-phishing-paragraph">
              An anti-phishing code is a personalised identifier that enhances
              your account security. Once successfully set, you will see this
              code in all official emails sent to you by our exchange. It helps
              you verify whether an email is genuine and protects you from
              scams.
            </p>
          </section>
          <section className="anti-phishing-section">
            <h6 className="anti-phishing-heading">
              <i className="ri-mail-check-line anti-phishing-icon-spaced" />
              How to Identify Phishing Emails Effectively?
            </h6>
            <p className="anti-phishing-paragraph">
              You can create a custom anti-phishing code unique to you. This
              code will appear in all emails sent to you by our exchange. If you
              receive an email without your anti-phishing code, or the displayed
              code is different from the one you set, be cautious, as the email
              may be a phishing attempt impersonating our exchange.
            </p>
          </section>
          <section className="anti-phishing-section anti-phishing-section-last">
            <h6 className="anti-phishing-heading">
              <i className="ri-alert-line anti-phishing-icon-spaced" />
              Reminder:
            </h6>
            <p className="anti-phishing-paragraph">
              After successfully setting your code, all official emails sent to
              your secure email address by our exchange will include this
              security identifier. Always compare the anti-phishing code in the
              email with the one you set to verify its authenticity. The
              anti-phishing code is a personal security identifier. Keep it safe
              and never share it with anyone, including our exchange staff.
            </p>
          </section>
        </div>
        <button type="button" className="submit" onClick={onGetStarted}>
          <i className="ri-arrow-right-line anti-phishing-icon-tight" />
          Get Started
        </button>
      </form>
    </Modal>
  )
}
