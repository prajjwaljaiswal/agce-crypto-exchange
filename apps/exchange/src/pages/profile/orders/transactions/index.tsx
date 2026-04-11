import { CheckCircle2, Clock, XCircle } from 'lucide-react'

type TxType = 'Deposit' | 'Withdrawal' | 'Transfer' | 'Fee'
type TxStatus = 'Completed' | 'Pending' | 'Failed'

interface Transaction {
  id: string
  date: string
  type: TxType
  currency: string
  amount: number
  fee: number
  status: TxStatus
  txHash?: string
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX-001', date: '2026-04-11 14:32:05', type: 'Deposit', currency: 'BTC', amount: 0.05, fee: 0, status: 'Completed', txHash: '0x3a7f...c9e2' },
  { id: 'TX-002', date: '2026-04-11 09:15:22', type: 'Withdrawal', currency: 'USDT', amount: 500, fee: 1, status: 'Completed', txHash: '0x9b1c...f3a8' },
  { id: 'TX-003', date: '2026-04-10 18:00:00', type: 'Deposit', currency: 'ETH', amount: 2, fee: 0, status: 'Pending' },
  { id: 'TX-004', date: '2026-04-10 12:30:11', type: 'Transfer', currency: 'USDT', amount: 200, fee: 0, status: 'Completed' },
  { id: 'TX-005', date: '2026-04-09 22:45:00', type: 'Withdrawal', currency: 'BNB', amount: 3, fee: 0.005, status: 'Failed' },
  { id: 'TX-006', date: '2026-04-09 15:10:33', type: 'Deposit', currency: 'USDT', amount: 1000, fee: 0, status: 'Completed', txHash: '0xd4e8...a102' },
  { id: 'TX-007', date: '2026-04-08 08:00:00', type: 'Fee', currency: 'BNB', amount: 0.02, fee: 0, status: 'Completed' },
]

const TYPE_COLORS: Record<TxType, string> = {
  Deposit: 'var(--color-green)',
  Withdrawal: 'var(--color-red)',
  Transfer: '#3b82f6',
  Fee: 'var(--color-text-muted)',
}

const STATUS_CONFIG: Record<TxStatus, { icon: React.ReactNode; bg: string; color: string }> = {
  Completed: { icon: <CheckCircle2 size={11} />, bg: '#16a34a22', color: 'var(--color-green)' },
  Pending: { icon: <Clock size={11} />, bg: '#d1aa6722', color: 'var(--color-primary)' },
  Failed: { icon: <XCircle size={11} />, bg: '#dc262622', color: 'var(--color-red)' },
}

export function TransactionHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Transaction History</h1>

      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Date', 'Type', 'Currency', 'Amount', 'Fee', 'Tx Hash', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-medium text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MOCK_TRANSACTIONS.map((tx) => {
                const cfg = STATUS_CONFIG[tx.status]
                return (
                  <tr key={tx.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                    <td className="px-5 py-4 text-[var(--color-text-muted)] whitespace-nowrap">{tx.date}</td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium" style={{ color: TYPE_COLORS[tx.type] }}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-[var(--color-text)]">{tx.currency}</td>
                    <td className="px-5 py-4 text-[var(--color-text)]">
                      {tx.type === 'Deposit' ? '+' : '-'}{tx.amount}
                    </td>
                    <td className="px-5 py-4 text-[var(--color-text-muted)]">{tx.fee || '—'}</td>
                    <td className="px-5 py-4 font-mono text-xs text-[var(--color-text-muted)]">
                      {tx.txHash ?? '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.icon}
                        {tx.status}
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
