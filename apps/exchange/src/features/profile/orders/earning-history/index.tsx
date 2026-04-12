import { TrendingUp, CheckCircle2, Clock } from 'lucide-react'

type EarnStatus = 'Active' | 'Completed' | 'Redeeming'

interface EarningRecord {
  id: string
  date: string
  currency: string
  duration: string
  apy: number
  subscriptionAmount: number
  expectedReturn: number
  status: EarnStatus
}

const MOCK_EARNINGS: EarningRecord[] = [
  { id: 'ER-001', date: '2026-04-01', currency: 'USDT', duration: '30 days', apy: 8, subscriptionAmount: 1000, expectedReturn: 21.92, status: 'Active' },
  { id: 'ER-002', date: '2026-03-15', currency: 'BNB', duration: '60 days', apy: 10, subscriptionAmount: 5, expectedReturn: 0.082, status: 'Active' },
  { id: 'ER-003', date: '2026-03-01', currency: 'ETH', duration: '90 days', apy: 6, subscriptionAmount: 1, expectedReturn: 0.0148, status: 'Completed' },
  { id: 'ER-004', date: '2026-02-15', currency: 'USDT', duration: '7 days', apy: 5, subscriptionAmount: 500, expectedReturn: 0.48, status: 'Completed' },
  { id: 'ER-005', date: '2026-04-10', currency: 'BTC', duration: 'Flexible', apy: 4, subscriptionAmount: 0.1, expectedReturn: 0.0, status: 'Redeeming' },
  { id: 'ER-006', date: '2026-01-10', currency: 'SOL', duration: '30 days', apy: 12, subscriptionAmount: 20, expectedReturn: 0.197, status: 'Completed' },
]

const STATUS_CONFIG: Record<EarnStatus, { icon: React.ReactNode; bg: string; color: string }> = {
  Active: { icon: <TrendingUp size={11} />, bg: '#16a34a22', color: 'var(--color-green)' },
  Completed: { icon: <CheckCircle2 size={11} />, bg: '#d1aa6722', color: 'var(--color-primary)' },
  Redeeming: { icon: <Clock size={11} />, bg: '#3b82f622', color: '#3b82f6' },
}

export function EarningHistoryPage() {
  const totalActive = MOCK_EARNINGS.filter((e) => e.status === 'Active').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Earning History</h1>
        {totalActive > 0 && (
          <span
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: '#16a34a22', color: 'var(--color-green)' }}
          >
            {totalActive} Active Plans
          </span>
        )}
      </div>

      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[750px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Start Date', 'Currency', 'Duration', 'APY', 'Subscribed', 'Expected Return', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-medium text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MOCK_EARNINGS.map((e) => {
                const cfg = STATUS_CONFIG[e.status]
                return (
                  <tr key={e.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                    <td className="px-5 py-4 text-[var(--color-text-muted)]">{e.date}</td>
                    <td className="px-5 py-4 font-medium text-[var(--color-text)]">{e.currency}</td>
                    <td className="px-5 py-4 text-[var(--color-text-muted)]">{e.duration}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold" style={{ color: 'var(--color-green)' }}>
                        {e.apy}%
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-[var(--color-text)]">
                      {e.subscriptionAmount} {e.currency}
                    </td>
                    <td className="px-5 py-4 text-[var(--color-text)]">
                      {e.expectedReturn > 0 ? `+${e.expectedReturn} ${e.currency}` : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.icon}
                        {e.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
