import type { ReactNode } from 'react'

interface SecurityCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function SecurityCard({ title, subtitle, children }: SecurityCardProps) {
  return (
    <section className="tf-sec-page__card">
      <div className="tf-sec-page__card-header">
        <h2 className="tf-sec-page__card-title">{title}</h2>
        {subtitle ? <p className="tf-sec-page__card-subtitle">{subtitle}</p> : null}
      </div>
      <div className="tf-sec-page__card-body">{children}</div>
    </section>
  )
}
