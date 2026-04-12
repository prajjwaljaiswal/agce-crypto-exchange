import { useState, useEffect, useRef, useMemo } from 'react'
import { useRecentTrades } from './hooks.js'
import {
  fmtVol,
  fmtAmount,
  fmtGroupedPrice,
  fmtTradeTime,
  fmtTradeQty,
  fmtTradePrice,
} from './format.js'
import type { RawBookEntry, BookMode } from './types.js'

const PRECISION_OPTIONS = [0.01, 0.1, 1, 10, 50, 100, 1000]
const BOOK_ROW_LIMIT = 10

function groupBookSide(entries: RawBookEntry[], precision: number, side: 'bid' | 'ask'): RawBookEntry[] {
  const groups = new Map<number, number>()
  for (const { price, amount } of entries) {
    const bucket = side === 'ask'
      ? Math.ceil(price / precision - 1e-9) * precision
      : Math.floor(price / precision + 1e-9) * precision
    const key = Math.round(bucket * 1e8) / 1e8
    groups.set(key, (groups.get(key) ?? 0) + amount)
  }
  const arr = Array.from(groups, ([price, amount]) => ({ price, amount }))
  arr.sort((a, b) => (side === 'ask' ? a.price - b.price : b.price - a.price))
  return arr
}

export function OrderBook({ symbol, bids, asks, lastPrice, prevPrice, base, quote }: { symbol: string; bids: RawBookEntry[]; asks: RawBookEntry[]; lastPrice: string; prevPrice: string; base: string; quote: string }) {
  const [tab, setTab] = useState<'book' | 'trades'>('book')
  const [bookMode, setBookMode] = useState<BookMode>('both')
  const [precision, setPrecision] = useState<number>(0.01)
  const [precisionOpen, setPrecisionOpen] = useState(false)
  const precisionRef = useRef<HTMLDivElement>(null)
  const recentTrades = useRecentTrades(symbol, 40)

  useEffect(() => {
    if (!precisionOpen) return
    const onDown = (e: MouseEvent) => {
      if (precisionRef.current?.contains(e.target as Node)) return
      setPrecisionOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPrecisionOpen(false) }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [precisionOpen])

  // Group raw book entries by selected precision, keep N rows nearest the spread.
  const groupedAsks = useMemo(() => {
    const g = groupBookSide(asks, precision, 'ask').slice(0, BOOK_ROW_LIMIT)
    return [...g].reverse() // display: highest on top, closest-to-spread at bottom
  }, [asks, precision])

  const groupedBids = useMemo(() => {
    return groupBookSide(bids, precision, 'bid').slice(0, BOOK_ROW_LIMIT)
  }, [bids, precision])

  // Cumulative totals (in quote) for the depth-bar visualization
  const askRows = useMemo(
    () => groupedAsks.map(e => ({ ...e, total: e.price * e.amount })),
    [groupedAsks]
  )
  const bidRows = useMemo(
    () => groupedBids.map(e => ({ ...e, total: e.price * e.amount })),
    [groupedBids]
  )
  const maxAsk = askRows.length ? Math.max(...askRows.map(r => r.total)) : 1
  const maxBid = bidRows.length ? Math.max(...bidRows.map(r => r.total)) : 1

  // Live buy/sell depth ratio — sums of visible bid vs ask quote totals.
  const { buyPct, sellPct } = useMemo(() => {
    const bidTotal = bidRows.reduce((s, r) => s + r.total, 0)
    const askTotal = askRows.reduce((s, r) => s + r.total, 0)
    const sum = bidTotal + askTotal
    if (sum <= 0) return { buyPct: 50, sellPct: 50 }
    const bp = (bidTotal / sum) * 100
    return { buyPct: bp, sellPct: 100 - bp }
  }, [bidRows, askRows])

  const precisionLabel = precision >= 1 ? precision.toString() : precision.toString()


  return (
    <div className="flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Tabs */}
      <div className="flex items-center justify-between px-4 h-11 shrink-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-5 h-full">
          <button className="text-sm font-semibold h-full relative" style={{ color: tab === 'book' ? 'var(--color-text)' : 'var(--color-text-muted)' }} onClick={() => setTab('book')}>
            Order Book
            {tab === 'book' && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--color-text)' }} />}
          </button>
          <button className="text-sm font-medium h-full" style={{ color: tab === 'trades' ? 'var(--color-text)' : 'var(--color-text-muted)' }} onClick={() => setTab('trades')}>Market Trades</button>
        </div>
        <span className="text-base cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>⋮</span>
      </div>

      {tab === 'book' ? (
        <>
          {/* View mode icons + precision */}
          <div className="flex items-center justify-between px-4 py-2.5 shrink-0">
            <div className="flex gap-2">
              {/* Icon 1: both (red + green) */}
              <button
                type="button"
                aria-label="Show asks and bids"
                aria-pressed={bookMode === 'both'}
                onClick={() => setBookMode('both')}
                className="flex flex-col gap-[3px] p-1.5 rounded"
                style={{ background: bookMode === 'both' ? 'var(--color-surface-2)' : 'transparent' }}
              >
                <div className="flex gap-[2px]">
                  <div className="w-2.5 h-[5px] rounded-sm" style={{ background: '#f6465d', opacity: bookMode === 'both' ? 1 : 0.5 }} />
                  <div className="w-2.5 h-[5px] rounded-sm" style={{ background: '#0ecb81', opacity: bookMode === 'both' ? 1 : 0.5 }} />
                </div>
                <div className="flex gap-[2px]">
                  <div className="w-2.5 h-[5px] rounded-sm" style={{ background: '#f6465d', opacity: bookMode === 'both' ? 1 : 0.5 }} />
                  <div className="w-2.5 h-[5px] rounded-sm" style={{ background: '#0ecb81', opacity: bookMode === 'both' ? 1 : 0.5 }} />
                </div>
                <div className="flex gap-[2px]">
                  <div className="w-2.5 h-[5px] rounded-sm" style={{ background: '#f6465d', opacity: bookMode === 'both' ? 1 : 0.5 }} />
                  <div className="w-2.5 h-[5px] rounded-sm" style={{ background: '#0ecb81', opacity: bookMode === 'both' ? 1 : 0.5 }} />
                </div>
              </button>
              {/* Icon 2: bids only (green) */}
              <button
                type="button"
                aria-label="Show bids only"
                aria-pressed={bookMode === 'bids'}
                onClick={() => setBookMode('bids')}
                className="flex flex-col gap-[3px] p-1.5 rounded"
                style={{ background: bookMode === 'bids' ? 'var(--color-surface-2)' : 'transparent' }}
              >
                <div className="w-5 h-[5px] rounded-sm" style={{ background: '#0ecb81', opacity: bookMode === 'bids' ? 1 : 0.35 }} />
                <div className="w-5 h-[5px] rounded-sm" style={{ background: '#0ecb81', opacity: bookMode === 'bids' ? 1 : 0.35 }} />
                <div className="w-5 h-[5px] rounded-sm" style={{ background: '#0ecb81', opacity: bookMode === 'bids' ? 1 : 0.35 }} />
              </button>
              {/* Icon 3: asks only (red) */}
              <button
                type="button"
                aria-label="Show asks only"
                aria-pressed={bookMode === 'asks'}
                onClick={() => setBookMode('asks')}
                className="flex flex-col gap-[3px] p-1.5 rounded"
                style={{ background: bookMode === 'asks' ? 'var(--color-surface-2)' : 'transparent' }}
              >
                <div className="w-5 h-[5px] rounded-sm" style={{ background: '#f6465d', opacity: bookMode === 'asks' ? 1 : 0.35 }} />
                <div className="w-5 h-[5px] rounded-sm" style={{ background: '#f6465d', opacity: bookMode === 'asks' ? 1 : 0.35 }} />
                <div className="w-5 h-[5px] rounded-sm" style={{ background: '#f6465d', opacity: bookMode === 'asks' ? 1 : 0.35 }} />
              </button>
            </div>
            <div className="relative" ref={precisionRef}>
              <button
                type="button"
                onClick={() => setPrecisionOpen(o => !o)}
                className="text-xs inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[var(--color-surface-2)]"
                style={{ color: 'var(--color-text-muted)' }}
                aria-haspopup="listbox"
                aria-expanded={precisionOpen}
              >
                {precisionLabel}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {precisionOpen && (
                <div
                  className="absolute right-0 top-full mt-1 rounded-md shadow-lg py-1 z-20"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', minWidth: 90 }}
                  role="listbox"
                >
                  {PRECISION_OPTIONS.map(opt => {
                    const active = opt === precision
                    return (
                      <button
                        key={opt}
                        onClick={() => { setPrecision(opt); setPrecisionOpen(false) }}
                        className="flex w-full items-center justify-between px-3 py-1.5 text-xs"
                        style={{
                          color: active ? 'var(--color-text)' : 'var(--color-text-muted)',
                          background: active ? 'var(--color-surface-3)' : 'transparent',
                          fontWeight: active ? 700 : 500,
                        }}
                        role="option"
                        aria-selected={active}
                      >
                        <span>{opt}</span>
                        {active && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-3 px-4 py-1.5 shrink-0 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <span>Price ({quote})</span>
            <span className="text-right">Amount ({base})</span>
            <span className="text-right">Total</span>
          </div>

          {/* Asks (sells) — red */}
          {bookMode !== 'bids' && (
            <div className="shrink-0">
              {askRows.map((a, i) => (
                <div key={`a${i}`} className="grid grid-cols-3 px-4 py-[4px] relative">
                  <div className="absolute top-0 bottom-0 right-0 w-1/3">
                    <div className="absolute inset-y-0 right-0 opacity-15" style={{ background: '#f6465d', width: `${(a.total / maxAsk) * 100}%` }} />
                  </div>
                  <span className="relative text-xs tabular-nums" style={{ color: '#f6465d' }}>{fmtGroupedPrice(a.price, precision)}</span>
                  <span className="relative text-xs tabular-nums text-right" style={{ color: 'var(--color-text)' }}>{fmtAmount(a.amount.toString())}</span>
                  <span className="relative text-xs tabular-nums text-right" style={{ color: 'var(--color-text)' }}>{fmtVol(a.total)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Last price spread */}
          {(() => {
            const curr = parseFloat(lastPrice.replace(/,/g, '')) || 0
            const prev = parseFloat(prevPrice.replace(/,/g, '')) || 0
            const isUp = curr >= prev
            const priceColor = isUp ? '#0ecb81' : '#f6465d'
            const arrow = isUp ? '↑' : '↓'
            return (
              <div className="px-4 py-2.5 flex items-center justify-between shrink-0" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold" style={{ color: priceColor }}>{lastPrice}</span>
                  <span className="text-xs" style={{ color: priceColor }}>{arrow}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>${lastPrice}</span>
                </div>
                <span className="text-sm cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>›</span>
              </div>
            )
          })()}

          {/* Bids (buys) — green */}
          {bookMode !== 'asks' && (
            <div className="shrink-0">
              {bidRows.map((b, i) => (
                <div key={`b${i}`} className="grid grid-cols-3 px-4 py-[4px] relative">
                  <div className="absolute top-0 bottom-0 right-0 w-1/3">
                    <div className="absolute inset-y-0 right-0 opacity-15" style={{ background: '#0ecb81', width: `${(b.total / maxBid) * 100}%` }} />
                  </div>
                  <span className="relative text-xs tabular-nums" style={{ color: '#0ecb81' }}>{fmtGroupedPrice(b.price, precision)}</span>
                  <span className="relative text-xs tabular-nums text-right" style={{ color: 'var(--color-text)' }}>{fmtAmount(b.amount.toString())}</span>
                  <span className="relative text-xs tabular-nums text-right" style={{ color: 'var(--color-text)' }}>{fmtVol(b.total)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Buy/Sell ratio bar */}
          <div className="px-4 py-3 shrink-0" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between text-xs mb-1.5 tabular-nums">
              <span style={{ color: '#0ecb81' }}>B {buyPct.toFixed(2)}%</span>
              <span style={{ color: '#f6465d' }}>{sellPct.toFixed(2)}% S</span>
            </div>
            <div className="flex h-1.5 rounded-full overflow-hidden">
              <div style={{ width: `${buyPct}%`, background: '#0ecb81' }} />
              <div style={{ width: `${sellPct}%`, background: '#f6465d' }} />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Column headers */}
          <div className="grid grid-cols-3 px-4 py-2 shrink-0 text-xs" style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
            <span>Price ({quote})</span>
            <span className="text-right">Amount ({base})</span>
            <span className="text-right">Time</span>
          </div>

          {/* Live trades — newest at the top */}
          <div className="flex-1 overflow-y-auto">
            {recentTrades.length === 0 ? (
              <div className="flex items-center justify-center py-10 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Loading trades…
              </div>
            ) : (
              recentTrades.map((t, i) => {
                const isBuy = !t.buyerIsMaker
                const color = isBuy ? '#0ecb81' : '#f6465d'
                return (
                  <div key={`t${t.time}-${i}`} className="grid grid-cols-3 px-4 py-[4px] text-xs tabular-nums">
                    <span style={{ color }}>{fmtTradePrice(t.price)}</span>
                    <span className="text-right" style={{ color: 'var(--color-text)' }}>{fmtTradeQty(t.qty)}</span>
                    <span className="text-right" style={{ color: 'var(--color-text-muted)' }}>{fmtTradeTime(t.time)}</span>
                  </div>
                )
              })
            )}
          </div>
        </>
      )}
    </div>
  )
}
