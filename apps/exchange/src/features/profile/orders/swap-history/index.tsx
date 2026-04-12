import { ArrowRight, CheckCircle2, XCircle, Clock } from 'lucide-react'

type SwapStatus = 'Completed' | 'Failed' | 'Processing'

interface SwapRecord {
  id: string
  date: string
  fromCoin: string
  fromAmount: number
  toCoin: string
  toAmount: number
  rate: number
  status: SwapStatus
}

const MOCK_SWAPS: SwapRecord[] = [
  { id: 'SW-001', date: '2026-04-11 13:05:00', fromCoin: 'BTC', fromAmount: 0.01, toCoin: 'USDT', toAmount: 648, rate: 64800, status: 'Completed' },
  { id: 'SW-002', date: '2026-04-10 20:30:15', fromCoin: 'USDT', fromAmount: 500, toCoin: 'ETH', toAmount: 0.1563, rate: 3200, status: 'Completed' },
  { id: 'SW-003', date: '2026-04-10 15:00:00', fromCoin: 'BNB', fromAmount: 2, toCoin: 'USDT', toAmount: 1150, rate: 575, status: 'Completed' },
  { id: 'SW-004', date: '2026-04-09 11:22:33', fromCoin: 'USDT', fromAmount: 100, toCoin: 'SOL', toAmount: 0.7018, rate: 142.5, status: 'Failed' },
  { id: 'SW-005', date: '2026-04-09 08:44:50', fromCoin: 'ETH', fromAmount: 0.5, toCoin: 'BNB', toAmount: 2.76, rate: 5.52, status: 'Completed' },
  { id: 'SW-006', date: '2026-04-08 17:10:00', fromCoin: 'USDT', fromAmount: 300, toCoin: 'ADA', toAmount: 664, rate: 0.452, status: 'Processing' },
]

const STATUS_CONFIG: Record<SwapStatus, { icon: React.ReactNode; bg: string; color: string }> = {
  Completed: { icon: <CheckCircle2 size={11} />, bg: '#16a34a22', color: 'var(--color-green)' },
  Failed: { icon: <XCircle size={11} />, bg: '#dc262622', color: 'var(--color-red)' },
  Processing: { icon: <Clock size={11} />, bg: '#d1aa6722', color: 'var(--color-primary)' },
}

export function SwapHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Swap History</h1>

      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Date', 'From', 'To', 'Rate', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-medium text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MOCK_SWAPS.map((swap) => {
                const cfg = STATUS_CONFIG[swap.status]
                return (
                  <tr key={swap.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                    <td className="px-5 py-4 text-[var(--color-text-muted)] whitespace-nowrap">{swap.date}</td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--color-red)' }}>
                          -{swap.fromAmount} {swap.fromCoin}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <ArrowRight size={13} className="text-[var(--color-text-muted)]" />
                        <p className="font-medium" style={{ color: 'var(--color-green)' }}>
                          +{swap.toAmount} {swap.toCoin}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[var(--color-text-muted)] text-xs">
                      1 {swap.fromCoin} = {swap.rate} {swap.toCoin}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.icon}
                        {swap.status}
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
