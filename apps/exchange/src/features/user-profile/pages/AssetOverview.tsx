import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInstanceConfig } from '@agce/hooks'
import { useEstimatedBalance } from '../hooks/useEstimatedBalance.js'
import { coinDisplayName, coinIconSrc } from '../../Market/marketFormat.js'
import type { EstimatedBalanceAsset } from '../../../lib/matching-api.js'

const FALLBACK_ASSET_ICON = '/images/coin_icon.svg'

function resolveIconUrl(iconPath: string | undefined, asset: string): string {
  if (!iconPath) return coinIconSrc(asset)
  if (/^https?:\/\//i.test(iconPath)) return iconPath
  const env = import.meta.env as Record<string, string | undefined>
  const base = (env.VITE_MATCHING_API_URL ?? env.VITE_AUTH_API_URL ?? '').replace(/\/+$/, '')
  if (!base) return iconPath
  return `${base}${iconPath.startsWith('/') ? iconPath : `/${iconPath}`}`
}

function formatAmount(raw: string | undefined, maxDecimals = 8): string {
  if (!raw) return '0'
  const n = Number(raw)
  if (!Number.isFinite(n)) return '0'
  const decimals = Math.abs(n) >= 1 ? Math.min(maxDecimals, 4) : maxDecimals
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  })
}

const ACCOUNT_ROWS = [
  { account: 'Main Wallet', amount: '8,450.23 USDT', ratio: '58%' },
  { account: 'Spot Wallet', amount: '4,250.12 USDT', ratio: '29%' },
  { account: 'Swap Wallet', amount: '1,200.50 USDT', ratio: '8%' },
  { account: 'Earning Wallet', amount: '665.27 USDT', ratio: '5%' },
]

export function AssetOverview() {
  const instance = useInstanceConfig()
  const { data, isLoading, error } = useEstimatedBalance()
  const [hidden, setHidden] = useState(false)
  const [search, setSearch] = useState('')
  const [hideZero, setHideZero] = useState(false)

  const total = formatAmount(data?.totalValue)
  const currency = data?.preferredCurrency ?? 'USDT'

  const usdValue = useMemo<number | null>(() => {
    const raw = data?.totalValueInUSD
    if (!raw) return null
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  }, [data?.totalValueInUSD])

  const rows = useMemo<EstimatedBalanceAsset[]>(() => {
    const list = data?.assets ?? []
    const q = search.trim().toUpperCase()
    return list.filter((a) => {
      if (hideZero && Number(a.total) <= 0) return false
      if (q && !a.asset.toUpperCase().includes(q)) return false
      return true
    })
  }, [data?.assets, search, hideZero])

  const displayTotal = hidden ? '••••••' : `${total} ${currency}`

  return (
    <div className="dashboard_right">
      <div className="row">
        <div className="col-sm-12">
          <div className="overview_section">
            <div className="estimated_balance">
              <h6>
                Estimated Balance
                <button
                  type="button"
                  onClick={() => setHidden((v) => !v)}
                  aria-label={hidden ? 'Show balance' : 'Hide balance'}
                >
                  <i className={hidden ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </button>
              </h6>
              <div className="wallet-header d-flex flex-wrap align-items-center justify-content-between">
                <div>
                  <div className="wallet-title">
                    {isLoading ? '—' : error ? 'Unavailable' : displayTotal}
                  </div>
                  <div className="wallet-sub mt-1">
                    ≈{' '}
                    {hidden
                      ? '••••••'
                      : usdValue !== null
                        ? `${formatAmount(String(usdValue))} USD`
                        : '—'}
                    {instance.fiat.currency &&
                      instance.fiat.currency.toUpperCase() !== 'USD' && (
                        <>
                          {' '}/{' '}
                          {hidden
                            ? '••••••'
                            : usdValue !== null
                              ? `${formatAmount(String(usdValue))} ${instance.fiat.currency}`
                              : '—'}
                        </>
                      )}
                    <Link
                      to="/asset_management/deposit"
                      className="cursor-pointer ms-2"
                    >
                      Deposit crypto instantly with one-click{' '}
                      <i className="ri-arrow-right-s-line" />
                    </Link>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3 mt-md-0">
                  <Link
                    to="/asset_management/deposit"
                    className="btn btn-deposit px-4"
                  >
                    Deposit
                  </Link>
                  <Link
                    to="/asset_management/withdraw"
                    className="btn btn-outline-custom px-4"
                  >
                    Withdraw
                  </Link>
                  <button type="button" className="btn btn-outline-custom px-4">
                    Transfer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard_listing_section Overview_mid">
        <div className="assets_wallets_section">
          <div className="row">
            <div className="col-sm-12">
              <div className="market_section">
                <div className="coin_view_top">
                  <div className="wallet_tabs">
                    <button type="button" className="tab_btn active">
                      Crypto
                    </button>
                    <button type="button" className="tab_btn">
                      Account
                    </button>
                  </div>
                  <div className="coin_right">
                    <div className="searchBar custom-tabs">
                      <i className="ri-search-2-line" />
                      <input
                        type="search"
                        className="custom_search"
                        placeholder="Search Crypto"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        checked={hideZero}
                        onChange={(e) => setHideZero(e.target.checked)}
                      />{' '}
                      Hide 0 Balance
                    </div>
                  </div>
                </div>

                <div className="dashboard_summary">
                  <div className="desktop_view">
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Coin</th>
                            <th>Available Balance</th>
                            <th>In-Order Balance</th>
                            <th>Total Balance</th>
                            <th>Value ({currency})</th>
                            <th>Value (USD)</th>
                            <th className="right_td">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading && (
                            <tr>
                              <td colSpan={7} style={{ textAlign: 'center' }}>
                                Loading…
                              </td>
                            </tr>
                          )}
                          {!isLoading && error && (
                            <tr>
                              <td colSpan={7} style={{ textAlign: 'center' }}>
                                Could not load balances.
                              </td>
                            </tr>
                          )}
                          {!isLoading && !error && rows.length === 0 && (
                            <tr>
                              <td colSpan={7} style={{ textAlign: 'center' }}>
                                No assets to show.
                              </td>
                            </tr>
                          )}
                          {!isLoading &&
                            !error &&
                            rows.map((row) => (
                              <tr key={row.asset}>
                                <td>
                                  <div className="td_first">
                                    <div className="icon">
                                      <img
                                        src={resolveIconUrl(row.iconPath, row.asset)}
                                        height="30"
                                        alt={row.asset}
                                        onError={(e) => {
                                          const img = e.currentTarget
                                          img.onerror = null
                                          img.src = FALLBACK_ASSET_ICON
                                        }}
                                      />
                                    </div>
                                    <div className="price_heading">
                                      {row.asset}
                                      <br />
                                      <span>{coinDisplayName(row.asset)}</span>
                                    </div>
                                  </div>
                                </td>
                                <td>{formatAmount(row.free)}</td>
                                <td>{formatAmount(row.locked)}</td>
                                <td>{formatAmount(row.total)}</td>
                                <td>
                                  {hidden
                                    ? '••••••'
                                    : formatAmount(row.valueInPreferredCurrency)}
                                </td>
                                <td>
                                  {hidden
                                    ? '••••••'
                                    : row.valueInUSD
                                      ? formatAmount(row.valueInUSD)
                                      : '—'}
                                </td>
                                <td className="right_td">
                                  <div className="d-flex gap-3 justify-content-end">
                                    <Link to="/asset_management/deposit">
                                      Deposit
                                    </Link>
                                    <Link to="/asset_management/withdraw">
                                      Withdraw
                                    </Link>
                                    <Link to={`/trade/${row.asset}_USDT`}>
                                      Trade
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-sm-12">
            <div className="market_section">
              <div className="top_heading">
                <h4>Account Distribution</h4>
              </div>
              <div className="dashboard_summary dummy_tab account_table">
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Amount</th>
                        <th>Ratio</th>
                        <th className="right_td">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ACCOUNT_ROWS.map((row) => (
                        <tr key={row.account}>
                          <td>{row.account}</td>
                          <td>{row.amount}</td>
                          <td>{row.ratio}</td>
                          <td className="right_td">
                            <div className="d-flex gap-3 justify-content-end">
                              <button type="button" className="btn btn-link">
                                Transfer
                              </button>
                              <Link to="/user_profile/transaction_history">
                                History
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
