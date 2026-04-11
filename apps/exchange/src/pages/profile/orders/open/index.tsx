import { X } from 'lucide-react'

type OrderSide = 'Buy' | 'Sell'
type OrderType = 'Limit' | 'Market' | 'Stop-Limit'

interface OpenOrder {
  id: string
  date: string
  pair: string
  type: OrderType
  side: OrderSide
  price: number
  amount: number
  filled: number
  total: number
}

const MOCK_OPEN_ORDERS: OpenOrder[] = [
  { id: 'OO-001', date: '2026-04-11 15:10:00', pair: 'BTC/USDT', type: 'Limit', side: 'Buy', price: 63500, amount: 0.02, filled: 0, total: 1270 },
  { id: 'OO-002', date: '2026-04-11 14:55:22', pair: 'ETH/USDT', type: 'Limit', side: 'Sell', price: 3300, amount: 1.5, filled: 0.5, total: 4950 },
  { id: 'OO-003', date: '2026-04-11 13:30:05', pair: 'BNB/USDT', type: 'Stop-Limit', side: 'Sell', price: 560, amount: 5, filled: 0, total: 2800 },
  { id: 'OO-004', date: '2026-04-11 11:00:40', pair: 'SOL/USDT', type: 'Limit', side: 'Buy', price: 138, amount: 10, filled: 4, total: 1380 },
]

export function OpenOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Open Orders</h1>
        <button
          className="text-sm font-medium border border-[var(--color-red)] rounded-lg px-4 py-2"
          style={{ color: 'var(--color-red)' }}
        >
          Cancel All
        </button>
      </div>

      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[750px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Date', 'Pair', 'Type', 'Side', 'Price (USDT)', 'Amount', 'Filled', 'Total (USDT)', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left font-medium text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MOCK_OPEN_ORDERS.map((order) => {
                const fillPct = ((order.filled / order.amount) * 100).toFixed(0)
                return (
                  <tr key={order.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                    <td className="px-4 py-4 text-[var(--color-text-muted)] whitespace-nowrap">{order.date}</td>
                    <td className="px-4 py-4 font-medium text-[var(--color-text)]">{order.pair}</td>
                    <td className="px-4 py-4 text-[var(--color-text-muted)]">{order.type}</td>
                    <td className="px-4 py-4">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: order.side === 'Buy' ? 'var(--color-green)' : 'var(--color-red)' }}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[var(--color-text)]">{order.price.toLocaleString()}</td>
                    <td className="px-4 py-4 text-[var(--color-text)]">{order.amount}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-14 rounded-full" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${fillPct}%`, backgroundColor: 'var(--color-primary)' }}
                          />
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)]">{fillPct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-[var(--color-text)]">{order.total.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <button
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border border-[var(--color-red)] transition-colors hover:bg-[var(--color-red)]/10"
                        style={{ color: 'var(--color-red)' }}
                      >
                        <X size={12} />
                        Cancel
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {MOCK_OPEN_ORDERS.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">No open orders.</div>
        )}
      </div>
    </div>
  )
}
