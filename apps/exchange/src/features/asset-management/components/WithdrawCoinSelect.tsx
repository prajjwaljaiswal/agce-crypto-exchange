import { DEPOSIT_COIN_OPTIONS } from '../constants.js'

interface WithdrawCoinSelectProps {
  selectedCoin: string
}

export function WithdrawCoinSelect({ selectedCoin }: WithdrawCoinSelectProps) {
  return (
    <div className="select_coin_option select-option">
      <h2>Select Coin</h2>
      <div
        className="search_icon_s"
        data-bs-toggle="modal"
        data-bs-target="#search_coin_withdraw"
      >
        <img src="/images/search_icon.svg" alt="search" /> {selectedCoin} Tether
      </div>

      <div
        className="modal fade search_form search_coin search_form_modal_2"
        id="search_coin_withdraw"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Select Crypto</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form>
                <input
                  type="text"
                  className="searchfield"
                  placeholder="Search coin name"
                  defaultValue=""
                />
              </form>

              <div className="hot_trading_t">
                <table>
                  <tbody>
                    {DEPOSIT_COIN_OPTIONS.map((coin) => (
                      <tr key={coin.code} data-bs-dismiss="modal">
                        <td>
                          <div className="td_first">
                            <div className="icon">
                              <img src={coin.icon} alt="icon" width="30" />
                            </div>
                            <div className="price_heading">
                              {coin.code} <br />
                            </div>
                          </div>
                        </td>
                        <td className="right_t price_tb">{coin.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="coin_items_select">
        {DEPOSIT_COIN_OPTIONS.map((coin) => (
          <div key={coin.code} className="coin_items_list">
            <img src={coin.icon} alt="icon" />
            {coin.code}
          </div>
        ))}
      </div>
    </div>
  )
}
