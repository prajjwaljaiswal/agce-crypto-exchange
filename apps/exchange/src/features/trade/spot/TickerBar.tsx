import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CoinIcon, COIN_NAMES, QUOTE_TABS } from './coins.js'
import { useBinanceAllTickers } from './hooks.js'
import type { TickerData } from './types.js'

export function TickerBar({ base, quote, ticker, prevPrice }: { base: string; quote: string; ticker: TickerData; prevPrice: string }) {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [quoteTab, setQuoteTab] = useState<string>('USDT')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const changePos = parseFloat(ticker.priceChangePercent) >= 0
  // Price direction: compare current vs previous tick
  const curr = parseFloat(ticker.lastPrice.replace(/,/g, '')) || 0
  const prev = parseFloat(prevPrice.replace(/,/g, '')) || 0
  const priceUp = curr >= prev
  const priceColor = priceUp ? '#0ecb81' : '#f6465d'
  const allTickers = useBinanceAllTickers()


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = allTickers.filter(t => {
    if (search) return t.base.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase())
    return t.quote === quoteTab
  })

  return (
    <div className="flex items-center h-16 px-3 md:px-5 gap-4 md:gap-10 shrink-0" style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
      {/* Pair selector */}
      <div className="shrink-0" ref={dropdownRef}>
        <button className="flex items-center gap-3" onClick={() => setDropdownOpen(o => !o)}>
          <CoinIcon symbol={base} size={32} />
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="text-base font-bold" style={{ color: 'var(--color-text)' }}>{base}/{quote}</span>
              <span className="text-xs transition-transform" style={{ color: 'var(--color-text-muted)', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{COIN_NAMES[base] ?? base}</span>
          </div>
        </button>

        {/* Dropdown — fixed so it overlays without breaking layout */}
        {dropdownOpen && (
          <div className="fixed left-3 right-3 md:left-5 md:right-auto md:w-80 rounded-xl shadow-2xl overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', top: `${(dropdownRef.current?.getBoundingClientRect().bottom ?? 76) + 4}px`, zIndex: 9999 }}>
            {/* Search */}
            <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search"
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: 'var(--color-text)' }}
                />
              </div>
            </div>

            {/* Quote tabs */}
            <div className="flex gap-0 px-3 pt-1" style={{ borderBottom: '1px solid var(--color-border)' }}>
              {QUOTE_TABS.map(t => (
                <button key={t} className="px-3 py-2 text-xs font-semibold" style={{ color: quoteTab === t ? 'var(--color-text)' : 'var(--color-text-muted)', borderBottom: quoteTab === t ? '2px solid var(--color-text)' : '2px solid transparent', marginBottom: '-1px' }} onClick={() => { setQuoteTab(t); setSearch('') }}>{t}</button>
              ))}
            </div>

            {/* Column header */}
            <div className="grid grid-cols-3 px-3 py-1.5 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              <span>Pair</span>
              <span className="text-right">Price</span>
              <span className="text-right">Change</span>
            </div>

            {/* Coin list */}
            <div className="max-h-[400px] overflow-y-auto">
              {filtered.length > 0 ? filtered.map(coin => (
                <button
                  key={coin.symbol}
                  className="grid grid-cols-3 items-center w-full px-3 py-2 text-left transition-colors hover:bg-[var(--color-surface-2)]"
                  style={{ background: coin.base === base ? 'var(--color-surface-2)' : 'transparent' }}
                  onClick={() => { navigate(`/trade/${coin.base}_${coin.quote}`); setDropdownOpen(false); setSearch('') }}
                >
                  <div className="flex items-center gap-2">
                    <CoinIcon symbol={coin.base} size={24} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{coin.base}/{coin.quote}</p>
                      <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{coin.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--color-text)' }}>{coin.price}</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>${coin.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium" style={{ color: parseFloat(coin.change) >= 0 ? '#0ecb81' : '#f6465d' }}>{parseFloat(coin.change) >= 0 ? '+' : ''}{coin.change}%</p>
                  </div>
                </button>
              )) : (
                <p className="text-center py-8 text-xs" style={{ color: 'var(--color-text-muted)' }}>No pairs found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Price + Stats — scrollable */}
      <div className="flex items-center gap-5 md:gap-10 flex-1 min-w-0 overflow-x-auto">
        <div className="shrink-0">
          <span className="text-2xl font-bold" style={{ color: priceColor }}>{ticker.lastPrice}</span>
          <p className="text-xs" style={{ color: priceColor }}>${ticker.lastPrice}</p>
        </div>
        <Stat label="Change%" value={`${changePos ? '+' : ''}${ticker.priceChangePercent}%`} color={changePos ? '#0ecb81' : '#f6465d'} />
        <Stat label="24h High" value={ticker.highPrice} />
        <Stat label="24h Low" value={ticker.lowPrice} />
        <Stat label={`24h Volume (${base})`} value={ticker.volume} />
        <Stat label={`24h Turnover (${quote})`} value={ticker.quoteVolume} />
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="shrink-0">
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color: color ?? 'var(--color-text)' }}>{value}</p>
    </div>
  )
}
