const OPEN_ORDERS = [
  {
    id: 1,
    date: '2026-04-14 09:12:44',
    pair: 'BTC/USDT',
    side: 'Buy',
    price: '66000.00',
    qty: '0.05',
    filled: '0',
    total: '3300.00',
    status: 'Open',
  },
  {
    id: 2,
    date: '2026-04-14 08:25:09',
    pair: 'ETH/USDT',
    side: 'Sell',
    price: '3500.00',
    qty: '0.4',
    filled: '0.1',
    total: '1400.00',
    status: 'Partial',
  },
]

export function OpenOrders() {
  return (
    <div className="dashboard_right">
    <div className="dashboard_listing_section Overview_mid">
      <div className="listing_left_outer full_width transaction_history_t desktop_view2">
        <div className="market_section spotorderhist">
          <div className="top_heading">
            <h4>Open orders </h4>
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
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Date/Time</th>
                    <th>Currency Pair</th>
                    <th>Side</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Filled</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="right_td">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <div className=" justify-content-start">
                        <span>
                          09/04/2026
                          <small>10:30 AM</small>
                        </span>
                      </div>
                    </td>
                    <td>BTC/USDT</td>
                    <td>BUY</td>
                    <td>67250.123456</td>
                    <td>0.05</td>
                    <td>0</td>
                    <td>3362.506172</td>
                    <td>OPEN</td>
                    <td className="right_td">
                      <button
                        className="btn text-danger btn-sm btn-icon"
                        type="button" title="Cancel order">
                        <i className="ri-delete-bin-6-line pr-0"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <div className=" justify-content-start">
                        <span>
                          08/04/2026
                          <small>02:15 PM</small>
                        </span>
                      </div>
                    </td>
                    <td>ETH/USDT</td>
                    <td>SELL</td>
                    <td>3250.8</td>
                    <td>1.25</td>
                    <td>0.4</td>
                    <td>4063.5</td>
                    <td>PARTIALLY_FILLED</td>
                    <td className="right_td">
                      <button
                        className="btn text-danger btn-sm btn-icon"
                        type="button"
                        title="Cancel order"
                      >
                        <i className="ri-delete-bin-6-line pr-0"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <div className=" justify-content-start">
                        <span>
                          07/04/2026
                          <small>09:00 AM</small>
                        </span>
                      </div>
                    </td>
                    <td>SOL/USDT</td>
                    <td>BUY</td>
                    <td>145.75</td>
                    <td>50</td>
                    <td>0</td>
                    <td>7287.5</td>
                    <td>OPEN</td>
                    <td className="right_td">
                      <button
                        className="btn text-danger btn-sm btn-icon"
                        type="button"
                        title="Cancel order"
                      >
                        <i className="ri-delete-bin-6-line pr-0"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

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
          <h5>Open orders</h5>
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
        <div className="d-flex">
          <div className="order_datalist">
            <ul className="listdata">
              <li>
                <span className="date">Date</span>
                <span className="date_light">09/04/2026</span>
              </li>
              <li>
                <span>Time</span>
                <span>10:30 AM</span>
              </li>
              <li>
                <span>Currency Pair</span>
                <span>BTC/USDT</span>
              </li>
              <li>
                <span>Side</span>
                <span>BUY</span>
              </li>
              <li>
                <span>Price</span>
                <span>67250.123456</span>
              </li>
              <li>
                <span>Quantity</span>
                <span>0.05</span>
              </li>
              <li>
                <span>Filled</span>
                <span>0</span>
              </li>
              <li>
                <span>Total</span>
                <span>3362.506172</span>
              </li>
              <li>
                <span>Status</span>
                <span>OPEN</span>
              </li>
              <li>
                <span>Action</span>
                <span>
                  <button className="btn text-danger " type="button" title="Cancel order">
                    <i className="ri-delete-bin-6-line pr-0"></i>
                  </button>
                </span>
              </li>
            </ul>
          </div>

          <div className="order_datalist">
            <ul className="listdata">
              <li>
                <span className="date">Date</span>
                <span className="date_light">08/04/2026</span>
              </li>
              <li>
                <span>Time</span>
                <span>02:15 PM</span>
              </li>
              <li>
                <span>Currency Pair</span>
                <span>ETH/USDT</span>
              </li>
              <li>
                <span>Side</span>
                <span>SELL</span>
              </li>
              <li>
                <span>Price</span>
                <span>3250.8</span>
              </li>
              <li>
                <span>Quantity</span>
                <span>1.25</span>
              </li>
              <li>
                <span>Filled</span>
                <span>0.4</span>
              </li>
              <li>
                <span>Total</span>
                <span>4063.5</span>
              </li>
              <li>
                <span>Status</span>
                <span>PARTIALLY_FILLED</span>
              </li>
              <li>
                <span>Action</span>
                <span>
                  <button className="btn text-danger " type="button" title="Cancel order">
                    <i className="ri-delete-bin-6-line pr-0"></i>
                  </button>
                </span>
              </li>
            </ul>
          </div>

          <div className="order_datalist">
            <ul className="listdata">
              <li>
                <span className="date">Date</span>
                <span className="date_light">07/04/2026</span>
              </li>
              <li>
                <span>Time</span>
                <span>09:00 AM</span>
              </li>
              <li>
                <span>Currency Pair</span>
                <span>SOL/USDT</span>
              </li>
              <li>
                <span>Side</span>
                <span>BUY</span>
              </li>
              <li>
                <span>Price</span>
                <span>145.75</span>
              </li>
              <li>
                <span>Quantity</span>
                <span>50</span>
              </li>
              <li>
                <span>Filled</span>
                <span>0</span>
              </li>
              <li>
                <span>Total</span>
                <span>7287.5</span>
              </li>
              <li>
                <span>Status</span>
                <span>OPEN</span>
              </li>
              <li>
                <span>Action</span>
                <span>
                  <button className="btn text-danger " type="button" title="Cancel order">
                    <i className="ri-delete-bin-6-line pr-0"></i>
                  </button>
                </span>
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
