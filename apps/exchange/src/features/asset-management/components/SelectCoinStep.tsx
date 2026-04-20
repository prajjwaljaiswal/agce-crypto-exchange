import { Modal } from '@agce/ui'
import { useDisclosure } from '@agce/hooks'
import { StepBadge } from './StepBadge.js'
import type { DepositCoin } from '../constants.js'

interface SelectCoinStepProps {
  selectedCoin: string
  coins: DepositCoin[]
  isLoading: boolean
  onSelect: (code: string) => void
}

export function SelectCoinStep({ selectedCoin, coins, isLoading, onSelect }: SelectCoinStepProps) {
  const picker = useDisclosure()

  const handleSelectCoin = (code: string) => {
    onSelect(code)
    picker.close()
  }

  return (
    <div className="deposit_step_section select_coin_option select-option">
      <div className="deposit_step_header">
        <StepBadge step={1} done={Boolean(selectedCoin)} />
        <h2>Select Coin</h2>
      </div>

      <div className="search_icon_s" onClick={picker.open} role="button">
        <i className="ri-search-line" /> {selectedCoin} {isLoading ? 'Loading...' : coins.find(c => c.code === selectedCoin)?.name ?? 'Tether'}
      </div>

      <Modal
        isOpen={picker.isOpen}
        onClose={picker.close}
        modalClassName="search_form search_coin search_form_modal_2"
        title="Select Crypto"
      >
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading coins...</div>
        ) : (
          <>
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
                    {coins.map((coin) => (
                      <tr
                        key={coin.code}
                        onClick={() => handleSelectCoin(coin.code)}
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
          </>
        )}
      </Modal>

      <div className="coin_items_select">
        {coins.map((coin) => (
          <div key={coin.code} className="coin_items_list">
            <img src={coin.icon} alt={coin.code} />
            {coin.code}
          </div>
        ))}
      </div>
    </div>
  )
}
