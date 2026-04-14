import { TRADING_PRODUCTS } from '../data.js'

export function TradingProducts() {
  return (
    <div className="trade_platform_section">
      <div className="container">
        <div className="trade_platform_section_header">
          <h2>
            <span>World</span>
            Class Trading Platform
          </h2>

          <ul className="trade_platform_cards_grid">
            {TRADING_PRODUCTS.map((p) => (
              <li key={p.title}>
                <div className="platform_vector">
                  <img src={p.icon} alt={p.title} />
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
