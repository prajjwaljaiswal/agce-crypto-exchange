import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, TrendingUp, TrendingDown, Search } from 'lucide-react'
import type { FeaturedPair, MarketPair } from './types/index.js'
import { FEATURED_PAIRS, SPOT_PAIRS, FUTURES_PAIRS, MARKET_TABS } from './data/index.js'

// ─── Mini Chart Placeholder ───────────────────────────────────────────────────

function MiniChart({ positive }: { positive: boolean }) {
  return (
    <div className="h-10 w-24 flex items-end gap-0.5">
      {[40, 55, 35, 65, 45, 70, 50, 80, 60, 75].map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm opacity-80"
          style={{
            height: `${h}%`,
            backgroundColor: positive ? 'var(--color-green)' : 'var(--color-red)',
          }}
        />
      ))}
    </div>
  )
}

// ─── Featured Pair Card ───────────────────────────────────────────────────────

function FeaturedPairCard({ pair }: { pair: FeaturedPair }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0"
            style={{ backgroundColor: '#2a2a2a' }}
          >
            <img
              src={pair.icon}
              alt={pair.baseCurrency}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const t = e.currentTarget
                t.style.display = 'none'
                if (t.parentElement) {
                  t.parentElement.textContent = pair.baseCurrency[0]
                  t.parentElement.style.fontSize = '14px'
                  t.parentElement.style.fontWeight = '700'
                  t.parentElement.style.color = 'var(--color-primary)'
                }
              }}
            />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
              {pair.symbol}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {pair.baseCurrency}
            </p>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-2 py-1 rounded-md"
          style={{
            backgroundColor: pair.positive ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)',
            color: pair.positive ? 'var(--color-green)' : 'var(--color-red)',
          }}
        >
          {pair.change}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
            {pair.price}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Vol: {pair.volume}
          </p>
        </div>
        <MiniChart positive={pair.positive} />
      </div>
    </div>
  )
}

// ─── Sub-filter buttons ───────────────────────────────────────────────────────

type QuoteFilter = 'all' | 'usdt' | 'btc' | 'eth' | 'bnb'
type SortFilter = 'none' | 'gainers' | 'losers' | 'trending'

// ─── Market Table Row ─────────────────────────────────────────────────────────

function MarketRow({ pair, isFavourite, onToggleFav }: {
  pair: MarketPair
  isFavourite: boolean
  onToggleFav: () => void
}) {
  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
      {/* Pair */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFav}
            className="shrink-0 transition-colors"
            style={{ color: isFavourite ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
          >
            <Star size={14} fill={isFavourite ? 'currentColor' : 'none'} />
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0"
            style={{ backgroundColor: '#2a2a2a' }}
          >
            <img
              src={pair.icon}
              alt={pair.baseCurrency}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                const t = e.currentTarget
                t.style.display = 'none'
                if (t.parentElement) {
                  t.parentElement.textContent = pair.baseCurrency[0]
                  t.parentElement.style.fontSize = '11px'
                  t.parentElement.style.fontWeight = '700'
                  t.parentElement.style.color = 'var(--color-primary)'
                }
              }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {pair.baseCurrency}
              <span style={{ color: 'var(--color-text-muted)' }}>/{pair.quoteCurrency}</span>
            </p>
            {/* Mobile: show volume under pair */}
            <p className="text-xs md:hidden" style={{ color: 'var(--color-text-muted)' }}>
              Vol: {pair.volume}
            </p>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
        {pair.price}
      </td>

      {/* 24H Change */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          {pair.positive
            ? <TrendingUp size={13} style={{ color: 'var(--color-green)' }} />
            : <TrendingDown size={13} style={{ color: 'var(--color-red)' }} />
          }
          <span
            className="text-sm font-semibold"
            style={{ color: pair.positive ? 'var(--color-green)' : 'var(--color-red)' }}
          >
            {pair.change}
          </span>
        </div>
      </td>

      {/* 24H High / Low — hidden on mobile */}
      <td className="py-3 px-4 hidden md:table-cell">
        <p className="text-xs" style={{ color: 'var(--color-green)' }}>{pair.high24h}</p>
        <p className="text-xs" style={{ color: 'var(--color-red)' }}>{pair.low24h}</p>
      </td>

      {/* 24H Volume — hidden on mobile */}
      <td className="py-3 px-4 hidden md:table-cell text-sm" style={{ color: 'var(--color-text-muted)' }}>
        {pair.volume}
      </td>

      {/* Action */}
      <td className="py-3 px-4">
        <Link
          to="/market"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          style={{
            backgroundColor: 'rgba(209,170,103,0.12)',
            color: 'var(--color-primary)',
          }}
        >
          Trade
        </Link>
      </td>
    </tr>
  )
}

// ─── MarketPage ───────────────────────────────────────────────────────────────

export function MarketPage() {
  const [activeTab, setActiveTab] = useState('spot')
  const [quoteFilter, setQuoteFilter] = useState<QuoteFilter>('all')
  const [sortFilter, setSortFilter] = useState<SortFilter>('none')
  const [searchQuery, setSearchQuery] = useState('')
  const [favourites, setFavourites] = useState<Set<string>>(new Set())

  const toggleFav = (symbol: string) => {
    setFavourites((prev) => {
      const next = new Set(prev)
      if (next.has(symbol)) next.delete(symbol)
      else next.add(symbol)
      return next
    })
  }

  const basePairs = activeTab === 'futures'
    ? FUTURES_PAIRS
    : activeTab === 'favourite'
      ? SPOT_PAIRS.filter((p) => favourites.has(p.symbol))
      : SPOT_PAIRS

  const filteredPairs = basePairs
    .filter((p) => {
      if (quoteFilter !== 'all' && p.quoteCurrency.toLowerCase() !== quoteFilter) return false
      if (searchQuery && !p.symbol.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (sortFilter === 'gainers') return p.positive
      if (sortFilter === 'losers') return !p.positive
      return true
    })
    .sort((a, b) => {
      if (sortFilter === 'trending') {
        return parseFloat(b.change.replace('%', '').replace('+', '')) -
          parseFloat(a.change.replace('%', '').replace('+', ''))
      }
      return 0
    })

  const quoteButtons: { key: QuoteFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'usdt', label: 'USDT' },
    { key: 'btc', label: 'BTC' },
    { key: 'eth', label: 'ETH' },
    { key: 'bnb', label: 'BNB' },
  ]

  const sortButtons: { key: SortFilter; label: string }[] = [
    { key: 'gainers', label: 'Gainers' },
    { key: 'losers', label: 'Losers' },
    { key: 'trending', label: 'Trending' },
  ]

  return (
    <div className="py-8 px-4 md:px-6 mx-auto max-w-[1400px]">

      {/* ── Featured Pairs ─────────────────────────────────────── */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Featured Markets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURED_PAIRS.map((pair) => (
            <FeaturedPairCard key={pair.symbol} pair={pair} />
          ))}
        </div>
      </div>

      {/* ── Live Prices ───────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Header */}
        <div className="px-4 md:px-6 pt-5 pb-0">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Live Prices
          </h2>

          {/* Main tabs */}
          <div className="flex gap-1 mb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
            {MARKET_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-4 py-2 text-sm font-semibold transition-colors relative"
                style={{
                  color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--color-primary)' : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sub-filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap gap-2">
              {quoteButtons.map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setQuoteFilter(btn.key)}
                  className="px-3 py-1 text-xs font-semibold rounded-lg transition-colors"
                  style={{
                    backgroundColor: quoteFilter === btn.key ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                    color: quoteFilter === btn.key ? '#0d0d0d' : 'var(--color-text-muted)',
                  }}
                >
                  {btn.label}
                </button>
              ))}
              <div
                className="w-px mx-1 self-stretch"
                style={{ backgroundColor: 'var(--color-border)' }}
              />
              {sortButtons.map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setSortFilter(sortFilter === btn.key ? 'none' : btn.key)}
                  className="px-3 py-1 text-xs font-semibold rounded-lg transition-colors"
                  style={{
                    backgroundColor: sortFilter === btn.key ? 'rgba(209,170,103,0.15)' : 'rgba(255,255,255,0.05)',
                    color: sortFilter === btn.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-1.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)' }}
            >
              <Search size={14} style={{ color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Search pair..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs outline-none w-28"
                style={{ color: 'var(--color-text)' }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th
                  className="py-2.5 px-4 text-left text-xs font-semibold"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Pair
                </th>
                <th
                  className="py-2.5 px-4 text-left text-xs font-semibold"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Price
                </th>
                <th
                  className="py-2.5 px-4 text-left text-xs font-semibold"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  24H Change
                </th>
                <th
                  className="py-2.5 px-4 text-left text-xs font-semibold hidden md:table-cell"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  24H High / Low
                </th>
                <th
                  className="py-2.5 px-4 text-left text-xs font-semibold hidden md:table-cell"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  24H Vol
                </th>
                <th
                  className="py-2.5 px-4 text-left text-xs font-semibold"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPairs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {activeTab === 'favourite'
                      ? 'No favourites yet. Star a pair to add it here.'
                      : 'No pairs match your filters.'}
                  </td>
                </tr>
              ) : (
                filteredPairs.map((pair) => (
                  <MarketRow
                    key={pair.symbol}
                    pair={pair}
                    isFavourite={favourites.has(pair.symbol)}
                    onToggleFav={() => toggleFav(pair.symbol)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
