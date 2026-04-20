import { Modal } from '@agce/ui'
import { useDisclosure } from '@agce/hooks'
import { StepBadge } from './StepBadge.js'
import type { DepositCoin } from '../constants.js'

interface SelectCoinStepProps {
  selectedCoin: string
  coins: DepositCoin[]
  searchCoins: DepositCoin[]
  isLoading: boolean
  coinSearch: string
  onCoinSearchChange: (value: string) => void
  onSelect: (code: string) => void
}

export function SelectCoinStep({
  selectedCoin,
  coins,
  searchCoins,
  isLoading,
  coinSearch,
  onCoinSearchChange,
  onSelect,
}: SelectCoinStepProps) {
  const picker = useDisclosure()

  const handleClose = () => {
    onCoinSearchChange('')
    picker.close()
  }

  const handleSelectCoin = (code: string) => {
    onSelect(code)
    handleClose()
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
        onClose={handleClose}
        modalClassName="search_form search_coin search_form_modal_2"
        title="Select Crypto"
      >
        <>
          <form>
            <input
              type="text"
              className="searchfield"
              placeholder="Search coin name"
              value={coinSearch}
              onChange={(e) => onCoinSearchChange(e.target.value)}
            />
          </form>

          {isLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>Loading coins...</div>
          ) : searchCoins.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#98a2b3' }}>
              No coin found
            </div>
          ) : (
            <div className="hot_trading_t">
              <div className="table-responsive">
                <table>
                  <tbody>
                    {searchCoins.map((coin) => (
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
          )}
        </>
      </Modal>

      <div className="coin_items_select">
        {coins.slice(0, 3).map((coin) => (
          <div
            key={coin.code}
            className={`coin_items_list ${selectedCoin === coin.code ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(coin.code)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(coin.code)
              }
            }}
          >
            <img src={coin.icon} alt={coin.code} />
            {coin.code}
          </div>
        ))}
      </div>
    </div>
  )
}
