import { TrendingUp, BarChart2, Repeat, Layers, Users, Coins, Building2, Bot } from 'lucide-react'
import { FeatureGate } from '../shared/FeatureGate.js'
import { SectionHeader } from '../shared/SectionHeader.js'

const products = [
  {
    icon: TrendingUp,
    title: 'Spot Trading',
    description: 'Full CLOB matching with Binance/Bybit liquidity backstop. All order types supported.',
    flag: 'spot' as const,
  },
  {
    icon: BarChart2,
    title: 'Perpetual Futures',
    description: 'Up to 100x leverage with funding rates, insurance fund, and ADL protection.',
    flag: 'perpetuals' as const,
  },
  {
    icon: Layers,
    title: 'Margin Trading',
    description: 'Cross and isolated margin modes with portfolio margining and auto-liquidation.',
    flag: 'margin' as const,
  },
  {
    icon: Coins,
    title: 'Options',
    description: 'European-style BTC and ETH options with Black-Scholes pricing and Greeks display.',
    flag: 'options' as const,
  },
  {
    icon: Repeat,
    title: 'P2P Trading',
    description: 'Peer-to-peer fiat-to-crypto marketplace with escrow and dispute resolution.',
    flag: 'p2p' as const,
  },
  {
    icon: Building2,
    title: 'OTC Desk',
    description: 'RFQ workflow for block trades. Dedicated relationship manager for institutional clients.',
    flag: 'otc' as const,
  },
  {
    icon: Users,
    title: 'Copy Trading',
    description: 'Follow top traders automatically. Set drawdown limits and performance fees.',
    flag: 'copyTrading' as const,
  },
  {
    icon: Bot,
    title: 'Algorithmic Trading',
    description: 'Full REST and WebSocket API with sub-account isolation for bot strategies.',
    flag: 'spot' as const,
  },
]

export function ProductsGrid() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Platform"
          title="Everything you need to trade"
          description="A complete exchange ecosystem — from spot to derivatives, OTC to on-chain."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(({ icon: Icon, title, description, flag }) => (
            <FeatureGate key={title} flag={flag}>
              <div
                className="rounded-xl border p-5 transition-colors hover:border-[var(--color-primary)]"
                style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
              >
                <div
                  className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--color-surface-3)' }}
                >
                  <Icon size={18} style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 className="mb-1.5 font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                  {title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {description}
                </p>
              </div>
            </FeatureGate>
          ))}
        </div>
      </div>
    </section>
  )
}
