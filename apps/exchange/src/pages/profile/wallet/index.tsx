import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Eye, EyeOff, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Search } from 'lucide-react'

interface CoinBalance {
  coin: string
  name: string
  available: number
  inOrder: number
  total: number
}

const MOCK_BALANCES: CoinBalance[] = [
  { coin: 'BTC', name: 'Bitcoin', available: 0.48231, inOrder: 0.01, total: 0.49231 },
  { coin: 'ETH', name: 'Ethereum', available: 4.1523, inOrder: 0.5, total: 4.6523 },
  { coin: 'USDT', name: 'Tether', available: 1234.56, inOrder: 100, total: 1334.56 },
  { coin: 'BNB', name: 'BNB', available: 12.33, inOrder: 0, total: 12.33 },
  { coin: 'SOL', name: 'Solana', available: 0, inOrder: 0, total: 0 },
  { coin: 'XRP', name: 'XRP', available: 0, inOrder: 0, total: 0 },
  { coin: 'ADA', name: 'Cardano', available: 450.0, inOrder: 50, total: 500.0 },
]

export function WalletPage() {
  const { walletType = 'Spot' } = useParams<{ walletType?: string }>()
  const [showBalance, setShowBalance] = useState(true)
  const [search, setSearch] = useState('')
  const [hideZero, setHideZero] = useState(false)

  const displayWallet = walletType.charAt(0).toUpperCase() + walletType.slice(1).toLowerCase()

  const filtered = MOCK_BALANCES.filter((b) => {
    const matchesSearch =
      b.coin.toLowerCase().includes(search.toLowerCase()) ||
      b.name.toLowerCase().includes(search.toLowerCase())
    const matchesZero = hideZero ? b.total > 0 : true
    return matchesSearch && matchesZero
  })

  const totalUsdt = MOCK_BALANCES.reduce((sum, b) => {
    const price = b.coin === 'USDT' ? 1 : b.coin === 'BTC' ? 65000 : b.coin === 'ETH' ? 3200 : b.coin === 'BNB' ? 580 : b.coin === 'ADA' ? 0.45 : 0
    return sum + b.total * price
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-xl p-6 border border-[var(--color-border)]"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">{displayWallet} Wallet</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-3xl font-bold text-[var(--color-text)]">
                {showBalance ? `${totalUsdt.toLocaleString('en-US', { maximumFractionDigits: 2 })} USDT` : '••••••••'}
              </span>
              <button
                onClick={() => setShowBalance((v) => !v)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              >
                {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              ≈ {showBalance ? `$${totalUsdt.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : '••••••'}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <ArrowDownToLine size={15} />
              Deposit
            </button>
            <button
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium border border-[var(--color-border)] text-[var(--color-text)]"
            >
              <ArrowUpFromLine size={15} />
              Withdraw
            </button>
            <button
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium border border-[var(--color-border)] text-[var(--color-text)]"
            >
              <ArrowLeftRight size={15} />
              Transfer
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div
          className="relative flex items-center rounded-lg border border-[var(--color-border)] px-3 gap-2"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <Search size={15} className="text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coin..."
            className="bg-transparent py-2.5 text-sm text-[var(--color-text)] outline-none w-48"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            className="relative w-10 h-5 rounded-full transition-colors"
            style={{ backgroundColor: hideZero ? 'var(--color-primary)' : 'var(--color-surface-2)' }}
            onClick={() => setHideZero((v) => !v)}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
              style={{ left: hideZero ? '22px' : '2px' }}
            />
          </div>
          <span className="text-sm text-[var(--color-text-muted)]">Hide 0 Balance</span>
        </label>
      </div>

      {/* Table */}
      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Coin', 'Available Balance', 'In-Order', 'Total Balance', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left font-medium"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map((b) => (
                <tr key={b.coin} className="hover:bg-[var(--color-surface-2)] transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-[var(--color-text)]">{b.coin}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{b.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-text)]">
                    {b.available.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                  </td>
                  <td className="px-5 py-4 text-[var(--color-text)]">
                    {b.inOrder.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                  </td>
                  <td className="px-5 py-4 font-medium text-[var(--color-text)]">
                    {b.total.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        className="text-xs px-3 py-1.5 rounded border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
                      >
                        Deposit
                      </button>
                      <button
                        className="text-xs px-3 py-1.5 rounded border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
                      >
                        Withdraw
                      </button>
                      <button
                        className="text-xs px-3 py-1.5 rounded border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
                      >
                        Trade
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-[var(--color-text-muted)] text-sm">No coins found.</div>
        )}
      </div>
    </div>
  )
}
