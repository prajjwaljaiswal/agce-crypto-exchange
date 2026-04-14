interface CurrencyOption {
  code: string
  label: string
  icon: string
  iconWidth?: string
  active?: boolean
}

const CURRENCIES: CurrencyOption[] = [
  {
    code: 'USDT',
    label: 'Tether USD (USDT)',
    icon: '/images/icon/tether.png',
    active: true,
  },
  {
    code: 'BTC',
    label: 'BTC',
    icon: '/images/icon/btc copy.png',
    iconWidth: '50px',
  },
  { code: 'BNB', label: 'BNB', icon: '/images/icon/bnb copy.png' },
]

export function CurrencyPreferenceSection() {
  return (
    <div className="twofactor_outer_s">
      <h5>Currency Preference</h5>
      <p>Select your preferred display currency for all markets</p>

      <div className="two_factor_list">
        <div className="currency_list_b">
          <ul>
            {CURRENCIES.map((c) => (
              <li key={c.code} className={c.active ? 'active' : ''}>
                <div className="currency_bit">
                  <img
                    src={c.icon}
                    className="img-fluid"
                    alt={c.code}
                    width={c.iconWidth}
                  />
                </div>
                <h6>{c.label}</h6>
                <div className="vector_bottom">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="52"
                    viewBox="0 0 60 52"
                    fill="none"
                  >
                    <path d="M59.6296 0L60 52H0L59.6296 0Z" fill="#3B3B3B" />
                  </svg>
                </div>
              </li>
            ))}
          </ul>
          <div className="savebtn">
            <button type="button">Save Currency Preference</button>
          </div>
        </div>
      </div>
    </div>
  )
}
