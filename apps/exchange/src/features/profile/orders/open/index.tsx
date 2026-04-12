import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOpenOrders, cancelOrder } from '../../../trade/paper/index.js'
import { fmtDateTime } from '@agce/binance'

export function OpenOrdersPage() {
  const openOrders = useOpenOrders()
  const [sideFilter, setSideFilter] = useState<'all' | 'BUY' | 'SELL'>('all')
  const [symbolFilter, setSymbolFilter] = useState('')

  const filtered = useMemo(() => {
    return openOrders.filter((o) => {
      if (sideFilter !== 'all' && o.side !== sideFilter) return false
      if (symbolFilter && !o.symbol.toLowerCase().includes(symbolFilter.toLowerCase())) return false
      return true
    })
  }, [openOrders, sideFilter, symbolFilter])

  const cancelAll = () => {
    filtered.forEach((o) => cancelOrder(o.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Open Orders</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {openOrders.length} active order{openOrders.length !== 1 ? 's' : ''}
          </p>
        </div>
        {filtered.length > 0 && (
          <button
            onClick={cancelAll}
            className="text-sm font-medium border border-[var(--color-red)] rounded-lg px-4 py-2"
            style={{ color: 'var(--color-red)' }}
          >
            Cancel All ({filtered.length})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          value={symbolFilter}
          onChange={(e) => setSymbolFilter(e.target.value)}
          placeholder="Filter by symbol (e.g. BTC)"
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
      </div>

      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Date', 'Pair', 'Type', 'Side', 'Price', 'Amount', 'Filled', 'Total', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left font-medium text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map((order) => {
                const fillPct = order.quantity > 0 ? ((order.executedQty / order.quantity) * 100).toFixed(0) : '0'
                return (
                  <tr key={order.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                    <td className="px-4 py-4 text-[var(--color-text-muted)] whitespace-nowrap">{fmtDateTime(order.createdAt)}</td>
                    <td className="px-4 py-4 font-medium text-[var(--color-text)]">
                      <Link to={`/trade/${order.base}_${order.quote}`} className="hover:underline">
                        {order.base}/{order.quote}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-[var(--color-text-muted)]">{order.type}</td>
                    <td className="px-4 py-4">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: order.side === 'BUY' ? 'var(--color-green)' : 'var(--color-red)' }}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[var(--color-text)] tabular-nums">{order.price}</td>
                    <td className="px-4 py-4 text-[var(--color-text)] tabular-nums">{order.quantity}</td>
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
                    <td className="px-4 py-4 font-medium text-[var(--color-text)] tabular-nums">{(order.price * order.quantity).toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => cancelOrder(order.id)}
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

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
            No open orders. Place an order from the{' '}
            <Link to="/trade/BTC_USDT" className="underline" style={{ color: 'var(--color-primary)' }}>
              trade page
            </Link>.
          </div>
        )}
      </div>
    </div>
  )
}
