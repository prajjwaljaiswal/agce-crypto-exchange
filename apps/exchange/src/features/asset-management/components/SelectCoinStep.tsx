import { Modal } from '@agce/ui'
import { useDisclosure } from '@agce/hooks'
import { DEPOSIT_COIN_OPTIONS } from '../constants.js'
import { StepBadge } from './StepBadge.js'

interface SelectCoinStepProps {
  selectedCoin: string
}

export function SelectCoinStep({ selectedCoin }: SelectCoinStepProps) {
  const picker = useDisclosure()

  return (
    <div className="deposit_step_section select_coin_option select-option">
      <div className="deposit_step_header">
        <StepBadge step={1} done={Boolean(selectedCoin)} />
        <h2>Select Coin</h2>
      </div>

      <div className="search_icon_s" onClick={picker.open} role="button">
        <i className="ri-search-line" /> {selectedCoin} Tether
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
          <div className="table-responsive">
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
      </Modal>

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
