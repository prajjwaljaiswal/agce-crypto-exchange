import { CheckCircle2, XCircle, Clock } from 'lucide-react'

type OrderSide = 'Buy' | 'Sell'
type OrderStatus = 'Filled' | 'Cancelled' | 'Partial'

interface SpotOrder {
  id: string
  date: string
  pair: string
  side: OrderSide
  price: number
  amount: number
  total: number
  status: OrderStatus
}

const MOCK_ORDERS: SpotOrder[] = [
  { id: 'SO-001', date: '2026-04-11 14:20:05', pair: 'BTC/USDT', side: 'Buy', price: 64800, amount: 0.01, total: 648, status: 'Filled' },
  { id: 'SO-002', date: '2026-04-11 10:05:33', pair: 'ETH/USDT', side: 'Sell', price: 3210, amount: 0.5, total: 1605, status: 'Filled' },
  { id: 'SO-003', date: '2026-04-10 18:44:17', pair: 'BNB/USDT', side: 'Buy', price: 575, amount: 2, total: 1150, status: 'Partial' },
  { id: 'SO-004', date: '2026-04-10 09:30:00', pair: 'SOL/USDT', side: 'Buy', price: 142.5, amount: 5, total: 712.5, status: 'Cancelled' },
  { id: 'SO-005', date: '2026-04-09 22:11:48', pair: 'ADA/USDT', side: 'Sell', price: 0.452, amount: 1000, total: 452, status: 'Filled' },
  { id: 'SO-006', date: '2026-04-09 15:00:21', pair: 'BTC/USDT', side: 'Sell', price: 65200, amount: 0.005, total: 326, status: 'Filled' },
  { id: 'SO-007', date: '2026-04-08 11:22:44', pair: 'ETH/USDT', side: 'Buy', price: 3180, amount: 1, total: 3180, status: 'Cancelled' },
]

const STATUS_CONFIG: Record<OrderStatus, { icon: React.ReactNode; bg: string; color: string }> = {
  Filled: { icon: <CheckCircle2 size={11} />, bg: '#16a34a22', color: 'var(--color-green)' },
  Cancelled: { icon: <XCircle size={11} />, bg: '#dc262622', color: 'var(--color-red)' },
  Partial: { icon: <Clock size={11} />, bg: '#d1aa6722', color: 'var(--color-primary)' },
}

export function SpotOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Spot Order History</h1>

      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Date', 'Pair', 'Side', 'Price (USDT)', 'Amount', 'Total (USDT)', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-medium text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MOCK_ORDERS.map((order) => {
                const cfg = STATUS_CONFIG[order.status]
                return (
                  <tr key={order.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                    <td className="px-5 py-4 text-[var(--color-text-muted)] whitespace-nowrap">{order.date}</td>
                    <td className="px-5 py-4 font-medium text-[var(--color-text)]">{order.pair}</td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: order.side === 'Buy' ? 'var(--color-green)' : 'var(--color-red)' }}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[var(--color-text)]">{order.price.toLocaleString()}</td>
                    <td className="px-5 py-4 text-[var(--color-text)]">{order.amount}</td>
                    <td className="px-5 py-4 font-medium text-[var(--color-text)]">{order.total.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.icon}
                        {order.status}
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
