import { Gift, CheckCircle2, Clock, XCircle } from 'lucide-react'

type BonusType = 'Referral' | 'Signup' | 'Trading Rebate' | 'Promotion' | 'Airdrop'
type BonusStatus = 'Credited' | 'Pending' | 'Expired'

interface BonusRecord {
  id: string
  date: string
  type: BonusType
  currency: string
  amount: number
  status: BonusStatus
  note: string
}

const MOCK_BONUSES: BonusRecord[] = [
  { id: 'BN-001', date: '2026-04-10', type: 'Referral', currency: 'USDT', amount: 10, status: 'Credited', note: 'Referral: user@example.com signed up' },
  { id: 'BN-002', date: '2026-04-05', type: 'Trading Rebate', currency: 'BNB', amount: 0.05, status: 'Credited', note: 'Weekly trading fee rebate' },
  { id: 'BN-003', date: '2026-03-28', type: 'Promotion', currency: 'USDT', amount: 20, status: 'Credited', note: 'Spring trading campaign reward' },
  { id: 'BN-004', date: '2026-03-15', type: 'Referral', currency: 'USDT', amount: 10, status: 'Pending', note: 'Referral pending KYC completion' },
  { id: 'BN-005', date: '2026-03-01', type: 'Airdrop', currency: 'BTC', amount: 0.0001, status: 'Credited', note: 'Community airdrop event' },
  { id: 'BN-006', date: '2026-02-14', type: 'Promotion', currency: 'USDT', amount: 5, status: 'Expired', note: 'Valentine\'s Day promotion — not claimed in time' },
  { id: 'BN-007', date: '2026-01-01', type: 'Signup', currency: 'USDT', amount: 25, status: 'Credited', note: 'Welcome bonus on first deposit' },
]

const TYPE_ICONS: Record<BonusType, React.ReactNode> = {
  Referral: <Gift size={13} />,
  Signup: <Gift size={13} />,
  'Trading Rebate': <Gift size={13} />,
  Promotion: <Gift size={13} />,
  Airdrop: <Gift size={13} />,
}

const STATUS_CONFIG: Record<BonusStatus, { icon: React.ReactNode; bg: string; color: string }> = {
  Credited: { icon: <CheckCircle2 size={11} />, bg: '#16a34a22', color: 'var(--color-green)' },
  Pending: { icon: <Clock size={11} />, bg: '#d1aa6722', color: 'var(--color-primary)' },
  Expired: { icon: <XCircle size={11} />, bg: '#dc262622', color: 'var(--color-red)' },
}

const TYPE_COLORS: Record<BonusType, string> = {
  Referral: '#8b5cf6',
  Signup: 'var(--color-primary)',
  'Trading Rebate': '#3b82f6',
  Promotion: 'var(--color-green)',
  Airdrop: '#f59e0b',
}

export function BonusHistoryPage() {
  const totalCredited = MOCK_BONUSES.filter((b) => b.status === 'Credited').reduce((s, b) => s + (b.currency === 'USDT' ? b.amount : 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Bonus History</h1>
        <div
          className="rounded-lg px-4 py-2 border border-[var(--color-border)] flex items-center gap-2"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <Gift size={14} style={{ color: 'var(--color-primary)' }} />
          <span className="text-sm text-[var(--color-text-muted)]">Total USDT bonuses:</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
            +{totalCredited} USDT
          </span>
        </div>
      </div>

      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Date', 'Type', 'Currency', 'Amount', 'Note', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-medium text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MOCK_BONUSES.map((bonus) => {
                const cfg = STATUS_CONFIG[bonus.status]
                return (
                  <tr key={bonus.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                    <td className="px-5 py-4 text-[var(--color-text-muted)]">{bonus.date}</td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ backgroundColor: `${TYPE_COLORS[bonus.type]}22`, color: TYPE_COLORS[bonus.type] }}
                      >
                        {TYPE_ICONS[bonus.type]}
                        {bonus.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-[var(--color-text)]">{bonus.currency}</td>
                    <td className="px-5 py-4 font-semibold" style={{ color: 'var(--color-green)' }}>
                      +{bonus.amount} {bonus.currency}
                    </td>
                    <td className="px-5 py-4 text-xs text-[var(--color-text-muted)] max-w-[200px] truncate">
                      {bonus.note}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.icon}
                        {bonus.status}
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
