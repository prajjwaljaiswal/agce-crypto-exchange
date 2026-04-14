import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { MarketCoin, MarketTab } from '../types.js'

const TABS: { id: MarketTab; label: string }[] = [
  { id: 'favorite', label: 'Favorite' },
  { id: 'trending', label: 'Trending' },
  { id: 'hot', label: 'Hot' },
  { id: 'new', label: 'New Listing' },
  { id: 'gainers', label: 'Top Gainers' },
]

interface Props {
  coins: MarketCoin[]
}

function filterCoins(coins: MarketCoin[], tab: MarketTab): MarketCoin[] {
  switch (tab) {
    case 'favorite':
      return coins.filter((c) => c.favorite)
    case 'gainers':
      return [...coins].sort((a, b) => b.changePct - a.changePct)
    case 'hot':
      return [...coins].sort(
        (a, b) => Math.abs(b.changePct) - Math.abs(a.changePct),
      )
    case 'new':
      return coins.slice(-6)
    case 'trending':
    default:
      return coins
  }
}

function CoinRow({ coin }: { coin: MarketCoin }) {
  const dir = coin.changePct >= 0 ? 'green' : 'red'
  const sign = coin.changePct >= 0 ? '+' : ''
  return (
    <tr>
      <td>
        <div className="td_first">
          <span
            className={`star_btn btn_icon${coin.favorite ? ' active' : ''}`}
          >
            <i
              className={`ri ${coin.favorite ? 'ri-star-fill text-warning' : 'ri-star-line'} me-2`}
            />
          </span>
          <div className="icon">
            <img src={coin.icon} height="30px" alt={coin.symbol} />
          </div>
          <div className="price_heading">
            {coin.symbol} <br />
            <span>{coin.name}</span>
          </div>
        </div>
      </td>
      <td>
        {coin.price} <br />
        <span className="fontWeight">USDT</span>
      </td>
      <td>{coin.high}</td>
      <td className={dir}>
        {sign}
        {coin.changePct}%
      </td>
      <td className="right_t">
        <Link to={`/trade/${coin.pair}`}>Trade</Link>
      </td>
    </tr>
  )
}

function CoinRowMobile({ coin }: { coin: MarketCoin }) {
  const dir = coin.changePct >= 0 ? 'green' : 'red'
  const sign = coin.changePct >= 0 ? '+' : ''
  return (
    <tr>
      <td>
        <div className="td_first">
          <div className="icon">
            <img src={coin.icon} height="30px" alt={coin.symbol} />
          </div>
          <div className="price_heading">
            {coin.symbol} <br />
            <span>{coin.name}</span>
          </div>
        </div>
      </td>
      <td>
        {coin.price} <br />
        <span className="fontWeight">USDT</span>
      </td>
      <td className="right_t">
        {coin.high}
        <div className={dir}>
          {sign}
          {coin.changePct}%
        </div>
      </td>
    </tr>
  )
}

export function SpotMarketsCard({ coins }: Props) {
  const [activeTab, setActiveTab] = useState<MarketTab>('trending')
  const filtered = filterCoins(coins, activeTab)

  return (
    <div className="market_section maindashboard">
      <div className="top_heading">
        <h4>Spot Markets</h4>
        <Link className="more_btn" to="/market">
          More {'>'}
        </Link>
      </div>
      <div className="dashboard_summary">
        <ul className="nav nav-tabs" role="tablist">
          {TABS.map((tab) => (
            <li key={tab.id} className="nav-item" role="presentation">
              <button
                type="button"
                className={`nav-link${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          <div className="tab-pane fade show active" role="tabpanel">
            <div className="desktop_view">
              <div className="table-responsive">
                {filtered.length === 0 ? (
                  <div className="py-4 text-center">
                    <img
                      src="/images/no-data.svg"
                      alt="No data"
                      style={{ width: 120, opacity: 0.6 }}
                    />
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Coin</th>
                        <th>Price</th>
                        <th>24H High</th>
                        <th>24H Change</th>
                        <th className="right_t">Trade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((coin) => (
                        <CoinRow key={coin.symbol} coin={coin} />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <div className="mobile_view">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Coin</th>
                      <th>Price</th>
                      <th className="right_t">24 High/Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((coin) => (
                      <CoinRowMobile key={coin.symbol} coin={coin} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
