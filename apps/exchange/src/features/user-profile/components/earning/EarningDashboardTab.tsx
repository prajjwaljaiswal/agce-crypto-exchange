import { useState } from "react"
import { Link } from "react-router-dom"

export function EarningDashboardTab() {
  const [historyTab, setHistoryTab] = useState<'active' | 'completed'>('active')

  return (
    <>
      <div className="exchange_earning_bnr">
        <div className="earningbnr_cnt">
          <h2>AGCE Earning Balance</h2>
          <p>View your total earnings, rewards, and growth in one place.</p>
          <Link to="/register" className="signbtn">Sign Up Now</Link>
        </div>
        <div className="earning_bnr">
          <img src="/images/earning_balance_vector.png" alt="Exchange Earning" />
        </div>
      </div>

      <ul className="balance_list_s">
        <li>
          <div className="balance_cnt">
            <h4>12,450.75 $</h4>
            <p>Total Invested</p>
          </div>
          <div className="balance_vector">
            <img src="/images/wallet_coins_balance.svg" alt="Earning Balance" />
          </div>
        </li>
        <li>
          <div className="balance_cnt">
            <h4>1,280.50 $</h4>
            <p>Expected Return</p>
          </div>
          <div className="balance_vector">
            <img src="/images/wallet_coins_balance2.svg" alt="Earning Balance" />
          </div>
        </li>
        <li>
          <div className="balance_cnt">
            <h4>10,200.00 $</h4>
            <p>Running Investment</p>
          </div>
          <div className="balance_vector">
            <img src="/images/wallet_coins_balance3.svg" alt="Earning Balance" />
          </div>
        </li>
        <li>
          <div className="balance_cnt">
            <h4>350.25 $</h4>
            <p>Bonus Remaining</p>
          </div>
          <div className="balance_vector">
            <img src="/images/wallet_coins_balance4.svg" alt="Earning Balance" />
          </div>
        </li>
      </ul>

      <div className="wallet_balance_tb">
        <div className="user_list_top walletbalance_t">
          <div className="user_list_l">
            <h4>Earning Assets</h4>
          </div>
        </div>

        <div className="table-responsive">
          <ul className="earning_assets_list">
            <li>
              <span>
                <img src="/images/dollaricon.svg" alt="USDT" width="20" height="20" style={{ marginRight: "8px", verticalAlign: "middle" }} />
                USDT
              </span>
              Tether
            </li>
            <li><span>Total Invested</span>8,500.00 USDT</li>
            <li><span>Expected Return</span>920.50 USDT</li>
            <li><span>Running</span>8,500.00 USDT</li>
            <li><span>Bonus Remaining</span>120.00 USDT</li>
          </ul>
          <ul className="earning_assets_list">
            <li>
              <span>
                <img src="/images/option-img/btc_icon.svg" alt="BTC" width="20" height="20" style={{ marginRight: "8px", verticalAlign: "middle" }} />
                BTC
              </span>
              Bitcoin
            </li>
            <li><span>Total Invested</span>0.45 BTC</li>
            <li><span>Expected Return</span>0.04 BTC</li>
            <li><span>Running</span>0.35 BTC</li>
            <li><span>Bonus Remaining</span>0.01 BTC</li>
          </ul>
        </div>
      </div>

      <div className="dashboard_recent_s productdata position_order">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Earning Balance History</h4>
          <div className="searchBar custom-tabs">
            <i className="ri-search-2-line"></i>
            <input type="search" className="custom_search" placeholder="Search token" defaultValue="" />
          </div>
        </div>

        <div className="user_list_top rowtable">
          <div className="user_list_l earning_section_cate responsive-table">
            <ul className="position_list nav nav-tabs" id="earningHistoryTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button className={`nav-link ${historyTab === 'active' ? 'active' : ''}`} id="active-tab" type="button" role="tab" onClick={() => setHistoryTab('active')}>Active</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={`nav-link ${historyTab === 'completed' ? 'active' : ''}`} id="completed-tab" type="button" role="tab" onClick={() => setHistoryTab('completed')}>Completed</button>
              </li>
            </ul>
          </div>
        </div>

        <div className="table-responsive recenttable_s">
          <div className="tab-content" id="earningHistoryTabContent">
            <div className={`tab-pane fade ${historyTab === 'active' ? 'show active' : ''}`} id="activeTab" role="tabpanel">
              <div className="order_history_mobile_view">
                <div className="d-flex mb-3">
                  <div className="order_datalist">
                    <ul className="listdata">
                      <li>
                        <span className="date">USDT</span>
                        <span className="date_light">01/03/2026</span>
                      </li>
                      <li>
                        <span>Subscription Amount</span>
                        <span>5000 USDT</span>
                      </li>
                      <li>
                        <span>Receivable Amount</span>
                        <span>5375 USDT</span>
                      </li>
                      <li>
                        <span>Status</span>
                        <span className="text-white "><strong>ACTIVE</strong></span>
                      </li>
                      <li>
                        <span>Deducted From</span>
                        <span>Spot Wallet</span>
                      </li>
                      <li>
                        <span>Duration</span>
                        <span>30 days</span>
                      </li>
                      <li>
                        <span>Start Date</span>
                        <span>2026-03-01</span>
                      </li>
                      <li>
                        <span>Mature Date</span>
                        <span>2026-03-31</span>
                      </li>
                      <li>
                        <span>Bonus Amount</span>
                        <span>+375</span>
                      </li>
                    </ul>
                    <button type="button" className="view_more_btn">
                      <i className="ri-arrow-down-s-line"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="desktop_view">
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Currency</th>
                        <th>Deducted From</th>
                        <th>Duration</th>
                        <th>Start Date</th>
                        <th>Mature Date</th>
                        <th>Subscription Amount</th>
                        <th>Bonus Amount</th>
                        <th>Receivable Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>USDT</td>
                        <td>Spot Wallet</td>
                        <td>30 days</td>
                        <td>2026-03-01</td>
                        <td>2026-03-31</td>
                        <td>5000</td>
                        <td>+375</td>
                        <td>5375</td>
                        <td className="text-white"><strong>ACTIVE</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className={`tab-pane fade ${historyTab === 'completed' ? 'show active' : ''}`} id="completedTab" role="tabpanel">
              <div className="order_history_mobile_view">
                <div className="d-flex mb-3">
                  <div className="order_datalist">
                    <ul className="listdata">
                      <li>
                        <span className="date">BTC</span>
                        <span className="date_light">15/01/2026</span>
                      </li>
                      <li>
                        <span>Subscription Amount</span>
                        <span>0.1 BTC</span>
                      </li>
                      <li>
                        <span>Received Amount</span>
                        <span className="text-success">0.108 BTC</span>
                      </li>
                      <li>
                        <span>Status</span>
                        <span className="text-success">COMPLETED</span>
                      </li>
                      <li>
                        <span>Received In</span>
                        <span className="text-success">Main Wallet</span>
                      </li>
                      <li>
                        <span>Duration</span>
                        <span>60 days</span>
                      </li>
                      <li>
                        <span>Start Date</span>
                        <span>2026-01-15</span>
                      </li>
                      <li>
                        <span>Mature Date</span>
                        <span>2026-03-16</span>
                      </li>
                      <li>
                        <span>Bonus</span>
                        <span className="text-success">+0.008</span>
                      </li>
                    </ul>
                    <button type="button" className="view_more_btn">
                      <i className="ri-arrow-down-s-line"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="desktop_view">
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Currency</th>
                        <th>Received In</th>
                        <th>Duration</th>
                        <th>Start Date</th>
                        <th>Mature Date</th>
                        <th>Subscription Amount</th>
                        <th>Bonus</th>
                        <th>Received Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>BTC</td>
                        <td className="text-success">Main Wallet</td>
                        <td>60 days</td>
                        <td>2026-01-15</td>
                        <td>2026-03-16</td>
                        <td>0.1</td>
                        <td className="text-success">+0.008</td>
                        <td className="text-success">0.108</td>
                        <td className="text-success">COMPLETED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
