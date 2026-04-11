import { ShieldCheck, Lock, Eye, Server } from 'lucide-react'
import { SectionHeader } from '../shared/SectionHeader.js'
import { useInstanceConfig } from '@agce/hooks'

export function TrustBadges() {
  const config = useInstanceConfig()

  const items = [
    {
      icon: ShieldCheck,
      title: 'Regulated',
      description: `Licensed and regulated by ${config.compliance.regulator}. Full compliance with local AML and KYC requirements.`,
    },
    {
      icon: Lock,
      title: 'Fireblocks Custody',
      description: 'Institutional-grade custody via Fireblocks. Separate workspace per exchange instance. Multi-sig for large withdrawals.',
    },
    {
      icon: Eye,
      title: 'Chainalysis KYT',
      description: 'Real-time transaction screening on all deposits and withdrawals. OFAC, UN, and EU sanctions lists enforced.',
    },
    {
      icon: Server,
      title: '99.9% Uptime SLA',
      description: 'Microservices on Kubernetes with blue-green deployments. RPO 15 min, RTO 1 hour. Multi-region failover.',
    },
  ]

  return (
    <section
      className="px-4 py-20 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Trust & Safety"
          title="Built for compliance, secured at every layer"
          description="From regulated KYC to on-chain transaction monitoring, every component meets institutional standards."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${config.theme.primaryColor}20` }}
              >
                <Icon size={22} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h3 className="mb-2 font-semibold" style={{ color: 'var(--color-text)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
