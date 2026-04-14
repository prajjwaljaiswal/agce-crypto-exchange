const SWAPS = [
  {
    id: 1,
    date: '2026-04-14 11:20:44',
    paid: '1000.00 USDT',
    received: '0.01487 BTC',
    rate: '1 BTC = 67250.12 USDT',
    fee: '1.00 USDT',
    status: 'SUCCESS',
  },
  {
    id: 2,
    date: '2026-04-13 15:42:11',
    paid: '500.00 USDT',
    received: '0.1449 ETH',
    rate: '1 ETH = 3450.45 USDT',
    fee: '0.50 USDT',
    status: 'SUCCESS',
  },
]

export function SwapHistory() {
  return (
    <div className="dashboard_right">
    <div className="dashboard_listing_section Overview_mid">
      <div className="listing_left_outer full_width transaction_history_t desktop_view2">
        <div className="market_section spotorderhist">
          <div className="top_heading">
            <h4>Swap History</h4>
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
                  <th>Date/Time</th>
                  <th>Paid Amount</th>
                  <th>Received Amount</th>
                  <th>Conversion Rate</th>
                  <th>Fee</th>
                  <th className="right_td">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <div className="c_view justify-content-start">
                      <span>
                        09/04/2026
                        <small>11:20 AM</small>
                      </span>
                    </div>
                  </td>
                  <td>1000 USDT</td>
                  <td>0.01485 BTC </td>
                  <td>1 USDT =  0.00001485 BTC</td>
                  <td>0.00002 BTC</td>
                  <td className="right_td">
                    <strong className="text-success">Completed</strong>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <div className="c_view justify-content-start">
                      <span>
                        08/04/2026
                        <small>04:05 PM</small>
                      </span>
                    </div>
                  </td>
                  <td>2.5 ETH</td>
                  <td>8125.5 USDT </td>
                  <td>1 ETH =  3250.2 USDT</td>
                  <td>3.25 USDT</td>
                  <td className="right_td">
                    <strong className="text-success">Completed</strong>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <div className="c_view justify-content-start">
                      <span>
                        07/04/2026
                        <small>09:30 AM</small>
                      </span>
                    </div>
                  </td>
                  <td>0.05 BTC</td>
                  <td>1450 SOL </td>
                  <td>1 BTC =  29000 SOL</td>
                  <td>1.45 SOL</td>
                  <td className="right_td">
                    <strong className="text-danger">Failed</strong>
                  </td>
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
          <h5>Swap History</h5>
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
          <div className="order_datalist">
            <ul className="listdata">
              <li>
                <span className="date">USDT → BTC</span>
                <span className="date_light">09/04/2026, 11:20 AM</span>
              </li>
              <li>
                <span>Paid Amount</span>
                <span>1000 USDT</span>
              </li>
              <li>
                <span>Received Amount</span>
                <span>0.01485 BTC</span>
              </li>
              <li>
                <span>Status</span>
                <span className="text-success">Completed</span>
              </li>
              <li>
                <span>Conversion Rate</span>
                <span>1 USDT =  0.00001485 BTC</span>
              </li>
              <li>
                <span>Fee</span>
                <span>0.00002 BTC</span>
              </li>
            </ul>
            <button type="button" className="view_more_btn">
              <i className="ri-arrow-down-s-line"></i>
            </button>
          </div>
        </div>

        <div className="d-flex mb-3">
          <div className="order_datalist">
            <ul className="listdata">
              <li>
                <span className="date">ETH → USDT</span>
                <span className="date_light">08/04/2026, 04:05 PM</span>
              </li>
              <li>
                <span>Paid Amount</span>
                <span>2.5 ETH</span>
              </li>
              <li>
                <span>Received Amount</span>
                <span>8125.5 USDT</span>
              </li>
              <li>
                <span>Status</span>
                <span className="text-success">Completed</span>
              </li>
              <li>
                <span>Conversion Rate</span>
                <span>1 ETH =  3250.2 USDT</span>
              </li>
              <li>
                <span>Fee</span>
                <span>3.25 USDT</span>
              </li>
            </ul>
            <button type="button" className="view_more_btn">
              <i className="ri-arrow-down-s-line"></i>
            </button>
          </div>
        </div>

        <div className="d-flex mb-3">
          <div className="order_datalist">
            <ul className="listdata">
              <li>
                <span className="date">BTC → SOL</span>
                <span className="date_light">07/04/2026, 09:30 AM</span>
              </li>
              <li>
                <span>Paid Amount</span>
                <span>0.05 BTC</span>
              </li>
              <li>
                <span>Received Amount</span>
                <span>1450 SOL</span>
              </li>
              <li>
                <span>Status</span>
                <span className="text-danger">Failed</span>
              </li>
              <li>
                <span>Conversion Rate</span>
                <span>1 BTC =  29000 SOL</span>
              </li>
              <li>
                <span>Fee</span>
                <span>1.45 SOL</span>
              </li>
            </ul>
            <button type="button" className="view_more_btn">
              <i className="ri-arrow-down-s-line"></i>
            </button>
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
