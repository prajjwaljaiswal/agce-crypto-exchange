import { useParams } from 'react-router-dom'
import './CoinFutures.css'
import './OptionHome.css'

/**
 * UsdMFutures — USD-M perpetual futures trading page.
 * Stub shell ported from legacy src/ui/Pages/FuturesAndOptions/UsdMFutures.js (222 KB).
 * Full implementation pending: WebSocket integration, order panel, positions table.
 */
export function UsdMFutures() {
  const { pairs } = useParams<{ pairs: string }>()
  const [base, quote] = (pairs ?? 'BTC_USDT').split('_')

  return (
    <div className="usd_future_dashboard">
      <div className="top_bar_usd_future">
        <div className="top_future_left_s">
          <div className="usd_left_pr">
            <div className="btcusd__currency">
              {base}/{quote ?? 'USDT'}
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-5 text-center">
        <img
          src="/images/Futures_cs.svg"
          alt="Coming Soon"
          style={{ maxWidth: 320, opacity: 0.8 }}
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
        <p className="mt-4" style={{ color: 'var(--color-text-secondary, #aaa)', fontSize: 16 }}>
          Futures trading is coming soon.
        </p>
      </div>
    </div>
  )
}
