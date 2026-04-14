import { Modal } from '@agce/ui'
import { useDisclosure } from '@agce/hooks'
import { DEPOSIT_COIN_OPTIONS } from '../constants.js'

interface WithdrawCoinSelectProps {
  selectedCoin: string
}

export function WithdrawCoinSelect({ selectedCoin }: WithdrawCoinSelectProps) {
  const picker = useDisclosure()

  return (
    <div className="select_coin_option select-option">
      <h2>Select Coin</h2>
      <div className="search_icon_s" onClick={picker.open} role="button">
        <img src="/images/search_icon.svg" alt="search" /> {selectedCoin} Tether
      </div>

      <Modal
        isOpen={picker.isOpen}
        onClose={picker.close}
        modalClassName="search_form search_coin search_form_modal_2"
        title="Select Crypto"
      >
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
                <tr
                  key={coin.code}
                  onClick={picker.close}
                  style={{ cursor: 'pointer' }}
                >
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
      </Modal>

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
