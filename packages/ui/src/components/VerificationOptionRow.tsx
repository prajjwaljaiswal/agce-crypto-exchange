import type { MouseEventHandler } from 'react'

interface VerificationOptionRowProps {
  icon: string
  title: string
  description: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function VerificationOptionRow({
  icon,
  title,
  description,
  onClick,
}: VerificationOptionRowProps) {
  return (
    <div>
      <div
        className="d-flex align-items-center justify-content-between text-white"
        role="button"
        onClick={onClick}
      >
        <div className="d-flex align-items-center">
          <i className={`${icon} me-3`} />
          <div>
            <strong>{title}</strong>
            <p className="mb-0 small">{description}</p>
          </div>
        </div>
        <i className="ri-arrow-right-s-line" />
      </div>
    </div>
  )
}
