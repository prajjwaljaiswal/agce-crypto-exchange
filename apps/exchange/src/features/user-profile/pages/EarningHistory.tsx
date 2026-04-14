const PLANS = [
  {
    id: 1,
    currency: 'USDT',
    wallet: 'Flexible',
    duration: '—',
    start: '2026-03-01',
    mature: '—',
    subscription: '2000.00',
    bonus: '12.45',
    receivable: '2012.45',
    status: 'ACTIVE',
  },
  {
    id: 2,
    currency: 'BTC',
    wallet: 'Locked',
    duration: '30 Days',
    start: '2026-02-10',
    mature: '2026-03-12',
    subscription: '0.0500',
    bonus: '0.00065',
    receivable: '0.05065',
    status: 'COMPLETED',
  },
]

export function EarningHistory() {
  return (
    <div className="dashboard_right">
    <div className="dashboard_listing_section Overview_mid">
      <div className="listing_left_outer full_width transaction_history_t desktop_view2">
        <div className="market_section spotorderhist">
          <div className="top_heading">
            <h4>Internal Wallet Transfer History</h4>
            <div className="coin_right">
              <div className="searchBar custom-tabs">
                <i className="ri-search-2-line"></i>
                <input
                  type="search"
                  className="custom_search"
                  placeholder="Search Crypto"
                  defaultValue=""
                />
              </div>
            </div>
          </div>

          <div className="dashboard_summary">
            <table>
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Date</th>
                  <th>Currency</th>
                  <th>Wallet</th>
                  <th className="right_td">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1 </td>
                  <td>2026-04-09 10:30 AM </td>
                  <td>
                    <div className="td_first">
                      <div className="price_heading">1250.5 USDT </div>
                    </div>
                  </td>
                  <td>
                    {" "}
                    Spot Wallet <i className="ri-arrow-right-double-line"></i>  Main Wallet
                  </td>
                  <td className="right_td green">Completed</td>
                </tr>
                <tr>
                  <td>2 </td>
                  <td>2026-04-08 03:15 PM </td>
                  <td>
                    <div className="td_first">
                      <div className="price_heading">0.025 BTC </div>
                    </div>
                  </td>
                  <td>
                    {" "}
                    Main Wallet <i className="ri-arrow-right-double-line"></i>  Spot Wallet
                  </td>
                  <td className="right_td yellow">PENDING</td>
                </tr>
                <tr>
                  <td>3 </td>
                  <td>2026-04-07 09:00 AM </td>
                  <td>
                    <div className="td_first">
                      <div className="price_heading">1.5 ETH </div>
                    </div>
                  </td>
                  <td>
                    {" "}
                    Spot Wallet <i className="ri-arrow-right-double-line"></i>  Futures Wallet
                  </td>
                  <td className="right_td red">REJECTED</td>
                </tr>
              </tbody>
            </table>

            <div className="hVPalX gap-2">
              <span>1-3 of 3</span>
              <div className="sc-eAKtBH gVtWSU">
                <button type="button" aria-label="First Page" className="sc-gjLLEI kuPCgf">
                  <i className="ri-skip-back-fill text-white"></i>
                </button>
                <button type="button" aria-label="Previous Page" className="sc-gjLLEI kuPCgf">
                  <i className="ri-arrow-left-s-line text-white"></i>
                </button>
                <button type="button" aria-label="Next Page" className="sc-gjLLEI kuPCgf">
                  <i className="ri-arrow-right-s-line text-white"></i>
                </button>
                <button type="button" aria-label="Last Page" className="sc-gjLLEI kuPCgf">
                  <i className="ri-skip-forward-fill text-white"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="order_history_mobile_view">
        <div className="coin_right d-flex flex-row justify-content-between align-items-center p-0">
          <h5>Internal Wallet Transfer History</h5>
          <div className="d-flex flex-row justify-content-end align-items-end mb-3">
            <div className="searchBar custom-tabs">
              <i className="ri-search-2-line"></i>
              <input
                type="search"
                className="custom_search"
                placeholder="Search Crypto"
                defaultValue=""
              />
            </div>
          </div>
        </div>

        <div className="d-flex mb-3">
          <div className="order_datalist order_datalist_2">
            <ul className="listdata">
              <li>
                <span className="date">USDT</span>
                <span className="date_light">09/04/2026, 10:30 AM</span>
              </li>
              <li>
                <span>Amount</span>
                <span>1250.5 USDT</span>
              </li>
              <li>
                <span>Transfer</span>
                <span>Spot → Main</span>
              </li>
              <li>
                <span>Status</span>
                <span className="text-success">Completed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="d-flex mb-3">
          <div className="order_datalist order_datalist_2">
            <ul className="listdata">
              <li>
                <span className="date">BTC</span>
                <span className="date_light">08/04/2026, 03:15 PM</span>
              </li>
              <li>
                <span>Amount</span>
                <span>0.025 BTC</span>
              </li>
              <li>
                <span>Transfer</span>
                <span>Main → Spot</span>
              </li>
              <li>
                <span>Status</span>
                <span className="text-warning">PENDING</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="d-flex mb-3">
          <div className="order_datalist order_datalist_2">
            <ul className="listdata">
              <li>
                <span className="date">ETH</span>
                <span className="date_light">07/04/2026, 09:00 AM</span>
              </li>
              <li>
                <span>Amount</span>
                <span>1.5 ETH</span>
              </li>
              <li>
                <span>Transfer</span>
                <span>Spot → Futures</span>
              </li>
              <li>
                <span>Status</span>
                <span className="text-danger">REJECTED</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="hVPalX gap-2 mt-3">
          <span>1-3 of 3</span>
          <div className="sc-eAKtBH gVtWSU">
            <button type="button" aria-label="First Page" className="sc-gjLLEI kuPCgf">
              <i className="ri-skip-back-fill text-white"></i>
            </button>
            <button type="button" aria-label="Previous Page" className="sc-gjLLEI kuPCgf">
              <i className="ri-arrow-left-s-line text-white"></i>
            </button>
            <button type="button" aria-label="Next Page" className="sc-gjLLEI kuPCgf">
              <i className="ri-arrow-right-s-line text-white"></i>
            </button>
            <button type="button" aria-label="Last Page" className="sc-gjLLEI kuPCgf">
              <i className="ri-skip-forward-fill text-white"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
