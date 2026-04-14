import { Modal, VerificationOptionRow } from '@agce/ui'

interface VerificationOption {
  icon: string
  title: string
  description: string
}

interface VerificationOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  options: VerificationOption[]
  onSelect?: (option: VerificationOption) => void
}

export function VerificationOptionsModal({
  isOpen,
  onClose,
  title = 'Select a Verification Option',
  subtitle = 'Choose how you want to verify your identity',
  options,
  onSelect,
}: VerificationOptionsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      title={
        <>
          <i className="ri-fingerprint-2-line anti-phishing-icon-spaced" />
          {title}
        </>
      }
      subtitle={subtitle}
    >
      <form className="profile_form">
        {options.map((opt) => (
          <VerificationOptionRow
            key={opt.title}
            icon={opt.icon}
            title={opt.title}
            description={opt.description}
            onClick={() => {
              onSelect?.(opt)
              onClose()
            }}
          />
        ))}
      </form>
    </Modal>
  )
}
