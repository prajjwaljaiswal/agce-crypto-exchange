import { CheckCircle2, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrderHistory } from '../../../trade/paper/index.js'
import type { OrderStatus } from '../../../trade/paper/index.js'
import { fmtDateTime } from '@agce/binance'

const STATUS_CONFIG: Record<OrderStatus, { bg: string; color: string }> = {
  FILLED: { bg: '#16a34a22', color: 'var(--color-green)' },
  PARTIALLY_FILLED: { bg: '#d1aa6722', color: 'var(--color-primary)' },
  CANCELED: { bg: '#dc262622', color: 'var(--color-red)' },
  NEW: { bg: '#64748b22', color: 'var(--color-text-muted)' },
  REJECTED: { bg: '#dc262622', color: 'var(--color-red)' },
}

export function SpotOrdersPage() {
  const history = useOrderHistory()
  const [sideFilter, setSideFilter] = useState<'all' | 'BUY' | 'SELL'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [symbolFilter, setSymbolFilter] = useState('')

  const filtered = useMemo(() => {
    return history.filter((o) => {
      if (sideFilter !== 'all' && o.side !== sideFilter) return false
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (symbolFilter && !o.symbol.toLowerCase().includes(symbolFilter.toLowerCase())) return false
      return true
    })
  }, [history, sideFilter, statusFilter, symbolFilter])

  const stats = useMemo(() => {
    const filled = history.filter((o) => o.status === 'FILLED')
    const totalVolume = filled.reduce((s, o) => s + o.cummulativeQuoteQty, 0)
    const buyCount = filled.filter((o) => o.side === 'BUY').length
    const sellCount = filled.filter((o) => o.side === 'SELL').length
    return { totalOrders: history.length, filled: filled.length, totalVolume, buyCount, sellCount }
  }, [history])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Spot Order History</h1>
        <Link to="/user_profile/open_orders" className="text-sm" style={{ color: 'var(--color-primary)' }}>
          View open orders →
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={stats.totalOrders.toString()} />
        <StatCard label="Filled" value={stats.filled.toString()} />
        <StatCard label="Total Volume (USDT)" value={stats.totalVolume.toLocaleString('en-US', { maximumFractionDigits: 2 })} />
        <StatCard label="Buy / Sell" value={`${stats.buyCount} / ${stats.sellCount}`} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          value={symbolFilter}
          onChange={(e) => setSymbolFilter(e.target.value)}
          placeholder="Filter by symbol"
          className="px-3 py-2 rounded-md text-sm bg-transparent outline-none"
          style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        />
        <select
          value={sideFilter}
          onChange={(e) => setSideFilter(e.target.value as 'all' | 'BUY' | 'SELL')}
          className="px-3 py-2 rounded-md text-sm bg-transparent outline-none"
          style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        >
          <option value="all">All sides</option>
          <option value="BUY">Buy only</option>
          <option value="SELL">Sell only</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | OrderStatus)}
          className="px-3 py-2 rounded-md text-sm bg-transparent outline-none"
          style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        >
          <option value="all">All statuses</option>
          <option value="FILLED">Filled</option>
          <option value="CANCELED">Canceled</option>
          <option value="PARTIALLY_FILLED">Partially filled</option>
        </select>
      </div>

      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Date', 'Pair', 'Type', 'Side', 'Price', 'Amount', 'Total', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-medium text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status]
                return (
                  <tr key={order.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                    <td className="px-5 py-4 text-[var(--color-text-muted)] whitespace-nowrap">{fmtDateTime(order.updatedAt)}</td>
                    <td className="px-5 py-4 font-medium text-[var(--color-text)]">
                      <Link to={`/trade/${order.base}_${order.quote}`} className="hover:underline">
                        {order.base}/{order.quote}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-[var(--color-text-muted)]">{order.type}</td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: order.side === 'BUY' ? 'var(--color-green)' : 'var(--color-red)' }}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[var(--color-text)] tabular-nums">{order.price.toLocaleString()}</td>
                    <td className="px-5 py-4 text-[var(--color-text)] tabular-nums">{order.quantity}</td>
                    <td className="px-5 py-4 font-medium text-[var(--color-text)] tabular-nums">
                      {order.cummulativeQuoteQty.toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {order.status === 'FILLED' && <CheckCircle2 size={11} />}
                        {order.status === 'CANCELED' && <XCircle size={11} />}
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
            No orders match your filters.
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl p-4 border border-[var(--color-border)]"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="text-lg font-bold mt-1 text-[var(--color-text)] tabular-nums">{value}</p>
    </div>
  )
}
