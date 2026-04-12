import { useState, useMemo } from 'react'
import { fmtDateTime } from '@agce/binance'
import { useTheme } from '../../../providers/index.js'
import {
  cancelOrder,
  useOpenOrders,
  useOrderHistory,
  useTradeHistory,
} from '../paper/index.js'
import type { PaperOrder } from '../paper/index.js'
import type { OrdersTab } from './types.js'

export function OpenOrdersPanel({ symbol }: { symbol?: string }) {
  const [activeTab, setActiveTab] = useState<OrdersTab>('Open Orders')
  const [sideFilter, setSideFilter] = useState<'all' | 'buy' | 'sell'>('all')
  const [symbolScope, setSymbolScope] = useState<'current' | 'all'>('current')

  const openOrders = useOpenOrders(symbolScope === 'current' ? symbol : undefined)
  const orderHistory = useOrderHistory(symbolScope === 'current' ? symbol : undefined)
  const tradeHistory = useTradeHistory(symbolScope === 'current' ? symbol : undefined)

  const tabs: OrdersTab[] = ['Open Orders', 'Order History', 'Trade History', 'Loan Management', 'Bots(0)']
  const subTabs = ['Limit / Market', 'Conditional', 'TP/SL', 'TWAP', 'Iceberg Pro', 'Loop Order', 'Trailing Stop']

  const filteredOpen = useMemo(
    () => sideFilter === 'all' ? openOrders : openOrders.filter(o => o.side === (sideFilter === 'buy' ? 'BUY' : 'SELL')),
    [openOrders, sideFilter],
  )
  const filteredHistory = useMemo(
    () => sideFilter === 'all' ? orderHistory : orderHistory.filter(o => o.side === (sideFilter === 'buy' ? 'BUY' : 'SELL')),
    [orderHistory, sideFilter],
  )
  const filteredTrades = useMemo(
    () => sideFilter === 'all' ? tradeHistory : tradeHistory.filter(t => t.side === (sideFilter === 'buy' ? 'BUY' : 'SELL')),
    [tradeHistory, sideFilter],
  )

  const showLoan = activeTab === 'Loan Management'
  const showBots = activeTab === 'Bots(0)'

  return (
    <div style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
      {/* Tabs */}
      <div className="flex gap-5 px-5 h-10 items-end overflow-x-auto" style={{ borderBottom: '1px solid var(--color-border)' }}>
        {tabs.map(t => (
          <button
            key={t}
            className="text-sm font-medium pb-2.5 shrink-0 whitespace-nowrap"
            style={{
              color: activeTab === t ? 'var(--color-text)' : 'var(--color-text-muted)',
              borderBottom: activeTab === t ? '2px solid var(--color-primary)' : '2px solid transparent',
            }}
            onClick={() => setActiveTab(t)}
          >
            {t === 'Open Orders' ? `Open Orders(${openOrders.length})` : t}
          </button>
        ))}
      </div>

      {/* Sub-tabs / filters */}
      <div className="flex items-center gap-3 px-5 py-2 flex-wrap" style={{ borderBottom: '1px solid var(--color-border)' }}>
        {subTabs.map((s, i) => (
          <button key={s} className="text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap" style={{ color: i === 0 ? 'var(--color-text)' : 'var(--color-text-muted)', background: i === 0 ? 'var(--color-surface-2)' : 'transparent', border: i === 0 ? '1px solid var(--color-border)' : 'none' }}>{s}</button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
          <button onClick={() => setSymbolScope(s => s === 'current' ? 'all' : 'current')} className="px-2 py-1 rounded-md" style={{ border: '1px solid var(--color-border)' }}>
            {symbolScope === 'current' ? 'Current pair' : 'All pairs'}
          </button>
          <select value={sideFilter} onChange={e => setSideFilter(e.target.value as 'all' | 'buy' | 'sell')} className="bg-transparent px-2 py-1 rounded-md outline-none" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
            <option value="all">All Sides</option>
            <option value="buy">Buy only</option>
            <option value="sell">Sell only</option>
          </select>
          <button className="px-2 py-1 rounded-md" style={{ border: '1px solid var(--color-border)' }} onClick={() => { setSideFilter('all'); setSymbolScope('current') }}>
            Reset ↻
          </button>
        </div>
      </div>

      {/* Body */}
      {showLoan ? (
        <LoanEmptyState />
      ) : showBots ? (
        <BotsEmptyState />
      ) : activeTab === 'Open Orders' ? (
        <OpenOrdersTable rows={filteredOpen} />
      ) : activeTab === 'Order History' ? (
        <OrderHistoryTable rows={filteredHistory} />
      ) : (
        <TradeHistoryTable rows={filteredTrades} />
      )}
    </div>
  )
}

function OpenOrdersTable({ rows }: { rows: PaperOrder[] }) {
  const cols = ['Pair', 'Date', 'Side', 'Type', 'Price', 'Amount', 'Filled', 'Total', 'Action']
  if (rows.length === 0) return <EmptyState />
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        <div className="grid grid-cols-9 px-5 py-2.5 text-xs" style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
          {cols.map(h => <span key={h}>{h}</span>)}
        </div>
        {rows.map(o => (
          <div key={o.id} className="grid grid-cols-9 px-5 py-2.5 text-xs items-center" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text)' }}>{o.base}/{o.quote}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>{fmtDateTime(o.createdAt)}</span>
            <span style={{ color: o.side === 'BUY' ? '#0ecb81' : '#f6465d', fontWeight: 600 }}>{o.side}</span>
            <span style={{ color: 'var(--color-text)' }}>{o.type}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text)' }}>{o.price}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text)' }}>{o.quantity}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text-muted)' }}>{o.executedQty.toFixed(6)}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text)' }}>{(o.price * o.quantity).toFixed(2)}</span>
            <button onClick={() => cancelOrder(o.id)} className="text-left font-semibold" style={{ color: 'var(--color-primary)' }}>Cancel</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderHistoryTable({ rows }: { rows: PaperOrder[] }) {
  const cols = ['Pair', 'Date', 'Side', 'Type', 'Price', 'Amount', 'Filled', 'Total', 'Status']
  if (rows.length === 0) return <EmptyState />
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        <div className="grid grid-cols-9 px-5 py-2.5 text-xs" style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
          {cols.map(h => <span key={h}>{h}</span>)}
        </div>
        {rows.map(o => (
          <div key={o.id} className="grid grid-cols-9 px-5 py-2.5 text-xs items-center" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text)' }}>{o.base}/{o.quote}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>{fmtDateTime(o.updatedAt)}</span>
            <span style={{ color: o.side === 'BUY' ? '#0ecb81' : '#f6465d', fontWeight: 600 }}>{o.side}</span>
            <span style={{ color: 'var(--color-text)' }}>{o.type}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text)' }}>{o.price}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text)' }}>{o.quantity}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text-muted)' }}>{o.executedQty.toFixed(6)}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text)' }}>{o.cummulativeQuoteQty.toFixed(2)}</span>
            <span style={{ color: o.status === 'FILLED' ? '#0ecb81' : o.status === 'CANCELED' ? 'var(--color-text-muted)' : '#f6465d' }}>{o.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TradeHistoryTable({ rows }: { rows: ReturnType<typeof useTradeHistory> }) {
  const cols = ['Pair', 'Date', 'Side', 'Role', 'Price', 'Quantity', 'Total', 'Fee']
  if (rows.length === 0) return <EmptyState />
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        <div className="grid grid-cols-8 px-5 py-2.5 text-xs" style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
          {cols.map(h => <span key={h}>{h}</span>)}
        </div>
        {rows.map(t => (
          <div key={t.id} className="grid grid-cols-8 px-5 py-2.5 text-xs items-center" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text)' }}>{t.base}/{t.quote}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>{fmtDateTime(t.time)}</span>
            <span style={{ color: t.side === 'BUY' ? '#0ecb81' : '#f6465d', fontWeight: 600 }}>{t.side}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>{t.isMaker ? 'Maker' : 'Taker'}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text)' }}>{t.price}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text)' }}>{t.quantity}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text)' }}>{t.quoteQty.toFixed(2)}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text-muted)' }}>{t.fee.toFixed(6)} {t.feeAsset}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  const { theme } = useTheme()
  const src = theme === 'dark' ? '/images/trade_telescope_dark.svg' : '/images/trade_telescope.svg'
  return (
    <div className="flex flex-col items-center py-10">
      <img src={src} alt="No data" className="w-24 h-24 opacity-70" onError={(e) => { e.currentTarget.style.display = 'none' }} />
      <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>No data</p>
    </div>
  )
}

function LoanEmptyState() {
  return (
    <div className="flex flex-col items-center py-10 gap-2">
      <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Margin & Loans</p>
      <p className="text-xs max-w-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
        Cross-margin and loan management is paper-simulated in this environment.
        No active loans. Real margin trading requires backend API integration.
      </p>
    </div>
  )
}

function BotsEmptyState() {
  return (
    <div className="flex flex-col items-center py-10">
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No active bots</p>
    </div>
  )
}
