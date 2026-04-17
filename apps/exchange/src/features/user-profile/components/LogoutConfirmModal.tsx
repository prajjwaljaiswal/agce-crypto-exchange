import { useEffect } from 'react'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function LogoutConfirmModal({ open, onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="logout-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      onClick={onCancel}
    >
      <div
        className="logout-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="logout-modal-icon" aria-hidden>
          <i className="ri-logout-circle-r-line" />
        </div>
        <h3 id="logout-modal-title" className="logout-modal-title">
          Log out of AGCE?
        </h3>
        <p className="logout-modal-desc">
          You&apos;ll need to sign in again to access your account.
        </p>
        <div className="logout-modal-actions">
          <button
            type="button"
            className="logout-modal-btn logout-modal-btn--ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="logout-modal-btn logout-modal-btn--danger"
            onClick={onConfirm}
            autoFocus
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}