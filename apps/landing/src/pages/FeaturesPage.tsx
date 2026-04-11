import { SectionHeader } from '../components/shared/SectionHeader.js'
import { ProductsGrid } from '../components/home/ProductsGrid.js'
import { FeatureGate } from '../components/shared/FeatureGate.js'
import { useInstanceConfig } from '@agce/hooks'

export function FeaturesPage() {
  const config = useInstanceConfig()

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4">
        <SectionHeader
          eyebrow="Platform features"
          title={`What's available on ${config.name}`}
          description="All features run on a shared high-performance core with jurisdiction-specific compliance layers."
        />
      </div>

      <ProductsGrid />

      {/* Matching engine detail */}
      <div
        className="border-y px-4 py-16 sm:px-6 lg:px-8"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="Technology"
            title="High-performance matching engine"
            description="Built in Go/Rust for sub-millisecond latency. Internal CLOB takes priority — external liquidity (Binance/Bybit) is only used for net exposure hedging."
            centered={false}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Price-time priority CLOB',
              'Market, Limit, Stop-Limit',
              'IOC and FOK order types',
              'WebSocket live order book',
              'OHLCV aggregation',
              'TradingView chart integration',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-2)' }}
              >
                <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INR fiat section — India only */}
      <FeatureGate flag="inrWallet">
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <SectionHeader
              eyebrow="India — INR Fiat"
              title="Seamless INR deposits and withdrawals"
              description="UPI, IMPS, NEFT, and RTGS support. Automatic TDS deduction and GST invoice generation. USDT/INR as the bridge pair."
              centered={false}
            />
          </div>
        </div>
      </FeatureGate>

      {/* API section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="Developers"
            title="Full REST and WebSocket API"
            description="OpenAPI 3.0 spec. Multiple API keys per account with per-key IP whitelisting and permission scoping."
            centered={false}
          />
        </div>
      </div>
    </div>
  )
}
