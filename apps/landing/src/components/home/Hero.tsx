import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react'
import { ButtonLink } from '@agce/ui'
import { useInstanceConfig } from '@agce/hooks'

export function Hero() {
  const config = useInstanceConfig()
  const exchangeUrl = `https://${config.domain}`

  const pills = [
    { icon: ShieldCheck, label: config.compliance.regulator },
    { icon: Zap, label: 'Low-latency CLOB engine' },
    { icon: Globe, label: 'Fireblocks custody' },
  ]

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${config.theme.primaryColor}22, transparent)`,
        }}
      />

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
          style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-2)' }}>
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          Now live — {config.name}
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ color: 'var(--color-text)' }}>
          Trade Crypto with
          <span style={{ color: 'var(--color-primary)' }}> Institutional</span>{' '}
          Confidence
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {config.name} delivers a high-performance, regulated trading experience for retail and
          institutional clients — with deep liquidity, robust compliance, and Fireblocks-grade custody.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ButtonLink size="lg" href={`${exchangeUrl}/register`}>
            Start trading <ArrowRight size={16} />
          </ButtonLink>
          <ButtonLink size="lg" variant="outline" href={`${exchangeUrl}/login`}>
            Log in
          </ButtonLink>
        </div>

        {/* Trust pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {pills.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)' }}
            >
              <Icon size={14} style={{ color: 'var(--color-primary)' }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
