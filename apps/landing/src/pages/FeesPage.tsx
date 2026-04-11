import { SectionHeader } from '../components/shared/SectionHeader.js'
import { VIPTierTable } from '../components/fees/VIPTierTable.js'
import { useInstanceConfig } from '@agce/hooks'

export function FeesPage() {
  const config = useInstanceConfig()

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Fee Schedule"
        title="Transparent, competitive fees"
        description="Maker/taker fees decrease automatically as your 30-day trading volume grows. VIP 4 accounts receive custom negotiated rates."
      />

      <div className="mt-12">
        <VIPTierTable />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { title: 'Native token discount', desc: `Hold or stake the platform token to receive a configurable fee reduction on ${config.name}.` },
          { title: 'Referral rebates', desc: `Earn ${config.fees.referralSplitPercent}% of your referred users' trading fees, credited to your account daily.` },
          { title: 'Withdrawal fees', desc: 'Per-asset, per-network flat fee. Updated by admin without deployment. Visible in the withdrawal flow.' },
        ].map(({ title, desc }) => (
          <div
            key={title}
            className="rounded-xl border p-5"
            style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
          >
            <h3 className="mb-2 font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{title}</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
