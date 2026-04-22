import type { ReactNode } from 'react'
import { StatusPill } from './StatusPill.js'

interface SecurityRowProps {
  icon: string
  title: string
  description: string
  badge?: string
  // Renders to the right of the description. Defaults to an "Off" StatusPill
  // so callers only override when the row has dynamic status.
  meta?: ReactNode
  action: ReactNode
}

export function SecurityRow({ icon, title, description, badge, meta, action }: SecurityRowProps) {
  return (
    <div className="tf-sec-page__row">
      <div className="tf-sec-page__row-main">
        <div className="tf-sec-page__row-icon-wrap">
          <img className="tf-sec-page__row-icon" src={icon} alt="" />
        </div>
        <div className="tf-sec-page__row-body">
          <div className="tf-sec-page__row-heading-line">
            <span className="tf-sec-page__row-heading">{title}</span>
            {badge ? <span className="tf-sec-page__badge">{badge}</span> : null}
          </div>
          <p className="tf-sec-page__row-description">{description}</p>
        </div>
      </div>
      <div className="tf-sec-page__row-meta">{meta ?? <StatusPill enabled={false} />}</div>
      <div className="tf-sec-page__row-actions">{action}</div>
    </div>
  )
}
