import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { MOCK_HOT_PAIRS, MOCK_NEW_LISTINGS, MOCK_TOP_GAINERS } from '../data.js'
import type { TrendingPair } from '../types.js'
import { formatLandingPercent, formatLandingUsd } from '../utils.js'

interface RowProps {
  item: TrendingPair
  iconWidth?: number
  onClick: (item: TrendingPair) => void
}

function TrendingRow({ item, iconWidth = 28, onClick }: RowProps) {
  return (
    <tr onClick={() => onClick(item)}>
      <td className="first_coloum">
        <div className="td_first landing_pair_row">
          <div className="icon">
            <img
              alt={item.baseCurrency}
              src={item.iconSrc || '/images/option-img/btc_icon.svg'}
              width={iconWidth}
              height={iconWidth}
              className="img-fluid icon_img coinimg"
            />
          </div>
          <div className="landing_pair_names">
            <span className="landing_pair_symbol">{item.baseCurrency}</span>
            <span className="landing_pair_sub">{item.assetName}</span>
          </div>
        </div>
      </td>
      <td className="price_right_top text-end">
        <div className="landing_pair_price_stack">
          <span className="landing_pair_price">{formatLandingUsd(item.buyPrice)}</span>
          <span
            className={`landing_pair_chg ${item.changePercentage >= 0 ? 'green' : 'red'}`}
          >
            {formatLandingPercent(item.changePercentage)}
          </span>
        </div>
      </td>
    </tr>
  )
}

interface PanelProps {
  id: string
  labelledBy: string
  title: string
  pairs: TrendingPair[]
  iconWidth: number
  highlight?: boolean
  isActive: boolean
  onRowClick: (item: TrendingPair) => void
}

function TrendingPanel({
  id,
  labelledBy,
  title,
  pairs,
  iconWidth,
  highlight,
  isActive,
  onRowClick,
}: PanelProps) {
  const className = [
    'hot_spot_outer',
    highlight ? 'hot_spot_outer--highlight' : '',
    isActive ? 'active' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} className={className}>
      <div className="top_heading">
        <h4>{title}</h4>
      </div>
      <div className="hot_trading_s">
        <div className="table-responsive">
          <table>
            <tbody>
              {pairs.length > 0 ? (
                pairs.map((item) => (
                  <TrendingRow
                    key={item.id}
                    item={item}
                    iconWidth={iconWidth}
                    onClick={onRowClick}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-0">
                    <div className="favouriteData text-center">
                      <img
                        src="/images/no_data_vector.svg"
                        className="img-fluid dark_img"
                        width={96}
                        height={96}
                        alt="no data"
                      />
                      <img
                        src="/images/no_data_vector_light.png"
                        className="img-fluid light_img"
                        width={96}
                        height={96}
                        alt="no data"
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function TrendingCrypto() {
  const navigate = useNavigate()
  const [activeMobileTab, setActiveMobileTab] = useState(0)

  const onRowClick = (item: TrendingPair) => {
    if (!item.baseCurrency || !item.quoteCurrency) return
    try {
      localStorage.setItem('RecentPair', JSON.stringify(item))
    } catch {
      /* noop */
    }
    navigate(`/trade/${item.baseCurrency}_${item.quoteCurrency}`)
  }

  return (
    <div className="crypto_section trending_crypto">
      <div className="container">
        <div className="features_bage">Platform Features</div>
        <h2>Trending Cryptocurrencies</h2>
        <p>Trade 1,000+ cryptocurrencies in real time.</p>

        <div
          className="trending_crypto_tabs"
          role="tablist"
          aria-label="Trending categories"
        >
          <button
            type="button"
            role="tab"
            id="trending-tab-hot"
            aria-selected={activeMobileTab === 0}
            aria-controls="trending-panel-hot"
            className={activeMobileTab === 0 ? 'active' : ''}
            onClick={() => setActiveMobileTab(0)}
          >
            Hot
          </button>
          <button
            type="button"
            role="tab"
            id="trending-tab-new"
            aria-selected={activeMobileTab === 1}
            aria-controls="trending-panel-new"
            className={activeMobileTab === 1 ? 'active' : ''}
            onClick={() => setActiveMobileTab(1)}
          >
            New Coins
          </button>
          <button
            type="button"
            role="tab"
            id="trending-tab-gainers"
            aria-selected={activeMobileTab === 2}
            aria-controls="trending-panel-gainers"
            className={activeMobileTab === 2 ? 'active' : ''}
            onClick={() => setActiveMobileTab(2)}
          >
            Top Gainers
          </button>
        </div>

        <div className="crypto_dashboard">
          <TrendingPanel
            id="trending-panel-hot"
            labelledBy="trending-tab-hot"
            title="Hot"
            pairs={MOCK_HOT_PAIRS}
            iconWidth={28}
            highlight
            isActive={activeMobileTab === 0}
            onRowClick={onRowClick}
          />
          <TrendingPanel
            id="trending-panel-new"
            labelledBy="trending-tab-new"
            title="New Coins"
            pairs={MOCK_NEW_LISTINGS}
            iconWidth={30}
            isActive={activeMobileTab === 1}
            onRowClick={onRowClick}
          />
          <TrendingPanel
            id="trending-panel-gainers"
            labelledBy="trending-tab-gainers"
            title="Top Gainers"
            pairs={MOCK_TOP_GAINERS}
            iconWidth={30}
            isActive={activeMobileTab === 2}
            onRowClick={onRowClick}
          />
        </div>

        <div className="viewmorebtn">
          <NavLink to="/market">
            View More <i className="ri-arrow-right-line" />
          </NavLink>
        </div>
      </div>
    </div>
  )
}
