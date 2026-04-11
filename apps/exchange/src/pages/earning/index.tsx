import { useState } from 'react'
import { TrendingUp, Clock, DollarSign, Gift, BarChart2, ChevronRight } from 'lucide-react'

const trendingProducts = [
  { token: 'USDT', icon: '💵', apy: '12.5%', duration: '30 Days', color: '#26A17B' },
  { token: 'BTC', icon: '₿', apy: '8.2%', duration: '60 Days', color: '#F7931A' },
  { token: 'ETH', icon: 'Ξ', apy: '10.0%', duration: '45 Days', color: '#627EEA' },
  { token: 'BNB', icon: 'B', apy: '15.3%', duration: '90 Days', color: '#F3BA2F' },
]

const allPlans = [
  { token: 'USDT', apr: '12.5%', duration: '30 Days', minAmount: '100 USDT' },
  { token: 'BTC', apr: '8.2%', duration: '60 Days', minAmount: '0.001 BTC' },
  { token: 'ETH', apr: '10.0%', duration: '45 Days', minAmount: '0.01 ETH' },
  { token: 'BNB', apr: '15.3%', duration: '90 Days', minAmount: '0.1 BNB' },
  { token: 'ADA', apr: '18.7%', duration: '120 Days', minAmount: '100 ADA' },
  { token: 'SOL', apr: '22.4%', duration: '180 Days', minAmount: '1 SOL' },
  { token: 'AGCE', apr: '600%', duration: '365 Days', minAmount: '500 AGCE' },
]

const historyRows = [
  { id: '#001', token: 'USDT', invested: '500', returns: '56.25', status: 'Active', days: '30' },
  { id: '#002', token: 'BTC', invested: '0.05', returns: '0.00205', status: 'Completed', days: '60' },
  { id: '#003', token: 'ETH', invested: '0.5', returns: '0.025', status: 'Active', days: '45' },
  { id: '#004', token: 'AGCE', invested: '1000', returns: '3000', status: 'Active', days: '365' },
]

function EarningTab() {
  return (
    <div className="space-y-10">
      {/* Trending slider */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Trending Products</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {trendingProducts.map((p) => (
            <div
              key={p.token}
              className="min-w-[220px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-3 flex-shrink-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: `${p.color}22`, color: p.color }}
                >
                  {p.icon}
                </span>
                <span className="font-semibold text-[var(--color-text)]">{p.token}</span>
              </div>
              <div>
                <p className="text-[var(--color-text-muted)] text-sm">Estimated APY</p>
                <p className="text-2xl font-bold text-[var(--color-primary)]">{p.apy}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                <Clock size={14} />
                <span>{p.duration}</span>
              </div>
              <button className="mt-1 w-full rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] py-2 text-sm font-medium hover:bg-[var(--color-primary)] hover:text-black transition-colors">
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* All plans table */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">All Plans</h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">Token</th>
                <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">Est. APR</th>
                <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">Duration</th>
                <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">Min. Amount</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {allPlans.map((plan) => (
                <tr
                  key={plan.token}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors"
                >
                  <td className="px-5 py-4 font-semibold text-[var(--color-text)]">{plan.token}</td>
                  <td className="px-5 py-4 text-[var(--color-primary)] font-semibold">{plan.apr}</td>
                  <td className="px-5 py-4 text-[var(--color-text-muted)]">{plan.duration}</td>
                  <td className="px-5 py-4 text-[var(--color-text-muted)]">{plan.minAmount}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="bg-[var(--color-primary)] text-black text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                      Subscribe
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function DashboardTab() {
  const overviewCards = [
    { label: 'Total Invested', value: '$4,820.00', icon: <DollarSign size={20} />, change: '+2.4%' },
    { label: 'Expected Return', value: '$1,240.50', icon: <TrendingUp size={20} />, change: '+5.1%' },
    { label: 'Running Investments', value: '3', icon: <BarChart2 size={20} />, change: 'Active' },
    { label: 'Bonus Earned', value: '$128.00', icon: <Gift size={20} />, change: 'Lifetime' },
  ]

  return (
    <div className="space-y-8">
      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[var(--color-text-muted)] text-sm">{card.label}</span>
              <span className="text-[var(--color-primary)]">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{card.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{card.change}</p>
          </div>
        ))}
      </div>

      {/* History table */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Investment History</h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">ID</th>
                <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">Token</th>
                <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">Invested</th>
                <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">Est. Return</th>
                <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">Duration</th>
                <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {historyRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors"
                >
                  <td className="px-5 py-4 text-[var(--color-text-muted)] font-mono">{row.id}</td>
                  <td className="px-5 py-4 font-semibold text-[var(--color-text)]">{row.token}</td>
                  <td className="px-5 py-4 text-[var(--color-text)]">{row.invested}</td>
                  <td className="px-5 py-4 text-green-400">{row.returns}</td>
                  <td className="px-5 py-4 text-[var(--color-text-muted)]">{row.days}d</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        row.status === 'Active'
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function EarningPage() {
  const [activeTab, setActiveTab] = useState<'earning' | 'dashboard'>('earning')

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Banner */}
      <div
        className="relative overflow-hidden py-14 px-6"
        style={{
          background: 'linear-gradient(135deg, #1a1400 0%, #0d0d0d 50%, #1a1000 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm mb-3">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="text-[var(--color-primary)]">Earning</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">AGCE Earning</h1>
          <p className="text-[var(--color-text-muted)] text-lg">
            Grow your crypto assets.{' '}
            <span className="text-[var(--color-primary)] font-semibold">Up to 600% APR</span> on selected plans.
          </p>
        </div>
      </div>

      {/* Tabs + content */}
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex gap-1 border-b border-[var(--color-border)] mb-8">
          {(['earning', 'dashboard'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab === 'earning' ? 'Earning' : 'Dashboard'}
            </button>
          ))}
        </div>

        {activeTab === 'earning' ? <EarningTab /> : <DashboardTab />}
      </div>
    </div>
  )
}
