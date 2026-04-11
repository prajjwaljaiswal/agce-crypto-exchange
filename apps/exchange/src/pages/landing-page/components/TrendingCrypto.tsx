import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Coin } from '../types/index.js'
import { COIN_TABS } from '../data/index.js'

function CoinRow({ coin, onClick }: { coin: Coin; onClick: () => void }) {
  return (
    <div
      className="flex items-center justify-between py-3 cursor-pointer transition-colors hover:bg-[#f8f8f8]"
      style={{ borderBottom: '1px solid var(--color-border-light)' }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className="shrink-0 rounded-full overflow-hidden flex items-center justify-center w-9 h-9 bg-[#f5f5f5]"
        >
          <img
            src={coin.icon}
            alt={coin.symbol}
            className="w-7 h-7 object-cover"
            onError={(e) => {
              const t = e.currentTarget
              t.style.display = 'none'
              if (t.parentElement) {
                t.parentElement.style.backgroundColor = '#e8e8e8'
                t.parentElement.textContent = coin.symbol[0]
                t.parentElement.style.fontSize = '13px'
                t.parentElement.style.fontWeight = '700'
                t.parentElement.style.color = '#555'
              }
            }}
          />
        </div>

        <div>
          <p className="text-sm font-semibold leading-none mb-0.5" style={{ color: 'var(--color-text-dark)' }}>
            {coin.symbol}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-dark-muted)' }}>
            {coin.name}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-dark)' }}>
          {coin.price}
        </p>
        <div className="flex items-center justify-end gap-1 mt-0.5">
          {coin.positive
            ? <TrendingUp size={11} style={{ color: 'var(--color-green)' }} />
            : <TrendingDown size={11} style={{ color: 'var(--color-red)' }} />
          }
          <p
            className="text-xs font-medium"
            style={{ color: coin.positive ? 'var(--color-green)' : 'var(--color-red)' }}
          >
            {coin.change}
          </p>
        </div>
      </div>
    </div>
  )
}

export function TrendingCrypto() {
  const navigate = useNavigate()

  const handleRowClick = (coin: Coin) => {
    navigate(`/trade/${coin.symbol}_USDT`)
  }

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="text-center mb-10">
          <div className="inline-block text-[15px] bg-[#E2CAA0] text-[#222017] border border-[rgba(34,32,23,0.14)] px-[18px] py-[7px] rounded-[50px] mb-4">
            Platform Features
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: 'var(--color-text-dark)' }}>
            Trending Cryptocurrencies
          </h2>
          <p className="text-base" style={{ color: 'var(--color-text-dark-muted)' }}>
            Trade 1,000+ cryptocurrencies in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COIN_TABS.map(({ key, label, data }) => (
            <div
              key={key}
              className="rounded-2xl p-5 bg-white"
              style={{
                border: '1px solid var(--color-border-light)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-base" style={{ color: 'var(--color-text-dark)' }}>
                  {label}
                </h3>
              </div>

              <div
                className="flex justify-between mb-1 pb-2"
                style={{ borderBottom: '1px solid var(--color-border-light)' }}
              >
                <span className="text-xs" style={{ color: 'var(--color-text-dark-muted)' }}>Name</span>
                <span className="text-xs" style={{ color: 'var(--color-text-dark-muted)' }}>Price / 24h</span>
              </div>

              {data.map((coin) => (
                <CoinRow key={coin.symbol + coin.name} coin={coin} onClick={() => handleRowClick(coin)} />
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
