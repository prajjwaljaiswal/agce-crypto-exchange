const TRANSACTIONS = [
  {
    id: 1,
    date: '2026-04-14 10:15:01',
    type: 'Deposit',
    currency: 'USDT',
    chain: 'TRC20',
    amount: '1000.00',
    hash: 'abc123...def456',
    status: 'COMPLETED',
  },
  {
    id: 2,
    date: '2026-04-13 22:50:17',
    type: 'Withdrawal',
    currency: 'BTC',
    chain: 'BTC',
    amount: '0.02500',
    hash: 'xyz789...uvw012',
    status: 'PENDING',
  },
  {
    id: 3,
    date: '2026-04-12 14:02:33',
    type: 'Deposit',
    currency: 'ETH',
    chain: 'ERC20',
    amount: '0.5000',
    hash: 'mno345...pqr678',
    status: 'SUCCESS',
  },
  {
    id: 4,
    date: '2026-04-11 09:18:55',
    type: 'Withdrawal',
    currency: 'USDT',
    chain: 'BEP20',
    amount: '500.00',
    hash: '-',
    status: 'REJECTED',
  },
]

function statusClass(status: string): string {
  switch (status) {
    case 'COMPLETED':
    case 'SUCCESS':
      return 'green'
    case 'PENDING':
      return 'yellow'
    case 'REJECTED':
      return 'red'
    default:
      return ''
  }
}

export function TransactionHistory() {
  return (
    <div className="dashboard_right">
    <div className="dashboard_listing_section Overview_mid">
      {/* <div className="transaction_top_select">

          <div className="select_option">
            <span>Type</span>
            <select>
              <option>Deposit</option>
              <option>Deposit</option>
              <option>Deposit</option>
            </select>
          </div>

          <div className="select_option">
            <span>Time</span>
            <select>
              <option>Past 30...</option>
              <option>Past 30</option>
              <option>Past 10 mint</option>
            </select>
          </div>

          <div className="select_option">
            <span>Coin</span>
            <select>
              <option>All</option>
              <option>Deposit</option>
              <option>Deposit</option>
            </select>
          </div>

          <div className="select_option">
            <span>Status</span>
            <select>
              <option>All</option>
              <option>Deposit</option>
              <option>Deposit</option>
            </select>
          </div>

          <div className="select_option form_type">
            <form>
              <button><img src="/images/search_icon.svg" alt="icon" /></button>
              <input type="text" placeholder="Enter TxID" />
            </form>

          </div>

          <div className="reset">

            <h6>Reset</h6>

          </div>


        </div> */}

      <div className="listing_left_outer full_width transaction_history_t desktop_view2">
        <div className="market_section spotorderhist">
          <div className="top_heading">
            <h4>Deposit/Withdrawal history</h4>
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
              <button
                type="button"
                className="searchBar custom-tabs"
                data-bs-toggle="modal"
                data-bs-target="#exportWalletHistoryModal"
                title="Export Deposit/Withdrawal History"
                style={{ cursor: "pointer" }}
              >
                <i className="ri-download-2-line"></i>
              </button>
            </div>
          </div>

          <div className="dashboard_summary">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Date & Time</th>
                    <th>Transaction Type</th>
                    <th>Currency </th>
                    <th>Chain</th>
                    <th>Amount</th>
                    <th>Tx Hash</th>
                    <th className="right_td">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="cursor-pointer">
                    <td className="color-grey">
                      <small>1</small>
                    </td>
                    <td>
                      <div className="c_view justify-content-start">
                        <span>
                          09/04/2026
                          <small>11:45 AM</small>
                        </span>
                      </div>
                    </td>
                    <td>DEPOSIT</td>
                    <td>USDT</td>
                    <td>TRC20</td>
                    <td>500.25</td>
                    <td>
                      <div className="d-flex align-items-center gap-1 flex-wrap">
                        <span>0x1a2b3c4d...9f8e7d</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-icon p-0"
                          title="Copy Tx Hash"
                        >
                          <i className="ri-file-copy-line"></i>
                        </button>
                      </div>
                    </td>
                    <td className="right_td green">COMPLETED</td>
                  </tr>
                  <tr className="cursor-pointer">
                    <td className="color-grey">
                      <small>2</small>
                    </td>
                    <td>
                      <div className="c_view justify-content-start">
                        <span>
                          08/04/2026
                          <small>03:20 PM</small>
                        </span>
                      </div>
                    </td>
                    <td>WITHDRAWAL</td>
                    <td>BTC</td>
                    <td>Bitcoin</td>
                    <td>0.015</td>
                    <td>
                      <div className="d-flex align-items-center gap-1 flex-wrap">
                        <span>bc1qxy2k...g9hm</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-icon p-0"
                          title="Copy Tx Hash"
                        >
                          <i className="ri-file-copy-line"></i>
                        </button>
                      </div>
                    </td>
                    <td className="right_td yellow">PENDING</td>
                  </tr>
                  <tr className="cursor-pointer">
                    <td className="color-grey">
                      <small>3</small>
                    </td>
                    <td>
                      <div className="c_view justify-content-start">
                        <span>
                          07/04/2026
                          <small>09:10 AM</small>
                        </span>
                      </div>
                    </td>
                    <td>DEPOSIT</td>
                    <td>ETH</td>
                    <td>ERC20</td>
                    <td>2.5</td>
                    <td>
                      <div className="d-flex align-items-center gap-1 flex-wrap">
                        <span>0xdeadbeef...a1b2c3</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-icon p-0"
                          title="Copy Tx Hash"
                        >
                          <i className="ri-file-copy-line"></i>
                        </button>
                      </div>
                    </td>
                    <td className="right_td green">SUCCESS</td>
                  </tr>
                  <tr className="cursor-pointer">
                    <td className="color-grey">
                      <small>4</small>
                    </td>
                    <td>
                      <div className="c_view justify-content-start">
                        <span>
                          06/04/2026
                          <small>06:00 PM</small>
                        </span>
                      </div>
                    </td>
                    <td>WITHDRAWAL</td>
                    <td>SOL</td>
                    <td>Solana</td>
                    <td>25</td>
                    <td>
                      <div className="d-flex align-items-center gap-1 flex-wrap">
                        <span>5VERv8NMv...4BUP</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-icon p-0"
                          title="Copy Tx Hash"
                        >
                          <i className="ri-file-copy-line"></i>
                        </button>
                      </div>
                    </td>
                    <td className="right_td red">REJECTED</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="hVPalX gap-2">
              <span>1-4 of 4</span>
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
          <h5>Deposit/Withdrawal history</h5>
          <div className="d-flex flex-row justify-content-end align-items-end mb-3 gap-2">
            <button
              type="button"
              className="searchBar custom-tabs"
              data-bs-toggle="modal"
              data-bs-target="#exportWalletHistoryModal"
              title="Export Deposit/Withdrawal History"
              style={{ cursor: "pointer" }}
            >
              <i className="ri-download-2-line"></i>
            </button>
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
                <span>11:45 AM</span>
              </li>
              <li>
                <span>Transaction Type</span>
                <span>DEPOSIT</span>
              </li>
              <li>
                <span>Currency</span>
                <span>USDT</span>
              </li>
              <li>
                <span>Chain</span>
                <span>TRC20</span>
              </li>
              <li>
                <span>Amount</span>
                <span>500.25</span>
              </li>
              <li>
                <span>Tx Hash</span>
                <span>
                  <span className="text-white">
                    0x1a2b3c4d...9f8e7d <i className="ri-file-copy-line"></i>
                  </span>
                </span>
              </li>
              <li>
                <span>Status</span>
                <span className="text-success">COMPLETED</span>
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
                <span>03:20 PM</span>
              </li>
              <li>
                <span>Transaction Type</span>
                <span>WITHDRAWAL</span>
              </li>
              <li>
                <span>Currency</span>
                <span>BTC</span>
              </li>
              <li>
                <span>Chain</span>
                <span>Bitcoin</span>
              </li>
              <li>
                <span>Amount</span>
                <span>0.015</span>
              </li>
              <li>
                <span>Tx Hash</span>
                <span>
                  <span className="text-white">
                    bc1qxy2k...g9hm <i className="ri-file-copy-line"></i>
                  </span>
                </span>
              </li>
              <li>
                <span>Status</span>
                <span className="text-warning">PENDING</span>
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
                <span>09:10 AM</span>
              </li>
              <li>
                <span>Transaction Type</span>
                <span>DEPOSIT</span>
              </li>
              <li>
                <span>Currency</span>
                <span>ETH</span>
              </li>
              <li>
                <span>Chain</span>
                <span>ERC20</span>
              </li>
              <li>
                <span>Amount</span>
                <span>2.5</span>
              </li>
              <li>
                <span>Tx Hash</span>
                <span>
                  <span className="text-white">
                    0xdeadbeef...a1b2c3 <i className="ri-file-copy-line"></i>
                  </span>
                </span>
              </li>
              <li>
                <span>Status</span>
                <span className="text-success">SUCCESS</span>
              </li>
            </ul>
          </div>

          <div className="order_datalist">
            <ul className="listdata">
              <li>
                <span className="date">Date</span>
                <span className="date_light">06/04/2026</span>
              </li>
              <li>
                <span>Time</span>
                <span>06:00 PM</span>
              </li>
              <li>
                <span>Transaction Type</span>
                <span>WITHDRAWAL</span>
              </li>
              <li>
                <span>Currency</span>
                <span>SOL</span>
              </li>
              <li>
                <span>Chain</span>
                <span>Solana</span>
              </li>
              <li>
                <span>Amount</span>
                <span>25</span>
              </li>
              <li>
                <span>Tx Hash</span>
                <span>
                  <span className="text-white">
                    5VERv8NMv...4BUP <i className="ri-file-copy-line"></i>
                  </span>
                </span>
              </li>
              <li>
                <span>Status</span>
                <span className="text-danger">REJECTED</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="hVPalX gap-2 mt-3">
          <span>1-4 of 4</span>
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

    <div
      className="modal fade search_form export_modal"
      id="exportWalletHistoryModal"
      tabIndex={-1}
      aria-labelledby="exportWalletHistoryModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exportWalletHistoryModalLabel">Export Deposit/Withdrawal History</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body export_modal_body">
            <div className="export_section">
              <label className="export_label">Transaction Type</label>
              <div className="export_btn_group">
                <button type="button" className="export_btn active">All</button>
                <button type="button" className="export_btn">Deposit</button>
                <button type="button" className="export_btn">Withdrawal</button>
              </div>
            </div>

            <div className="export_section">
              <label className="export_label">Select Time Period</label>
              <div className="export_btn_group export_presets">
                <button type="button" className="export_btn">Last 24 hours</button>
                <button type="button" className="export_btn">2 Weeks</button>
                <button type="button" className="export_btn">1 Month</button>
                <button type="button" className="export_btn">3 Months</button>
                <button type="button" className="export_btn">6 Months</button>
                <button type="button" className="export_btn active">Customize</button>
              </div>
              <div className="export_date_range">
                <input type="date" className="export_date_input" defaultValue="2026-03-09" />
                <span className="export_date_arrow">
                  <i className="ri-arrow-right-line"></i>
                </span>
                <input type="date" className="export_date_input" defaultValue="2026-04-09" />
              </div>
              <small className="export_note">* Up to 10,000 data can be generated each time.</small>
            </div>

            <div className="export_section">
              <label className="export_label">Format</label>
              <div className="export_btn_group">
                <button type="button" className="export_btn active">PDF</button>
                <button type="button" className="export_btn">Excel</button>
              </div>
            </div>

            <div className="export_section export_actions">
              <button type="button" className="export_submit_btn">Export</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
