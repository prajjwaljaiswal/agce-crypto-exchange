import { TrendingUp, TrendingDown } from 'lucide-react'

type Coin = {
  symbol: string
  name: string
  price: string
  change: string
  positive: boolean
  icon: string
}

const hotCoins: Coin[] = [
  { symbol: 'BTC',   name: 'Bitcoin',      price: '$87,339.15', change: '-2.4%',  positive: false, icon: '/images/hot_bitcoin.svg' },
  { symbol: 'ETH',   name: 'Ethereum',     price: '$2,944.15',  change: '-2.34%', positive: false, icon: '/images/hot_eth.svg' },
  { symbol: 'KCS',   name: 'KuCoin Token', price: '$318.75',    change: '+1.2%',  positive: true,  icon: '/images/coin_icon.svg' },
  { symbol: 'ZEC',   name: 'Zcash',        price: '$96.59',     change: '+3.45%', positive: true,  icon: '/images/hot_zec.svg' },
  { symbol: 'TOKEN', name: 'TokenFi',      price: '$0.052',     change: '+5.1%',  positive: true,  icon: '/images/hot_token.svg' },
]

const newCoins: Coin[] = [
  { symbol: 'TTD',  name: 'TradingDog', price: '$0.082', change: '+12.4%', positive: true, icon: '/images/new_coin_icon.png' },
  { symbol: 'HLS',  name: 'Helios',     price: '$0.234', change: '+8.7%',  positive: true, icon: '/images/coin_icon2.svg' },
  { symbol: 'ZKP',  name: 'ZKPass',     price: '$0.594', change: '+15.3%', positive: true, icon: '/images/coin_icon3.svg' },
  { symbol: 'ZIG',  name: 'Zignaly',    price: '$0.105', change: '+6.9%',  positive: true, icon: '/images/coin_icon4.svg' },
  { symbol: 'VOOI', name: 'VOOI',       price: '$0.032', change: '+4.2%',  positive: true, icon: '/images/coin_icon5.svg' },
]

const topGainerCoins: Coin[] = [
  { symbol: 'SCOR',  name: 'Scorai',   price: '$1.24',  change: '+28.4%', positive: true, icon: '/images/gainers_icon.svg' },
  { symbol: 'ANLOG', name: 'Analog',   price: '$2.87',  change: '+22.7%', positive: true, icon: '/images/gainers_icon2.svg' },
  { symbol: 'PPONG', name: 'PingPong', price: '$0.89',  change: '+18.3%', positive: true, icon: '/images/gainers_icon3.svg' },
  { symbol: 'ELIZA', name: 'ElizaOS',  price: '$14.56', change: '+15.1%', positive: true, icon: '/images/gainers_icon4.svg' },
  { symbol: 'MAIGA', name: 'MAIGA',    price: '$5.12',  change: '+11.6%', positive: true, icon: '/images/gainers_icon5.svg' },
]

const tabs = [
  { key: 'hot',        label: 'Hot',         data: hotCoins },
  { key: 'newCoins',   label: 'New Coins',   data: newCoins },
  { key: 'topGainers', label: 'Top Gainers', data: topGainerCoins },
]

function CoinRow({ coin }: { coin: Coin }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: '1px solid var(--color-border-light)' }}
    >
      <div className="flex items-center gap-3">
        {/* Coin icon — circular image */}
        <div
          className="shrink-0 rounded-full overflow-hidden flex items-center justify-center"
          style={{ width: '36px', height: '36px', backgroundColor: '#f5f5f5' }}
        >
          <img
            src={coin.icon}
            alt={coin.symbol}
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
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
            {coin.symbol}/USDT
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
  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#ffffff' }}>
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: 'var(--color-text-dark)' }}>
            Trending Cryptocurrencies
          </h2>
          <p className="text-base" style={{ color: 'var(--color-text-dark-muted)' }}>
            Trade 1,000+ cryptocurrencies in real time.
          </p>
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tabs.map(({ key, label, data }) => (
            <div
              key={key}
              className="rounded-2xl p-5"
              style={{
                border: '1px solid var(--color-border-light)',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-base" style={{ color: 'var(--color-text-dark)' }}>
                  {label}
                </h3>
              </div>

              {/* Column sub-headers */}
              <div
                className="flex justify-between mb-1 pb-2"
                style={{ borderBottom: '1px solid var(--color-border-light)' }}
              >
                <span className="text-xs" style={{ color: 'var(--color-text-dark-muted)' }}>Name</span>
                <span className="text-xs" style={{ color: 'var(--color-text-dark-muted)' }}>Price / 24h</span>
              </div>

              {/* Coin rows */}
              {data.map((coin) => (
                <CoinRow key={coin.symbol} coin={coin} />
              ))}

              {/* View more */}
              <div className="mt-3 text-right">
                <a
                  href="#"
                  className="text-xs font-medium"
                  style={{ color: 'var(--color-primary)' }}
                >
                  View More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
