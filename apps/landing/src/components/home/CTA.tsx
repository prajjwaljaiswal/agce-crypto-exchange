import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@agce/ui'
import { useInstanceConfig } from '@agce/hooks'

export function CTA() {
  const config = useInstanceConfig()
  const exchangeUrl = `https://${config.domain}`

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <div
          className="rounded-2xl border p-12"
          style={{
            background: `radial-gradient(ellipse 100% 100% at 50% 100%, ${config.theme.primaryColor}18, transparent)`,
            borderColor: 'var(--color-border-strong)',
            backgroundColor: 'var(--color-surface-2)',
          }}
        >
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Ready to start trading?
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--color-text-muted)' }}>
            Create your {config.name} account in minutes. KYC powered by Didit.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ButtonLink size="lg" href={`${exchangeUrl}/register`}>
              Create free account <ArrowRight size={16} />
            </ButtonLink>
            <ButtonLink size="lg" variant="ghost" href="/features">
              Explore features
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
