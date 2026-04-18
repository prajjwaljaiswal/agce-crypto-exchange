import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { EarningTab } from "../components/earning/EarningTab.js"
import { EarningDashboardTab } from "../components/earning/EarningDashboardTab.js"

export function Earning() {
  const [mainTab, setMainTab] = useState<'home' | 'profile'>('home')

  return (
    <>
      <Helmet>
        <title>Rewards & Yield – AGCE Earning Platform</title>
        <meta
          name="description"
          content="Access AGCE earning programs: rewards, staking and yield-based crypto solutions on a trusted platform."
        />
        <meta
          name="keywords"
          content="crypto yield, earn with crypto, AGCE earning, crypto rewards platform"
        />
      </Helmet>

      <section className="earning_outer_s">
        <div className="earning_section_cate">
          <div className="earning_right_tab">
            <div className="toptabs_hd">
              <div className="container">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${mainTab === 'home' ? 'active' : ''}`} id="home-tab" type="button" role="tab" aria-controls="home" aria-selected={mainTab === 'home'} onClick={() => setMainTab('home')}>Earning</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${mainTab === 'profile' ? 'active' : ''}`} id="profile-tab" type="button" role="tab" aria-controls="profile" aria-selected={mainTab === 'profile'} onClick={() => setMainTab('profile')}>Earning Dashboard</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="tab-content" id="myTabContent">
              <div className={`tab-pane fade ${mainTab === 'home' ? 'show active' : ''}`} id="home" role="tabpanel" aria-labelledby="home-tab">
                {mainTab === 'home' && <EarningTab />}
              </div>

              <div className={`tab-pane fade ${mainTab === 'profile' ? 'show active' : ''}`} id="profile" role="tabpanel" aria-labelledby="profile-tab">
                {mainTab === 'profile' && <EarningDashboardTab />}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="modal fade earningpopup" id="package_details" tabIndex={-1} aria-labelledby="exampleModalLabel">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body text-center">
              <div className="earining_popup_exchange">
                <div className="lft_pop_cnt">
                  <h3>
                    <img src="/images/tether_icon.png" alt="USDT" />
                    USDT
                  </h3>

                  <ul className="daylist">
                    <li>
                      <span>30 Day</span>
                      8.50%
                    </li>
                    <li className="active">
                      <span>60 Day</span>
                      12.00%
                    </li>
                    <li>
                      <span>90 Day</span>
                      15.00%
                    </li>
                  </ul>

                  <ul className="termslist">
                    <li>Reference <span className="text-green">12.00%</span></li>
                    <li>Term<span><strong>60 days</strong></span></li>
                  </ul>

                  <div className="payment_method_f">
                    <div className="payment_inquery">
                      <h3>Payment Method</h3>
                      <div className="select_option">
                        <select defaultValue="spot">
                          <option value="spot">Spot</option>
                          <option value="main">Main</option>
                          <option value="earning">Earning</option>
                        </select>
                      </div>
                    </div>

                    <div className="payment_inquery">
                      <h3>Subscription Amount </h3>
                      <div className="amount_input">
                        <input type="text" placeholder="Enter Subscription Amount (Min 100 USDT)" defaultValue="" />
                        <span className="max text-green">Max</span>
                      </div>
                    </div>
                  </div>

                  <ul className="termslist border-0">
                    <li>Funding Account <span>12580.45 USDT<i className="ri-add-circle-line"></i></span></li>
                    <li>Max Account<span className="text-light">50000 USDT</span></li>
                  </ul>
                </div>

                <div className="right_cnt_pop">
                  <h4>Preview</h4>

                  <ul className="subscriptionlist">
                    <li>Subscription Date<span>9/4/2026, 14:00</span></li>
                    <li>Accrual Date <span>10/4/2026, 14:00</span></li>
                    <li>Profit Distribution Date <span>8/6/2026, 17:30</span></li>
                    <li>Date of Maturity <span>8/6/2026</span></li>
                  </ul>

                  <ul className="termslist border-0">
                    <li>Redemption Period <span>60 days</span></li>
                    <li>Profit Received<span>At Maturity</span></li>
                  </ul>

                  <div className="estimated">
                    <h4>Estimated Returns</h4>

                    <ul className="termslist border-0 mb-0">
                      <li>Daily Earnings <span>2.05479452 USDT / D</span></li>
                      <li>Total Earnings (60D) <span className="text-green">+123.2876712 USDT</span></li>
                      <li>Total Receivable <span className="text-green">1123.2876712 USDT</span></li>
                    </ul>

                    <ul className="estimatedlist">
                      <li>* At maturity, your funds are seamlessly transferred to you earning balance.</li>
                      <li>* Early withdrawals are not permitted. In case of cancellation before maturity, profits will not be applicable.</li>
                    </ul>
                    <label>
                      <input type="checkbox" />
                      {" "}I have read and agree to the <a href="/terms">Earn Service Agreement.</a>
                    </label>
                    <button type="button" className="subscribebtn">Subscription</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </>
  )
}
