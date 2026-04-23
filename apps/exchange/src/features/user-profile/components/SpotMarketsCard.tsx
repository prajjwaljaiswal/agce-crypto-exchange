import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../Market/useFavorites.js'
import type { MarketCoin, MarketTab } from '../types.js'

const TABS: { id: MarketTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'favorite', label: 'Favorite' },
  { id: 'trending', label: 'Trending' },
  { id: 'hot', label: 'Hot' },
  { id: 'new', label: 'New Listing' },
  { id: 'gainers', label: 'Top Gainers' },
]

const TAB_TO_CATEGORY: Partial<Record<MarketTab, string>> = {
  trending: 'trending',
  hot: 'hot',
  new: 'new_listing',
  gainers: 'top_gainers',
}

interface Props {
  coins: MarketCoin[]
  categories: Record<string, string[]>
}

function favSymbol(coin: MarketCoin): string {
  return coin.pair.replace('_', '-')
}

function filterCoins(
  coins: MarketCoin[],
  tab: MarketTab,
  categories: Record<string, string[]>,
  isFavorite: (s: string) => boolean,
): MarketCoin[] {
  if (tab === 'all') return coins
  if (tab === 'favorite') return coins.filter((c) => isFavorite(favSymbol(c)))

  const catKey = TAB_TO_CATEGORY[tab]
  if (catKey && categories[catKey]?.length) {
    const symbolSet = new Set(categories[catKey])
    const ordered = categories[catKey]
      .map((sym) => coins.find((c) => c.pair.startsWith(sym) || c.symbol === sym))
      .filter((c): c is MarketCoin => Boolean(c))
    const seen = new Set(ordered.map((c) => c.symbol))
    const extra = coins.filter((c) => symbolSet.has(c.symbol) && !seen.has(c.symbol))
    return [...ordered, ...extra]
  }

  return coins
}

function CoinRow({ coin, isFav, onToggle }: { coin: MarketCoin; isFav: boolean; onToggle: () => void }) {
  const dir = coin.changePct >= 0 ? 'green' : 'red'
  const sign = coin.changePct >= 0 ? '+' : ''
  return (
    <tr>
      <td>
        <div className="td_first">
          <button
            type="button"
            className={`star_btn btn_icon${isFav ? ' active' : ''}`}
            onClick={onToggle}
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <i className={`ri ${isFav ? 'ri-star-fill text-warning' : 'ri-star-line'} me-2`} />
          </button>
          <div className="icon">
            {coin.icon ? (
              <img src={coin.icon} height="30px" alt={coin.symbol}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: '50%', background: '#2a2a2a', color: '#e5b64a', fontWeight: 700, fontSize: 12 }}>
                {coin.symbol.charAt(0)}
              </span>
            )}
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
      <td>
        <span className="green">{coin.high}</span>
      </td>
      <td className={dir}>
        {sign}{coin.changePct}%
      </td>
      <td className="right_t">
        <Link to={`/trade/${coin.pair}`}>Trade</Link>
      </td>
    </tr>
  )
}

function CoinRowMobile({ coin, isFav, onToggle }: { coin: MarketCoin; isFav: boolean; onToggle: () => void }) {
  const dir = coin.changePct >= 0 ? 'green' : 'red'
  const sign = coin.changePct >= 0 ? '+' : ''
  return (
    <tr>
      <td>
        <div className="td_first">
          <button
            type="button"
            className={`star_btn btn_icon${isFav ? ' active' : ''}`}
            onClick={onToggle}
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <i className={`ri ${isFav ? 'ri-star-fill text-warning' : 'ri-star-line'} me-2`} />
          </button>
          <div className="icon">
            {coin.icon ? (
              <img src={coin.icon} height="30px" alt={coin.symbol}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: '50%', background: '#2a2a2a', color: '#e5b64a', fontWeight: 700, fontSize: 12 }}>
                {coin.symbol.charAt(0)}
              </span>
            )}
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
        <span className="green">{coin.high}</span>
        <div className={dir}>
          {sign}{coin.changePct}%
        </div>
      </td>
    </tr>
  )
}

export function SpotMarketsCard({ coins, categories }: Props) {
  const [activeTab, setActiveTab] = useState<MarketTab>('all')
  const { isFavorite, toggleFavorite } = useFavorites()
  const filtered = filterCoins(coins, activeTab, categories, isFavorite)

  return (
    <div className="market_section maindashboard">
      <div className="top_heading">
        <h4>Spot Markets</h4>
        <Link className="more_btn" to="/market">More {'>'}</Link>
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
                    <img src="/images/no-data.svg" alt="No data" style={{ width: 120, opacity: 0.6 }} />
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
                        <CoinRow
                          key={coin.symbol}
                          coin={coin}
                          isFav={isFavorite(favSymbol(coin))}
                          onToggle={() => toggleFavorite(favSymbol(coin))}
                        />
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
                      <CoinRowMobile
                          key={coin.symbol}
                          coin={coin}
                          isFav={isFavorite(favSymbol(coin))}
                          onToggle={() => toggleFavorite(favSymbol(coin))}
                        />
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
