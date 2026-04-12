import { useNavigate, Link } from 'react-router-dom'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Coin } from '../types/index.js'
import { useTrendingCoins } from '../hooks/useTrendingCoins.js'

const TABS = [
  { key: 'hot', label: 'Hot' },
  { key: 'gainers', label: 'Top Gainers' },
  { key: 'losers', label: 'Top Losers' },
] as const

function CoinRow({ coin, onClick }: { coin: Coin; onClick: () => void }) {
  return (
    <div
      className="flex items-center justify-between py-3 cursor-pointer transition-colors hover:opacity-80"
      style={{ borderBottom: '1px solid var(--color-border)' }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className="shrink-0 rounded-full overflow-hidden flex items-center justify-center w-9 h-9"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        >
          <img
            src={coin.icon}
            alt={coin.symbol}
            className="w-7 h-7 object-cover"
            onError={(e) => {
              const t = e.currentTarget
              t.style.display = 'none'
              if (t.parentElement) {
                t.parentElement.textContent = coin.symbol[0]
                t.parentElement.style.fontSize = '13px'
                t.parentElement.style.fontWeight = '700'
                t.parentElement.style.color = 'var(--color-text-muted)'
              }
            }}
          />
        </div>

        <div>
          <p
            className="text-sm font-semibold leading-none mb-0.5"
            style={{ color: 'var(--color-text)' }}
          >
            {coin.symbol}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {coin.name}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          {coin.price}
        </p>
        <div className="flex items-center justify-end gap-1 mt-0.5">
          {coin.positive ? (
            <TrendingUp size={11} style={{ color: 'var(--color-green)' }} />
          ) : (
            <TrendingDown size={11} style={{ color: 'var(--color-red)' }} />
          )}
          <p
            className="text-xs font-medium"
            style={{
              color: coin.positive ? 'var(--color-green)' : 'var(--color-red)',
            }}
          >
            {coin.change}
          </p>
        </div>
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="shrink-0 rounded-full w-9 h-9 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div className="space-y-1.5">
          <div
            className="h-3 w-16 rounded animate-pulse"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          />
          <div
            className="h-2 w-20 rounded animate-pulse"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          />
        </div>
      </div>
      <div className="space-y-1.5 text-right">
        <div
          className="h-3 w-16 rounded animate-pulse ml-auto"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div
          className="h-2 w-12 rounded animate-pulse ml-auto"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
      </div>
    </div>
  )
}

export function TrendingCrypto() {
  const navigate = useNavigate()
  const { hot, gainers, losers, loading, error } = useTrendingCoins(5)

  const groups: Record<(typeof TABS)[number]['key'], Coin[]> = {
    hot,
    gainers,
    losers,
  }

  const handleRowClick = (coin: Coin) => {
    navigate(`/trade/${coin.symbol}_USDT`)
  }

  return (
    <section
      className="py-16 lg:py-20"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="text-center mb-10">
          <div
            className="inline-block text-[15px] px-[18px] py-[7px] rounded-[50px] mb-4"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#222017',
              border: '1px solid rgba(34,32,23,0.14)',
            }}
          >
            Live Market
          </div>
          <h2
            className="text-3xl lg:text-4xl font-bold mb-3"
            style={{ color: 'var(--color-text)' }}
          >
            Trending Cryptocurrencies
          </h2>
          <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>
            Trade 1,000+ cryptocurrencies in real time.
          </p>
        </div>

        {error && (
          <div
            className="max-w-md mx-auto mb-6 px-4 py-3 rounded-lg text-sm text-center"
            style={{
              backgroundColor: 'rgba(220,38,38,0.1)',
              color: 'var(--color-red)',
            }}
          >
            Failed to load live prices: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TABS.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-semibold text-base"
                  style={{ color: 'var(--color-text)' }}
                >
                  {label}
                </h3>
              </div>

              <div
                className="flex justify-between mb-1 pb-2"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <span
                  className="text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Name
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Price / 24h
                </span>
              </div>

              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : groups[key].map((coin) => (
                    <CoinRow
                      key={coin.symbol + coin.name}
                      coin={coin}
                      onClick={() => handleRowClick(coin)}
                    />
                  ))}
            </div>
          ))}
        </div>

        {/* View More link */}
        <div className="mt-8 text-center">
          <Link
            to="/market"
            className="inline-flex items-center gap-2 text-sm font-medium no-underline"
            style={{ color: 'var(--color-primary)' }}
          >
            View More →
          </Link>
        </div>
      </div>
    </section>
  )
}
