import { DEPOSIT_COIN_OPTIONS } from '../constants.js'
import { StepBadge } from './StepBadge.js'

interface SelectCoinStepProps {
  selectedCoin: string
}

export function SelectCoinStep({ selectedCoin }: SelectCoinStepProps) {
  return (
    <div className="deposit_step_section select_coin_option select-option">
      <div className="deposit_step_header">
        <StepBadge step={1} done={Boolean(selectedCoin)} />
        <h2>Select Coin</h2>
      </div>

      <div
        className="search_icon_s"
        data-bs-toggle="modal"
        data-bs-target="#search_coin"
      >
        <i className="ri-search-line" /> {selectedCoin} Tether
      </div>

      <div
        className="modal fade search_form search_coin search_form_modal_2"
        id="search_coin"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Select Crypto</h4>
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
                <div className="table-responsive">
                  <table>
                    <tbody>
                      {DEPOSIT_COIN_OPTIONS.map((coin) => (
                        <tr key={coin.code} data-bs-dismiss="modal">
                          <td>
                            <div className="td_first">
                              <div className="icon">
                                <img src={coin.icon} alt={coin.code} width="30" />
                              </div>
                              <div className="price_heading">
                                {coin.code} <br />
                                <span>{coin.name}</span>
                              </div>
                            </div>
                          </td>
                          <td className="right_t price_tb">
                            <div className="price_tb_inner">
                              {coin.balance}
                              <span>{coin.usdValue}</span>
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

      <div className="coin_items_select">
        {DEPOSIT_COIN_OPTIONS.map((coin) => (
          <div key={coin.code} className="coin_items_list">
            <img src={coin.icon} alt={coin.code} />
            {coin.code}
          </div>
        ))}
      </div>
    </div>
  )
}
