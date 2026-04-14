import { Modal } from '@agce/ui'

interface KycSubmitModalProps {
  isOpen: boolean
  onClose: () => void
}

export function KycSubmitModal({ isOpen, onClose }: KycSubmitModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      modalClassName=""
      contentClassName="kyc_modal"
      showHeader={false}
    >
      <div className="text-center">
        <div className="mb-4">
          <div className="success_icon_wrapper mb-3">
            <img src="/images/verifing_vector.png" alt="Verifying" />
          </div>
          <h4 className="mb-3">Verifying</h4>
          <p className="text-muted mb-2">
            Hang tight, your review will be completed within the next 48 hours.
          </p>
          <p className="text-muted mb-2">
            Continue exploring Exchange while you wait. We&apos;ll notify you
            once verification is complete.
          </p>
        </div>
        <div className="d-flex gap-3 justify-content-center mt-4">
          <button
            type="button"
            className="primary_btn"
            style={{ width: 'auto', padding: '10px 30px' }}
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  )
}
