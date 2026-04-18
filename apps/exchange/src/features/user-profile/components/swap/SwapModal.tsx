import type { ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  id: string
  className?: string
  children: ReactNode
}

export function SwapModal({ open, onClose, id, className = '', children }: Props) {
  return (
    <div
      className={`modal fade ${className} ${open ? 'show' : ''}`}
      id={id}
      tabIndex={-1}
      aria-hidden={!open}
      style={{ display: open ? 'block' : 'none' }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  )
}
