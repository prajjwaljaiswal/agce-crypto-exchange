import { useInstanceConfig } from '@agce/hooks'

function fmt(n: number) {
  if (n === 0) return 'Negotiated'
  return `${(n * 100).toFixed(2)}%`
}

function fmtVolume(n: number | null) {
  if (n === null) return '—'
  if (n >= 1_000_000) return `$${n / 1_000_000}M`
  if (n >= 1_000) return `$${n / 1_000}K`
  return `$${n}`
}

export function VIPTierTable() {
  const { fees } = useInstanceConfig()

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
            <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-muted)' }}>Tier</th>
            <th className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--color-text-muted)' }}>30d Volume</th>
            <th className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--color-text-muted)' }}>Maker</th>
            <th className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--color-text-muted)' }}>Taker</th>
            <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-muted)' }}>Benefits</th>
          </tr>
        </thead>
        <tbody>
          {fees.vipTiers.map((tier, i) => (
            <tr
              key={tier.name}
              style={{
                backgroundColor: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)',
                borderBottom: i < fees.vipTiers.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-text)' }}>
                {tier.name}
              </td>
              <td className="px-4 py-3 text-right" style={{ color: 'var(--color-text-muted)' }}>
                {tier.minVolume30d === null
                  ? `< ${fmtVolume(tier.maxVolume30d)}`
                  : tier.maxVolume30d === null
                  ? `> ${fmtVolume(tier.minVolume30d)}`
                  : `${fmtVolume(tier.minVolume30d)} – ${fmtVolume(tier.maxVolume30d)}`}
              </td>
              <td className="px-4 py-3 text-right font-mono" style={{ color: 'var(--color-green)' }}>
                {fmt(tier.makerFee)}
              </td>
              <td className="px-4 py-3 text-right font-mono" style={{ color: 'var(--color-text)' }}>
                {fmt(tier.takerFee)}
              </td>
              <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {tier.benefits.join(' · ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
