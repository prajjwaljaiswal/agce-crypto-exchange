import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Star, Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { FeaturedPair, MarketPair } from '@agce/types'
import { MARKET_TABS, CATEGORY_FILTERS, COIN_CATEGORIES, ALPHA_BASES } from './data/index.js'
import { useBinanceMarket } from './hooks/useBinanceMarket.js'

// ─── Mini Line Chart (SVG) ───────────────────────────────────────────────────

function MiniChart({ positive }: { positive: boolean }) {
  const points = [30, 45, 35, 55, 40, 60, 38, 52, 48, 65, 42, 58, 50, 70, 55, 62]
  const width = 120
  const height = 40
  const stepX = width / (points.length - 1)

  const pathD = points
    .map((y, i) => {
      const x = i * stepX
      const scaledY = height - (y / 100) * height
      return `${i === 0 ? 'M' : 'L'}${x},${scaledY}`
    })
    .join(' ')

  const color = positive ? '#2bc287' : '#ef4444'

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <path d={pathD} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

// ─── Price Range Bar ─────────────────────────────────────────────────────────

function PriceRangeBar({ low, high }: { low: string; high: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-[4px] w-full rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-border)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: '65%',
            background: 'linear-gradient(90deg, #ef4444 0%, #2bc287 100%)',
          }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{low}</span>
        <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{high}</span>
      </div>
    </div>
  )
}

// ─── Featured Pair Card ──────────────────────────────────────────────────────

function FeaturedPairCard({ pair }: { pair: FeaturedPair }) {
  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 0 12px rgba(0,0,0,0.1)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden shrink-0"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        >
          <img
            src={pair.icon}
            alt={pair.baseCurrency}
            className="w-5 h-5 object-contain"
            onError={(e) => {
              const t = e.currentTarget
              t.style.display = 'none'
              if (t.parentElement) {
                t.parentElement.textContent = pair.baseCurrency[0]
                t.parentElement.style.fontSize = '10px'
                t.parentElement.style.fontWeight = '700'
                t.parentElement.style.color = 'var(--color-primary)'
              }
            }}
          />
        </div>
        <span className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>
          {pair.baseCurrency}
        </span>
        <span
          className="ml-auto font-bold text-lg"
          style={{ color: pair.positive ? '#2bc287' : '#ef4444' }}
        >
          {pair.change}
        </span>
      </div>

      <p className="text-4xl font-medium mb-3" style={{ color: 'var(--color-text)' }}>
        {pair.price}
      </p>

      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        24H Volume：{pair.volume}
      </p>
    </div>
  )
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div
            className="h-4 rounded animate-pulse"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              width: i === 0 ? '160px' : i === 7 ? '60px' : '80px',
            }}
          />
        </td>
      ))}
    </tr>
  )
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-6 animate-pulse"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: 'var(--color-surface-2)' }} />
        <div className="h-5 w-12 rounded" style={{ backgroundColor: 'var(--color-surface-2)' }} />
      </div>
      <div className="h-10 w-40 rounded mb-3" style={{ backgroundColor: 'var(--color-surface-2)' }} />
      <div className="h-4 w-52 rounded" style={{ backgroundColor: 'var(--color-surface-2)' }} />
    </div>
  )
}

// ─── Market Table Row ────────────────────────────────────────────────────────

function MarketRow({ pair, coinName, isFavourite, onToggleFav }: {
  pair: MarketPair
  coinName: string
  isFavourite: boolean
  onToggleFav: () => void
}) {
  return (
    <tr
      className="transition-colors"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      {/* Name */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFav}
            className="shrink-0 transition-colors"
            style={{ color: isFavourite ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
          >
            <Star size={14} fill={isFavourite ? 'currentColor' : 'none'} />
          </button>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shrink-0"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            <img
              src={pair.icon}
              alt={pair.baseCurrency}
              className="w-7 h-7 object-contain"
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
            <p className="text-[15px] font-semibold" style={{ color: 'var(--color-text)' }}>
              {pair.baseCurrency}{pair.quoteCurrency}
            </p>
            <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
              {coinName}
            </p>
          </div>
        </div>
      </td>

      {/* Last Price */}
      <td className="py-4 px-4">
        <p className="text-[15px] font-medium" style={{ color: 'var(--color-text)' }}>
          {pair.price}
        </p>
        <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
          {pair.priceUsd}
        </p>
      </td>

      {/* 24H Change */}
      <td className="py-4 px-4">
        <span
          className="text-[14px] font-medium"
          style={{ color: pair.positive ? '#2bc287' : '#ef4444' }}
        >
          {pair.change}
        </span>
      </td>

      {/* 24h Chart */}
      <td className="py-4 px-4 hidden lg:table-cell">
        <MiniChart positive={pair.positive} />
      </td>

      {/* 24h Price Range */}
      <td className="py-4 px-4 hidden xl:table-cell w-[180px]">
        <PriceRangeBar low={pair.low24h} high={pair.high24h} />
      </td>

      {/* 24h Volume */}
      <td className="py-4 px-4 hidden md:table-cell">
        <span className="text-[14px] font-medium" style={{ color: 'var(--color-text)' }}>
          {pair.volume}
        </span>
      </td>

      {/* Market Cap */}
      <td className="py-4 px-4 hidden lg:table-cell">
        <span className="text-[15px] font-medium" style={{ color: 'var(--color-text)' }}>
          {pair.marketCap}
        </span>
      </td>

      {/* Action */}
      <td className="py-4 px-4">
        <Link
          to={`/trade/${pair.baseCurrency}_${pair.quoteCurrency}`}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full text-[13px] font-medium no-underline transition-opacity hover:opacity-80"
          style={{
            backgroundColor: 'var(--color-surface-3)',
            color: 'var(--color-text)',
          }}
        >
          Trade
        </Link>
      </td>
    </tr>
  )
}

// ─── Pagination ──────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const getPages = () => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 7; i++) pages.push(i)
        pages.push('...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...')
        for (let i = totalPages - 6; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1, '...')
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i)
        pages.push('...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1 py-6">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-30"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <ChevronLeft size={14} />
      </button>

      {getPages().map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="w-7 h-7 flex items-center justify-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="w-7 h-7 flex items-center justify-center rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: currentPage === page ? 'var(--color-surface-3)' : 'transparent',
              color: currentPage === page ? 'var(--color-text)' : 'var(--color-text-muted)',
            }}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-30"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

// ─── MarketPage ──────────────────────────────────────────────────────────────

const PAIR_TYPE_LABEL: Record<string, string> = {
  favourite: 'USDT',
  spot:      'USDT Spot',
  futures:   'USDT Perp',
  cryptos:   'USDT',
  alpha:     'USDT Alpha',
}

const parseChangePct = (change: string): number => parseFloat(change)

export function MarketPage() {
  const { pairs, featured, loading, error, coinNames } = useBinanceMarket()

  const [activeTab, setActiveTab] = useState('spot')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [favourites, setFavourites] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  const toggleFav = (symbol: string) => {
    setFavourites((prev) => {
      const next = new Set(prev)
      if (next.has(symbol)) next.delete(symbol)
      else next.add(symbol)
      return next
    })
  }

  // Tab-level filter runs first — narrows the universe before category/search.
  const basePairs = useMemo(() => {
    if (activeTab === 'favourite') {
      return pairs.filter((p) => favourites.has(p.symbol))
    }
    if (activeTab === 'alpha') {
      return pairs.filter((p) => ALPHA_BASES.includes(p.baseCurrency))
    }
    return pairs
  }, [pairs, activeTab, favourites])

  const filteredPairs = useMemo(() => {
    let result = basePairs

    if (categoryFilter === 'hot') {
      // Top 10 most-active by absolute 24h change — updates live with WS ticks.
      result = [...result]
        .sort((a, b) => Math.abs(parseChangePct(b.change)) - Math.abs(parseChangePct(a.change)))
        .slice(0, 10)
    } else if (categoryFilter !== 'all') {
      const bases = COIN_CATEGORIES[categoryFilter] ?? []
      result = result.filter((p) => bases.includes(p.baseCurrency))
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.symbol.toLowerCase().includes(q) ||
          p.baseCurrency.toLowerCase().includes(q),
      )
    }

    return result
  }, [basePairs, categoryFilter, searchQuery])

  const itemsPerPage = 20
  const totalPages = Math.max(1, Math.ceil(filteredPairs.length / itemsPerPage))
  const paginatedPairs = filteredPairs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div className="pb-8 mx-auto max-w-[1920px]">

      {/* ── Featured Pairs ─────────────────────────────────────── */}
      <div className="px-4 md:px-6 lg:px-10 pt-7 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[1840px] mx-auto">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.map((pair) => (
                <FeaturedPairCard key={pair.symbol} pair={pair} />
              ))
          }
        </div>
      </div>

      {/* ── Error Banner ──────────────────────────────────────── */}
      {error && (
        <div className="mx-4 md:mx-6 lg:mx-10 mb-4 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
          Failed to load market data: {error}
        </div>
      )}

      {/* ── Main Table Section ────────────────────────────────── */}
      <div className="px-4 md:px-6 lg:px-10">
        <div
          className="rounded-none max-w-[1854px] mx-auto"
          style={{ backgroundColor: 'var(--color-bg)' }}
        >
          {/* Tab Bar */}
          <div
            className="flex items-center gap-2 px-4 md:px-6 h-16"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0">
              {MARKET_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setCurrentPage(1) }}
                  className="relative shrink-0 px-4 py-2 text-[17px] font-semibold whitespace-nowrap transition-colors"
                  style={{
                    color: activeTab === tab.key ? 'var(--color-text)' : 'var(--color-text-muted)',
                  }}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-4 rounded-[1px]"
                      style={{ backgroundColor: 'var(--color-text)' }}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="shrink-0 p-2 rounded-lg transition-colors hover:opacity-80"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="px-6 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2 max-w-sm"
                style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
              >
                <Search size={14} style={{ color: 'var(--color-text-muted)' }} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search pair..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                  className="bg-transparent text-sm outline-none flex-1"
                  style={{ color: 'var(--color-text)' }}
                />
              </div>
            </div>
          )}

          {/* Category Filters + Pair Type */}
          <div
            className="flex items-center gap-3 px-4 md:px-6 py-3"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => { setCategoryFilter(cat.key); setCurrentPage(1) }}
                  className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors"
                  style={{
                    backgroundColor: categoryFilter === cat.key ? 'var(--color-text)' : 'var(--color-surface-2)',
                    color: categoryFilter === cat.key ? 'var(--color-bg)' : 'var(--color-text-muted)',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="shrink-0">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {PAIR_TYPE_LABEL[activeTab] ?? 'USDT'}
                <ChevronDown size={12} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="flex items-center gap-1">
                      Last Price
                      <span className="inline-flex flex-col text-[8px] leading-none" style={{ color: 'var(--color-text-subtle)' }}>
                        <span>▲</span><span>▼</span>
                      </span>
                    </span>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="flex items-center gap-1">
                      24H Change %
                      <span className="inline-flex flex-col text-[8px] leading-none" style={{ color: 'var(--color-text-subtle)' }}>
                        <span>▲</span><span>▼</span>
                      </span>
                    </span>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium hidden lg:table-cell" style={{ color: 'var(--color-text-muted)' }}>
                    24h Chart
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium hidden xl:table-cell" style={{ color: 'var(--color-text-muted)' }}>
                    24h Price Range
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium hidden md:table-cell" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="flex items-center gap-1">
                      24h Volume
                      <span className="inline-flex flex-col text-[8px] leading-none" style={{ color: 'var(--color-text-subtle)' }}>
                        <span>▲</span><span>▼</span>
                      </span>
                    </span>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium hidden lg:table-cell" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="flex items-center gap-1">
                      Market Cap
                      <span className="inline-flex flex-col text-[8px] leading-none" style={{ color: 'var(--color-text-subtle)' }}>
                        <span>▲</span><span>▼</span>
                      </span>
                    </span>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
                ) : paginatedPairs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-sm"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {activeTab === 'favourite' && favourites.size === 0
                        ? 'No favourites yet. Star a pair to add it here.'
                        : 'No pairs match your filters.'}
                    </td>
                  </tr>
                ) : (
                  paginatedPairs.map((pair) => (
                    <MarketRow
                      key={pair.symbol}
                      pair={pair}
                      coinName={coinNames[pair.baseCurrency] ?? pair.baseCurrency}
                      isFavourite={favourites.has(pair.symbol)}
                      onToggleFav={() => toggleFav(pair.symbol)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredPairs.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  )
}
