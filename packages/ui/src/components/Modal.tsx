import { useEffect, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  subtitle?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  staticBackdrop?: boolean
  modalClassName?: string
  dialogClassName?: string
  contentClassName?: string
  ariaLabel?: string
  showHeader?: boolean
  children: ReactNode
}

const sizeClass: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'modal-sm',
  md: '',
  lg: 'modal-lg',
}

/**
 * React-state-driven modal that reuses Bootstrap 5 CSS classes so existing
 * styles keep applying, but does not rely on Bootstrap's JavaScript.
 * Supports Escape-to-close and backdrop-click-to-close unless `staticBackdrop`.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  staticBackdrop,
  modalClassName = 'search_form',
  dialogClassName = '',
  contentClassName = '',
  ariaLabel,
  showHeader = true,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen || staticBackdrop) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, staticBackdrop, onClose])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('modal-open')
    return () => {
      document.body.style.overflow = prev
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    if (staticBackdrop) return
    onClose()
  }

  const content = (
    <>
      <div
        className={`modal fade show ${modalClassName}`.trim()}
        tabIndex={-1}
        role="dialog"
        aria-label={ariaLabel}
        aria-modal="true"
        onClick={handleBackdrop}
        style={{ display: 'block' }}
      >
        <div
          className={`modal-dialog modal-dialog-centered ${sizeClass[size]} ${dialogClassName}`.trim()}
        >
          <div className={`modal-content ${contentClassName}`.trim()}>
            {showHeader && (title || subtitle) && (
              <div className="modal-header">
                {title && <h5 className="modal-title">{title}</h5>}
                {subtitle && <p>{subtitle}</p>}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onClose}
                />
              </div>
            )}
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  )

  return createPortal(content, document.body)
}
