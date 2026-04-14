import { Link } from 'react-router-dom'

interface WalletRow {
  coin: string
  name: string
  icon: string
  available: string
  inOrder: string
  total: string
}

const CRYPTO_ROWS: WalletRow[] = [
  {
    coin: 'USDT',
    name: 'Tether',
    icon: '/images/dollaricon.svg',
    available: '12580.45',
    inOrder: '120',
    total: '12700.45',
  },
  {
    coin: 'BTC',
    name: 'Bitcoin',
    icon: '/images/option-img/btc_icon.svg',
    available: '0.1245',
    inOrder: '0',
    total: '0.1245',
  },
  {
    coin: 'ETH',
    name: 'Ethereum',
    icon: '/images/wallet_coins_balance.svg',
    available: '1.8760',
    inOrder: '0.25',
    total: '2.1260',
  },
]

const ACCOUNT_ROWS = [
  { account: 'Main Wallet', amount: '8,450.23 USDT', ratio: '58%' },
  { account: 'Spot Wallet', amount: '4,250.12 USDT', ratio: '29%' },
  { account: 'Swap Wallet', amount: '1,200.50 USDT', ratio: '8%' },
  { account: 'Earning Wallet', amount: '665.27 USDT', ratio: '5%' },
]

export function AssetOverview() {
  return (
    <div className="dashboard_right">
      <div className="row">
        <div className="col-sm-10">
          <div className="overview_section">
            <div className="estimated_balance">
              <h6>
                Estimated Balance
                <button type="button">
                  <i className="ri-eye-line" />
                </button>
              </h6>
              <div className="wallet-header d-flex flex-wrap align-items-center justify-content-between">
                <div>
                  <div className="wallet-title">14566.12 USDT</div>
                  <div className="wallet-sub mt-1">
                    ≈ 1202100.75 INR
                    <Link
                      to="/asset_managemnet/deposit"
                      className="cursor-pointer"
                    >
                      Deposit crypto instantly with one-click{' '}
                      <i className="ri-arrow-right-s-line" />
                    </Link>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3 mt-md-0">
                  <Link
                    to="/asset_managemnet/deposit"
                    className="btn btn-deposit px-4"
                  >
                    Deposit
                  </Link>
                  <Link
                    to="/asset_managemnet/withdraw"
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
            <div className="col-sm-10">
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
                      />
                    </div>
                    <div className="checkbox">
                      <input type="checkbox" /> Hide 0 Balance
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
                            <th className="right_td">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CRYPTO_ROWS.map((row) => (
                            <tr key={row.coin}>
                              <td>
                                <div className="td_first">
                                  <div className="icon">
                                    <img
                                      src={row.icon}
                                      height="30"
                                      alt={row.coin}
                                    />
                                  </div>
                                  <div className="price_heading">
                                    {row.coin}
                                    <br />
                                    <span>{row.name}</span>
                                  </div>
                                </div>
                              </td>
                              <td>{row.available}</td>
                              <td>{row.inOrder}</td>
                              <td>{row.total}</td>
                              <td className="right_td">
                                <div className="d-flex gap-3 justify-content-end">
                                  <Link to="/asset_managemnet/deposit">
                                    Deposit
                                  </Link>
                                  <Link to="/asset_managemnet/withdraw">
                                    Withdraw
                                  </Link>
                                  <Link to={`/trade/${row.coin}_USDT`}>
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
          <div className="col-sm-10">
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
