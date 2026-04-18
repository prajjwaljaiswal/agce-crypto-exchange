import { SwapModal } from './SwapModal.js'

interface Coin {
  symbol: string
  name: string
  balance: string
  icon: string
}

const COINS: Coin[] = [
  { symbol: 'USDT', name: 'Tether', balance: '12450.5000', icon: '/images/tether_icon.png' },
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.4521', icon: '/images/bitcoin_icon.png' },
  { symbol: 'ETH', name: 'Ethereum', balance: '3.2100', icon: '/images/eth_currency_img.svg' },
  { symbol: 'BNB', name: 'Binance Coin', balance: '0.0000', icon: '/images/tether_icon.png' },
]

interface Props {
  open: boolean
  onClose: () => void
  selected?: string
  onSelect?: (symbol: string) => void
}

export function SelectCoinModal({ open, onClose, selected = 'USDT', onSelect }: Props) {
  return (
    <SwapModal
      open={open}
      onClose={onClose}
      id="search_coin"
      className="search_form search_form_modal_2 search_coin"
    >
      <div className="modal-header">
        <h4>Select Crypto</h4>
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
      </div>

      <div className="modal-body">
        <form>
          <input type="text" className="searchfield" placeholder="Search coin name" defaultValue="" />
        </form>

        <div className="hot_trading_t">
          <div className="table-responsive">
            <table>
              <tbody>
                {COINS.map((c) => (
                  <tr
                    key={c.symbol}
                    className={`swap-select-crypto-row ${c.symbol === selected ? 'selected' : ''}`}
                    onClick={() => {
                      onSelect?.(c.symbol)
                      onClose()
                    }}
                  >
                    <td>
                      <div className="td_first">
                        <div className="icon">
                          <img src={c.icon} alt={c.symbol} width="30" />
                        </div>
                        <div className="price_heading">
                          {c.symbol}
                          <span>/{c.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="right_t price_tb">{c.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SwapModal>
  )
}
