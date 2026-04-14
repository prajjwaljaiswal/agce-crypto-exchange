import { DOWNLOAD_PLATFORMS } from '../data.js'

export function TradeAnywhere() {
  return (
    <section className="crypto_exchange_section">
      <div className="container">
        <div className="cryptofuture_s">
          <div className="exchange_future_s">
            <img src="/images/trade_crypto_img.svg" alt="Trade Crypto" />
          </div>

          <div className="crypto_future_cnt">
            <h2>
              Trade Crypto
              <br />
              Anywhere, Anytime
            </h2>

            <div className="scan_app_bl d-flex align-items-center">
              <div className="scan_vector">
                <img src="/images/scancode.svg" alt="Scan Vector" />
              </div>
              <div className="scan_content">
                <span>Scan to Download App</span>
                <h3>iOS &amp; Android</h3>
                <a href="#" className="btn">
                  More Download Options
                </a>
              </div>
            </div>

            <ul className="maclist">
              {DOWNLOAD_PLATFORMS.map((p) => (
                <li key={p.label}>
                  <div className="mac_icon">
                    <img src={p.icon} alt={p.label} />
                  </div>
                  <h6>{p.label}</h6>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
