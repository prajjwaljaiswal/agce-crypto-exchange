import { ChevronRight, Info } from 'lucide-react'

const spotFees = [
  { tier: 'Regular', maker: '0.10%', taker: '0.10%', volume: '< $10,000' },
  { tier: 'VIP 1', maker: '0.09%', taker: '0.10%', volume: '$10,000+' },
  { tier: 'VIP 2', maker: '0.08%', taker: '0.09%', volume: '$50,000+' },
  { tier: 'VIP 3', maker: '0.07%', taker: '0.08%', volume: '$200,000+' },
  { tier: 'VIP 4', maker: '0.05%', taker: '0.07%', volume: '$500,000+' },
]

const futuresFees = [
  { tier: 'Regular', maker: '0.02%', taker: '0.04%', volume: '< $10,000' },
  { tier: 'VIP 1', maker: '0.02%', taker: '0.03%', volume: '$10,000+' },
  { tier: 'VIP 2', maker: '0.01%', taker: '0.03%', volume: '$50,000+' },
  { tier: 'VIP 3', maker: '0.01%', taker: '0.02%', volume: '$200,000+' },
  { tier: 'VIP 4', maker: '0.00%', taker: '0.02%', volume: '$500,000+' },
]

const depositFees = [
  { asset: 'BTC', network: 'Bitcoin', deposit: 'Free', withdrawal: '0.0005 BTC', minWithdraw: '0.001 BTC' },
  { asset: 'ETH', network: 'Ethereum (ERC-20)', deposit: 'Free', withdrawal: '0.005 ETH', minWithdraw: '0.01 ETH' },
  { asset: 'USDT', network: 'Tron (TRC-20)', deposit: 'Free', withdrawal: '1 USDT', minWithdraw: '10 USDT' },
  { asset: 'USDT', network: 'Ethereum (ERC-20)', deposit: 'Free', withdrawal: '5 USDT', minWithdraw: '20 USDT' },
  { asset: 'BNB', network: 'BNB Chain', deposit: 'Free', withdrawal: '0.002 BNB', minWithdraw: '0.01 BNB' },
  { asset: 'SOL', network: 'Solana', deposit: 'Free', withdrawal: '0.01 SOL', minWithdraw: '0.05 SOL' },
]

const vipTiers = [
  { tier: 'Regular', badge: 'bg-gray-500', volume: '< $10K', discount: '0%', benefits: 'Standard access' },
  { tier: 'VIP 1', badge: 'bg-blue-500', volume: '$10K+', discount: '10%', benefits: 'Priority support' },
  { tier: 'VIP 2', badge: 'bg-purple-500', volume: '$50K+', discount: '20%', benefits: 'Priority support + API boost' },
  { tier: 'VIP 3', badge: 'bg-yellow-500', volume: '$200K+', discount: '30%', benefits: 'Dedicated account manager' },
  { tier: 'VIP 4', badge: 'bg-[#D1AA67]', volume: '$500K+', discount: '50%', benefits: 'Full VIP suite' },
]

function FeeTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            {headers.map((h) => (
              <th key={h} className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-5 py-4 ${j === 0 ? 'font-semibold text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function FeesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div
        className="py-14 px-6"
        style={{
          background: 'linear-gradient(135deg, #0d0d0d 0%, #161210 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm mb-4">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="text-[var(--color-primary)]">Fees</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Fee Schedule</h1>
          <p className="text-[var(--color-text-muted)] text-lg max-w-[540px]">
            Transparent, competitive fees across all trading products. Higher volume earns lower rates.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-12">
        {/* Notice */}
        <div className="flex items-start gap-3 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 px-5 py-4 text-sm text-[var(--color-text-muted)]">
          <Info size={16} className="text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
          <p>
            Fees are calculated based on your 30-day rolling trading volume. Holding AGCE tokens may entitle you to additional fee discounts. All fees are subject to change with prior notice.
          </p>
        </div>

        {/* Spot fees */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Spot Trading Fees</h2>
          <FeeTable
            headers={['Tier', 'Maker Fee', 'Taker Fee', '30-Day Volume']}
            rows={spotFees.map((r) => [r.tier, r.maker, r.taker, r.volume])}
          />
        </section>

        {/* Futures fees */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Futures Trading Fees</h2>
          <FeeTable
            headers={['Tier', 'Maker Fee', 'Taker Fee', '30-Day Volume']}
            rows={futuresFees.map((r) => [r.tier, r.maker, r.taker, r.volume])}
          />
        </section>

        {/* Deposit / withdrawal fees */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Deposit &amp; Withdrawal Fees</h2>
          <FeeTable
            headers={['Asset', 'Network', 'Deposit', 'Withdrawal Fee', 'Min. Withdrawal']}
            rows={depositFees.map((r) => [r.asset, r.network, r.deposit, r.withdrawal, r.minWithdraw])}
          />
        </section>

        {/* VIP tiers */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">VIP Tier Levels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {vipTiers.map((t) => (
              <div
                key={t.tier}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-3"
              >
                <div className={`self-start text-xs font-bold px-2.5 py-1 rounded-full text-white ${t.badge}`}>
                  {t.tier}
                </div>
                <div>
                  <p className="text-[var(--color-text-muted)] text-xs mb-0.5">30-Day Volume</p>
                  <p className="font-semibold text-[var(--color-text)]">{t.volume}</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-muted)] text-xs mb-0.5">Fee Discount</p>
                  <p className="text-[var(--color-primary)] font-bold text-lg">{t.discount}</p>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">{t.benefits}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
