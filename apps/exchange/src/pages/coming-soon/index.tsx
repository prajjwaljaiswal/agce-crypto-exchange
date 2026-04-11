import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'

export function ComingSoonPage() {
  return (
    <div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(209,170,103,0.12)' }}
        >
          <Clock size={36} style={{ color: 'var(--color-primary)' }} />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Coming Soon
        </h1>

        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--color-text-muted)' }}>
          We are working hard to bring you something amazing. This page is under construction — check back soon.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#0d0d0d',
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
