import { Modal } from '@agce/ui'
import { useInstanceConfig } from '@agce/hooks'
import { idTypeLabel } from '../idTypeLabels.js'

interface KycSelectCountryModalProps {
  isOpen: boolean
  onClose: () => void
  onNext?: () => void
}

export function KycSelectCountryModal({
  isOpen,
  onClose,
  onNext,
}: KycSelectCountryModalProps) {
  const instance = useInstanceConfig()
  const documents = instance.kyc.documents

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      modalClassName="kyc_modal"
      title="Select ID Type"
    >
      <div className="kyc_step active" data-title="Select ID Type">
        <label className="label">
          Jurisdiction: <strong>{instance.name}</strong> (
          {instance.compliance.regulator})
        </label>

        <label className="label mt-4">
          ID Type <span className="text-danger">*</span>
        </label>
        <div className="id_grid">
          {documents.map((doc, i) => (
            <label
              key={doc}
              className={`id_item${i === 0 ? ' selected' : ''}`}
            >
              <input
                type="radio"
                name="kycIdTypeStatic"
                value={doc.toUpperCase()}
                defaultChecked={i === 0}
              />
              {idTypeLabel(doc)}
            </label>
          ))}
        </div>
        <small className="text-danger d-none" id="idTypeError">
          Please select an ID type
        </small>

        <button
          type="button"
          className="primary_btn"
          onClick={() => {
            onNext?.()
            onClose()
          }}
        >
          Next
        </button>
      </div>
    </Modal>
  )
}
