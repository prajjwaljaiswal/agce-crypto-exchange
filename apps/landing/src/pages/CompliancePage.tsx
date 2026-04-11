import { SectionHeader } from '../components/shared/SectionHeader.js'
import { FeatureGate } from '../components/shared/FeatureGate.js'
import { useInstanceConfig } from '@agce/hooks'
import { Badge } from '@agce/ui'

export function CompliancePage() {
  const config = useInstanceConfig()

  const kycTiers = [
    { level: 'Level 1', requirements: 'Email + phone verification', limits: 'Limited trading, no fiat withdrawals' },
    { level: 'Level 2', requirements: `${config.kyc.documents.join(' + ')} + selfie`, limits: 'Full trading access' },
    { level: 'Level 3', requirements: 'Enhanced due diligence', limits: 'VIP / institutional access, higher limits' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Compliance"
        title={`${config.name} — Regulatory framework`}
        description={`${config.name} operates under the oversight of ${config.compliance.regulator} with full AML, KYC, and transaction monitoring in place.`}
      />

      {/* Regulator badge */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Badge variant="info">Regulator: {config.compliance.regulator}</Badge>
        <Badge variant="default">AML: {config.compliance.amlFramework}</Badge>
        <Badge variant="default">Travel Rule: {config.compliance.travelRuleProvider.toUpperCase()}</Badge>
        {config.kyc.requireVKYC && <Badge variant="warning">VKYC required for fiat access</Badge>}
      </div>

      {/* KYC tiers */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--color-text)' }}>KYC Tiers — powered by Didit</h2>
        <div className="space-y-3">
          {kycTiers.map(({ level, requirements, limits }) => (
            <div
              key={level}
              className="flex flex-col gap-1 rounded-xl border p-5 sm:flex-row sm:items-center sm:gap-6"
              style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
            >
              <div className="w-20 flex-shrink-0">
                <span className="rounded-md px-2 py-1 text-xs font-semibold" style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-text)' }}>
                  {level}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{requirements}</p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>{limits}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* India-specific tax section */}
      <FeatureGate flag="inrWallet">
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold" style={{ color: 'var(--color-text)' }}>India — Tax compliance</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'TDS deduction', desc: 'Automatic 1% TDS on crypto sale proceeds per Section 194S of the Income Tax Act.' },
              { title: 'TDS certificates', desc: 'Form 16A equivalent generated for each user at year end.' },
              { title: 'GST invoicing', desc: '18% GST on trading fees — automated per-transaction GST invoice.' },
              { title: 'Capital gains report', desc: 'Per-user FIFO and AVCO cost basis reports. CSV and PDF export.' },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-xl border p-4"
                style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
              >
                <h3 className="mb-1 font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{title}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FeatureGate>

      {/* AML */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold" style={{ color: 'var(--color-text)' }}>AML & Transaction monitoring</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          Rule-based monitoring engine with velocity rules, structuring detection, and unusual pattern alerts. Risk-based customer scoring updated dynamically. STR/CTR workflows for regulatory filing. All users re-screened weekly against updated sanctions lists.
        </p>
      </div>
    </div>
  )
}
