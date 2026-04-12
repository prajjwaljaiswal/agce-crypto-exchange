import { Eye, EyeOff, ArrowDownToLine, ArrowUpFromLine, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface WalletCard {
  type: string
  balance: number
  currency: string
  change: number
}

const WALLET_CARDS: WalletCard[] = [
  { type: 'Spot', balance: 84230.45, currency: 'USDT', change: 3.2 },
  { type: 'Futures', balance: 12450.0, currency: 'USDT', change: -1.8 },
  { type: 'P2P', balance: 3200.0, currency: 'USDT', change: 0 },
  { type: 'Earning', balance: 6780.25, currency: 'USDT', change: 0.95 },
]

const RECENT_ASSETS = [
  { coin: 'BTC', name: 'Bitcoin', amount: 0.492, valueUsdt: 31980, pct: 37.9 },
  { coin: 'ETH', name: 'Ethereum', amount: 4.65, valueUsdt: 14880, pct: 17.6 },
  { coin: 'USDT', name: 'Tether', amount: 1334.56, valueUsdt: 1334.56, pct: 1.6 },
  { coin: 'BNB', name: 'BNB', amount: 12.33, valueUsdt: 7151.4, pct: 8.5 },
  { coin: 'ADA', name: 'Cardano', amount: 500, valueUsdt: 225, pct: 0.3 },
]

export function AssetOverviewPage() {
  const [showBalance, setShowBalance] = useState(true)

  const total = WALLET_CARDS.reduce((s, w) => s + w.balance, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Asset Overview</h1>

      {/* Total Balance */}
      <div
        className="rounded-xl p-6 border border-[var(--color-border)]"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <p className="text-sm text-[var(--color-text-muted)]">Total Estimated Balance</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-4xl font-bold text-[var(--color-text)]">
            {showBalance
              ? `${total.toLocaleString('en-US', { maximumFractionDigits: 2 })} USDT`
              : '••••••••••'}
          </span>
          <button
            onClick={() => setShowBalance((v) => !v)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          ≈ {showBalance ? `$${total.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : '•••••'}
        </p>

        <div className="flex gap-3 mt-5">
          <a
            href="#"
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <ArrowDownToLine size={15} />
            Deposit
          </a>
          <a
            href="#"
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium border border-[var(--color-border)] text-[var(--color-text)]"
          >
            <ArrowUpFromLine size={15} />
            Withdraw
          </a>
        </div>
      </div>

      {/* Wallet Distribution */}
      <div>
        <h2 className="text-base font-medium text-[var(--color-text)] mb-3">Balance by Wallet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {WALLET_CARDS.map((w) => {
            const pct = ((w.balance / total) * 100).toFixed(1)
            return (
              <div
                key={w.type}
                className="rounded-xl p-5 border border-[var(--color-border)] flex flex-col gap-3"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                    {w.type}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">{pct}%</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-[var(--color-text)]">
                    {showBalance
                      ? w.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })
                      : '••••••'}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">{w.currency}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-1.5 flex-1 rounded-full mr-3" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: 'var(--color-primary)' }}
                    />
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: w.change > 0 ? 'var(--color-green)' : w.change < 0 ? 'var(--color-red)' : 'var(--color-text-muted)',
                    }}
                  >
                    {w.change > 0 ? '+' : ''}{w.change}%
                  </span>
                </div>
                <a
                  href="#"
                  className="text-xs font-medium text-center rounded-lg py-1.5 border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
                >
                  View {w.type}
                </a>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Assets */}
      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border)]">
          <TrendingUp size={16} style={{ color: 'var(--color-primary)' }} />
          <h2 className="text-base font-medium text-[var(--color-text)]">Top Assets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Coin', 'Amount', 'Value (USDT)', 'Portfolio %'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-medium text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {RECENT_ASSETS.map((a) => (
                <tr key={a.coin} className="hover:bg-[var(--color-surface-2)] transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-medium text-[var(--color-text)]">{a.coin}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{a.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[var(--color-text)]">
                    {a.amount.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                  </td>
                  <td className="px-5 py-3.5 text-[var(--color-text)]">
                    {showBalance
                      ? a.valueUsdt.toLocaleString('en-US', { maximumFractionDigits: 2 })
                      : '••••'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${a.pct}%`, backgroundColor: 'var(--color-primary)' }}
                        />
                      </div>
                      <span className="text-[var(--color-text-muted)] text-xs">{a.pct}%</span>
                    </div>
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
