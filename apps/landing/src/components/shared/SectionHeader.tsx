interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
}

export function SectionHeader({ eyebrow, title, description, centered = true }: SectionHeaderProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      {eyebrow && (
        <p
          className="mb-3 text-sm font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-primary)' }}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--color-text)' }}>
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)', margin: centered ? '1rem auto 0' : '1rem 0 0' }}>
          {description}
        </p>
      )}
    </div>
  )
}
