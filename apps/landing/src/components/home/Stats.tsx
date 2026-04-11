const stats = [
  { label: 'Trading pairs', value: '300+' },
  { label: 'Uptime SLA', value: '99.9%' },
  { label: 'Supported chains', value: '10+' },
  { label: 'Order types', value: '7' },
]

export function Stats() {
  return (
    <section
      className="border-y py-12"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <dt className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{label}</dt>
              <dd className="mt-1 text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
