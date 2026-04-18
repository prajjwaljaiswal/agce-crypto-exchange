import { Link } from 'react-router-dom'

interface Props {
  onPickCoin: () => void
  onSwap: () => void
}

const INPUT_STYLE = {
  color: '#fff',
  background: 'transparent',
  border: 'none',
  textAlign: 'right',
  fontSize: '18px',
  fontWeight: '600',
  width: '100%',
  outline: 'none',
} as const

export function SwapForm({ onPickCoin, onSwap }: Props) {
  return (
    <div className="swap_outer_section">
      <h3>Quick Swap</h3>
      <div className="d-flex cnt_amountsl ">
        <ul className="swaplist">
          <li>
            <span>Minimum Amount | Maximum Amount</span>
            1 | 500 USDT
          </li>
          <li>
            <span>Swapping Fee</span>
            0.15%
          </li>
        </ul>
        <div className="swap_bitcoin">
          <img src="/images/bitcoinswap.svg" className="img-fluid" alt="swapbitcoin" />
        </div>
      </div>

      <div className="swap_usdtdata">
        <div className="d-flex">
          <div className="swap_ustd_bl">
            <div className="from">
              <p>From<i className="ri-information-line"></i></p>
              <p>
                Available 12,450.5000 USDT
                <Link to="/asset_managemnet/deposit" style={{ color: '#f3bb2c' }}>
                  <i className="ri-add-circle-fill"></i>
                </Link>
                <Link to="/user_profile/asset_overview" style={{ color: '#f3bb2c' }}>
                  <i className="ri-exchange-line"></i>
                </Link>
              </p>
            </div>
            <div className="from">
              <button type="button" onClick={onPickCoin}>
                <img src="/images/tether_icon.png" className="img-fluid" alt="USDT" />
                USDT
                <i className="ri-arrow-drop-down-fill"></i>
              </button>
              <input
                type="text"
                inputMode="decimal"
                name="fromSwap"
                defaultValue="1000"
                placeholder="0"
                style={INPUT_STYLE}
              />
            </div>
          </div>

          <div className="swap_ustd_bl">
            <div className="from">
              <p>To<i className="ri-information-line"></i></p>
              <p>Available 0.4521 BTC</p>
            </div>
            <div className="from">
              <button type="button" onClick={onPickCoin}>
                <img src="/images/bitcoin_icon.png" className="img-fluid" alt="BTC" />
                BTC
                <i className="ri-arrow-drop-down-fill"></i>
              </button>
              <input
                type="text"
                inputMode="decimal"
                name="toSwap"
                defaultValue="0.0152"
                placeholder="0"
                style={INPUT_STYLE}
              />
            </div>
          </div>

          <div className="vector_icon" style={{ cursor: 'pointer' }}>
            <img src="/images/wallet_icon2.png" alt="wallet" />
          </div>
        </div>

        <p>
          <span>Conversion Rate (Approx.)</span>
          {' '}1 USDT ≈ 0.0000152 BTC
        </p>

        <button type="button" className="btn" onClick={onSwap}>
          Swap Now
        </button>
      </div>
    </div>
  )
}
