import { Modal } from '@agce/ui'

interface KycVerifyWarningModalProps {
  isOpen: boolean
  onContinue: () => void
  onLater: () => void
}

export function KycVerifyWarningModal({ isOpen, onContinue, onLater }: KycVerifyWarningModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onLater}
      staticBackdrop
      modalClassName="kyc_modal"
      showHeader={false}
    >
      <div className="text-center">
        <div className="mb-4">
          <div className="success_icon_wrapper mb-3">
            <img src="/images/verifing_vector.png" alt="KYC Verification" />
          </div>
          <h4 className="mb-3">Identity Verification</h4>
          <p className="mb-2">
            Please don&apos;t go back during the verification process.
          </p>
          <p className="mb-2">
            Once you start, complete all steps without interruption for the best experience.
          </p>
        </div>
        <div className="d-flex gap-3 justify-content-center mt-4">
          <button
            type="button"
            className="primary_btn"
            style={{ width: 'auto', padding: '10px 30px', marginTop: 0 }}
            onClick={onContinue}
          >
            Continue to Verification
          </button>
          <button
            type="button"
            className="primary_btn"
            style={{ width: 'auto', padding: '10px 30px', marginTop: 0, background: 'transparent', border: '1px solid #D1AA67', color: '#D1AA67' }}
            onClick={onLater}
          >
            Later
          </button>
        </div>
      </div>
    </Modal>
  )
}
