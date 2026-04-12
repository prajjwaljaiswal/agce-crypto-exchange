import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTradeHistory } from '../../../trade/paper/index.js'
import { fmtDateTime } from '@agce/binance'

export function TradeHistoryPage() {
  const trades = useTradeHistory()
  const [sideFilter, setSideFilter] = useState<'all' | 'BUY' | 'SELL'>('all')
  const [symbolFilter, setSymbolFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'maker' | 'taker'>('all')

  const filtered = useMemo(() => {
    return trades.filter((t) => {
      if (sideFilter !== 'all' && t.side !== sideFilter) return false
      if (symbolFilter && !t.symbol.toLowerCase().includes(symbolFilter.toLowerCase())) return false
      if (roleFilter === 'maker' && !t.isMaker) return false
      if (roleFilter === 'taker' && t.isMaker) return false
      return true
    })
  }, [trades, sideFilter, symbolFilter, roleFilter])

  const stats = useMemo(() => {
    const volume = trades.reduce((s, t) => s + t.quoteQty, 0)
    const buys = trades.filter((t) => t.side === 'BUY').length
    const sells = trades.filter((t) => t.side === 'SELL').length
    const totalFeesUsdt = trades.reduce((s, t) => {
      // Rough estimate: fee in base asset → multiply by trade price; fee in quote → already in USDT.
      if (t.feeAsset === t.quote) return s + t.fee
      return s + t.fee * t.price
    }, 0)
    return { count: trades.length, volume, buys, sells, fees: totalFeesUsdt }
  }, [trades])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Trade History</h1>
        <Link to="/user_profile/spot_orders" className="text-sm" style={{ color: 'var(--color-primary)' }}>
          View order history →
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Trades" value={stats.count.toString()} />
        <StatCard label="Total Volume (USDT)" value={stats.volume.toLocaleString('en-US', { maximumFractionDigits: 2 })} />
        <StatCard label="Buy / Sell" value={`${stats.buys} / ${stats.sells}`} />
        <StatCard label="Fees (≈ USDT)" value={stats.fees.toLocaleString('en-US', { maximumFractionDigits: 4 })} />
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
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'all' | 'maker' | 'taker')}
          className="px-3 py-2 rounded-md text-sm bg-transparent outline-none"
          style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        >
          <option value="all">All roles</option>
          <option value="maker">Maker</option>
          <option value="taker">Taker</option>
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
                {['Time', 'Pair', 'Side', 'Role', 'Price', 'Quantity', 'Total', 'Fee'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-medium text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                  <td className="px-5 py-4 text-[var(--color-text-muted)] whitespace-nowrap">{fmtDateTime(t.time)}</td>
                  <td className="px-5 py-4 font-medium text-[var(--color-text)]">
                    <Link to={`/trade/${t.base}_${t.quote}`} className="hover:underline">
                      {t.base}/{t.quote}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold" style={{ color: t.side === 'BUY' ? 'var(--color-green)' : 'var(--color-red)' }}>
                      {t.side}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-text-muted)]">{t.isMaker ? 'Maker' : 'Taker'}</td>
                  <td className="px-5 py-4 text-[var(--color-text)] tabular-nums">{t.price.toLocaleString()}</td>
                  <td className="px-5 py-4 text-[var(--color-text)] tabular-nums">{t.quantity}</td>
                  <td className="px-5 py-4 font-medium text-[var(--color-text)] tabular-nums">{t.quoteQty.toFixed(2)}</td>
                  <td className="px-5 py-4 text-[var(--color-text-muted)] tabular-nums">{t.fee.toFixed(6)} {t.feeAsset}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
            No trades match your filters.
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
