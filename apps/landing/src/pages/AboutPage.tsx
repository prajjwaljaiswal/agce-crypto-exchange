import { SectionHeader } from '../components/shared/SectionHeader.js'
import { useInstanceConfig } from '@agce/hooks'
import { CTA } from '../components/home/CTA.js'

const instances = [
  { id: 'india', name: 'AGCE India', regulator: 'FIU-IND / SEBI', domain: 'in.arabglobal.exchange' },
  { id: 'abudhabi', name: 'AGCE Abu Dhabi', regulator: 'CMA (ADGM)', domain: 'abudhabi.arabglobal.exchange' },
  { id: 'dubai', name: 'AGCE Dubai', regulator: 'VARA', domain: 'dubai.arabglobal.exchange' },
  { id: 'global', name: 'AGCE Global', regulator: 'Best-practice baseline', domain: 'global.arabglobal.exchange' },
]

export function AboutPage() {
  const config = useInstanceConfig()

  return (
    <div>
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="About AGCE"
          title="The Arab Global Crypto Exchange"
          description="Developed by Arab Global Virtual Assets Services LLC SPC — a multi-jurisdiction exchange built for the next generation of crypto traders and institutions."
          centered={false}
        />

        <div className="mt-8 space-y-4 text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
          <p>
            AGCE is a full-featured crypto exchange ecosystem serving retail and institutional clients across four distinct regulatory perimeters. Each instance operates as a legally and technically isolated deployment — sharing a common high-performance core while enforcing hard jurisdiction-specific guardrails.
          </p>
          <p>
            The platform is built on a Shared Core / Isolated Instance architecture: one versioned codebase, four independent deployments. This means compliance, data residency, KYC requirements, and product availability are all jurisdiction-specific — while users benefit from the same matching engine, liquidity infrastructure, and security standards across all instances.
          </p>
        </div>

        {/* Instances */}
        <div className="mt-14">
          <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--color-text)' }}>Our exchange instances</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {instances.map(({ id, name, regulator, domain }) => (
              <a
                key={id}
                href={`https://${domain}`}
                className="group rounded-xl border p-5 transition-colors hover:border-[var(--color-primary)]"
                style={{
                  backgroundColor: id === config.id ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
                  borderColor: id === config.id ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{name}</h3>
                  {id === config.id && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${config.theme.primaryColor}20`, color: 'var(--color-primary)' }}>
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{regulator}</p>
                <p className="mt-1 text-xs font-mono" style={{ color: 'var(--color-text-subtle)' }}>{domain}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      <CTA />
    </div>
  )
}
