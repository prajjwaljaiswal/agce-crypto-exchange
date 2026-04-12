import { ChevronRight } from 'lucide-react'

interface LegalSection {
  heading: string
  body: string
}

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

export function LegalLayout({ title, lastUpdated, intro, sections }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div
        className="py-12 px-6"
        style={{
          background: 'linear-gradient(135deg, #0d0d0d 0%, #161210 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm mb-4">
            <span>Home</span>
            <ChevronRight size={14} />
            <span>Legal</span>
            <ChevronRight size={14} />
            <span className="text-[var(--color-primary)]">{title}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 py-12">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 lg:p-12 space-y-8">
          {/* Intro */}
          <p className="text-[var(--color-text-muted)] leading-relaxed text-base">{intro}</p>

          {/* Sections */}
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-3">
                {i + 1}. {section.heading}
              </h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">{section.body}</p>
            </section>
          ))}

          {/* Footer note */}
          <div className="border-t border-[var(--color-border)] pt-6">
            <p className="text-sm text-[var(--color-text-muted)]">
              If you have any questions regarding this document, please contact our legal team at{' '}
              <a href="mailto:legal@agce.com" className="text-[var(--color-primary)] hover:underline">
                legal@agce.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
