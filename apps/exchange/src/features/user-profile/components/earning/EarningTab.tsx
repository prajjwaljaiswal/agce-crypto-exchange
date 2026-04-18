import { Link } from "react-router-dom"

export function EarningTab() {
  return (
    <>
      <div className="exchange_earning_bnr">
        <div className="earningbnr_cnt">
          <h2>AGCE Earning</h2>
          <p>New user exclusive: Up to <span>600% APR</span></p>
          <Link to="/register" className="signbtn">Sign Up Now</Link>
        </div>
        <div className="earning_bnr">
          <img src="/images/earining_bnr_vector.png" alt="Exchange Earning" />
        </div>
      </div>

      <div className="earning_list_block">
        <div className="slider_group_wrapper">
          <div className="currency_list_b ">
            <ul>
              <li className="currency_list_b_li">
                <div className="currency_bit">
                  <div className="currency_bit_inner">
                    <img src="/images/dollaricon.svg" className="img-fluid" alt="Tether" />
                    <h2>
                      USDT
                      <span>(Tether)</span>
                    </h2>
                  </div>
                  <span className="newtag">Trending<i className="ri-fire-line"></i></span>
                </div>
                <ul className="usd_detail_list">
                  <li><span>30</span> Days</li>
                  <li className="pricevalue"><span>% APY</span>12.50</li>
                </ul>
                <div className="currency_bit_footer">
                  <button type="button" className="subscribe_btn" data-bs-toggle="modal" data-bs-target="#package_details">Subscribe</button>
                </div>
              </li>
            </ul>
          </div>
          <div className="currency_list_b ">
            <ul>
              <li className="currency_list_b_li">
                <div className="currency_bit">
                  <div className="currency_bit_inner">
                    <img src="/images/option-img/btc_icon.svg" className="img-fluid" alt="Bitcoin" />
                    <h2>
                      BTC
                      <span>(Bitcoin)</span>
                    </h2>
                  </div>
                  <span className="newtag">Trending<i className="ri-fire-line"></i></span>
                </div>
                <ul className="usd_detail_list">
                  <li><span>60</span> Days</li>
                  <li className="pricevalue"><span>% APY</span>8.25</li>
                </ul>
                <div className="currency_bit_footer">
                  <button type="button" className="subscribe_btn" data-bs-toggle="modal" data-bs-target="#package_details">Subscribe</button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="all_product_data">
          <h3>All Plans</h3>

          <div className="desktop_view">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Est. APR</th>
                    <th>Duration</th>
                    <th className="action_td">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="td_div">
                        <img alt="USDT" src="/images/dollaricon.svg" className="img-fluid icon_img coinimg me-2" />
                        USDT
                      </div>
                    </td>
                    <td>8.00% ~ 15.00%</td>
                    <td>30/90 days</td>
                    <td className="action_td">
                      <span className="btn custom-btn subscribebtn">
                        <button type="button" data-bs-toggle="modal" data-bs-target="#package_details">Subscribe</button>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="td_div">
                        <img alt="BTC" src="/images/option-img/btc_icon.svg" className="img-fluid icon_img coinimg me-2" />
                        BTC
                      </div>
                    </td>
                    <td>5.50% ~ 12.00%</td>
                    <td>14/180 days</td>
                    <td className="action_td">
                      <span className="btn custom-btn subscribebtn">
                        <button type="button" data-bs-toggle="modal" data-bs-target="#package_details">Subscribe</button>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile_view">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Est. APR</th>
                    <th className="action_td">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="td_div">
                        <img alt="USDT" src="/images/dollaricon.svg" className="img-fluid icon_img coinimg me-2" />
                        USDT
                      </div>
                    </td>
                    <td>8.00% ~ 15.00%</td>
                    <td className="action_td">
                      <span className="btn custom-btn subscribebtn">
                        <button type="button" data-bs-toggle="modal" data-bs-target="#package_details">Subscribe</button>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="td_div">
                        <img alt="BTC" src="/images/option-img/btc_icon.svg" className="img-fluid icon_img coinimg me-2" />
                        BTC
                      </div>
                    </td>
                    <td>5.50% ~ 12.00%</td>
                    <td className="action_td">
                      <span className="btn custom-btn subscribebtn">
                        <button type="button" data-bs-toggle="modal" data-bs-target="#package_details">Subscribe</button>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
