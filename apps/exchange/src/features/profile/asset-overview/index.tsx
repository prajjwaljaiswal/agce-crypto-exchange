import { Eye, EyeOff, ArrowDownToLine, ArrowUpFromLine, TrendingUp, RefreshCw, ArrowLeftRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePaperPortfolio, deposit } from '../../trade/paper/index.js'

const SEED_ASSETS = ['BTC', 'ETH', 'BNB', 'SOL', 'USDT', 'XRP', 'ADA', 'DOGE']

export function AssetOverviewPage() {
  const [showBalance, setShowBalance] = useState(true)
  const [depositOpen, setDepositOpen] = useState(false)
  const portfolio = usePaperPortfolio()

  const total = portfolio.totalValueUsdt
  const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 })

  // Split paper balances into Spot-only (the only wallet we have). Futures/P2P/Earning are zero.
  const walletCards = [
    { type: 'Spot', balance: total, currency: 'USDT', change: portfolio.change24hPct },
    { type: 'Futures', balance: 0, currency: 'USDT', change: 0 },
    { type: 'P2P', balance: 0, currency: 'USDT', change: 0 },
    { type: 'Earning', balance: 0, currency: 'USDT', change: 0 },
  ]
  const walletTotal = walletCards.reduce((s, w) => s + w.balance, 0) || 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Asset Overview</h1>
        <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
          Paper · live prices
        </span>
      </div>

      {/* Total Balance */}
      <div
        className="rounded-xl p-6 border border-[var(--color-border)]"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <p className="text-sm text-[var(--color-text-muted)]">Total Estimated Balance</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-4xl font-bold text-[var(--color-text)]">
            {showBalance ? `${fmt(total)} USDT` : '••••••••••'}
          </span>
          <button
            onClick={() => setShowBalance((v) => !v)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <p className="text-sm mt-1" style={{ color: portfolio.change24hUsdt >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>
          {showBalance ? (
            <>
              {portfolio.change24hUsdt >= 0 ? '+' : ''}{fmt(portfolio.change24hUsdt)} USDT ({portfolio.change24hPct >= 0 ? '+' : ''}{portfolio.change24hPct.toFixed(2)}%) today
            </>
          ) : '•••••'}
        </p>

        <div className="flex gap-3 mt-5 flex-wrap">
          <button
            onClick={() => setDepositOpen(true)}
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <ArrowDownToLine size={15} />
            Deposit
          </button>
          <Link
            to="/wallet/transfer"
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium border border-[var(--color-border)] text-[var(--color-text)]"
          >
            <ArrowLeftRight size={15} />
            Transfer
          </Link>
          <Link
            to="/wallet/convert"
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium border border-[var(--color-border)] text-[var(--color-text)]"
          >
            <RefreshCw size={15} />
            Convert
          </Link>
          <Link
            to="/asset_managemnet/withdraw"
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium border border-[var(--color-border)] text-[var(--color-text)]"
          >
            <ArrowUpFromLine size={15} />
            Withdraw
          </Link>
        </div>
      </div>

      {/* Wallet Distribution */}
      <div>
        <h2 className="text-base font-medium text-[var(--color-text)] mb-3">Balance by Wallet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {walletCards.map((w) => {
            const pct = ((w.balance / walletTotal) * 100).toFixed(1)
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
                    {showBalance ? fmt(w.balance) : '••••••'}
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
                    {w.change > 0 ? '+' : ''}{w.change.toFixed(2)}%
                  </span>
                </div>
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
          <h2 className="text-base font-medium text-[var(--color-text)]">Assets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Coin', 'Amount', 'Available', 'In Orders', 'Value (USDT)', '24h %', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-medium text-[var(--color-text-muted)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {portfolio.positions.map((p) => (
                <tr key={p.asset} className="hover:bg-[var(--color-surface-2)] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-[var(--color-text)]">{p.asset}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[var(--color-text)] tabular-nums">{p.total.toLocaleString('en-US', { maximumFractionDigits: 6 })}</td>
                  <td className="px-5 py-3.5 text-[var(--color-text-muted)] tabular-nums">{p.free.toLocaleString('en-US', { maximumFractionDigits: 6 })}</td>
                  <td className="px-5 py-3.5 text-[var(--color-text-muted)] tabular-nums">{p.locked.toLocaleString('en-US', { maximumFractionDigits: 6 })}</td>
                  <td className="px-5 py-3.5 text-[var(--color-text)] tabular-nums">
                    {showBalance ? fmt(p.valueUsdt) : '••••'}
                  </td>
                  <td className="px-5 py-3.5 tabular-nums" style={{ color: p.changePct >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>
                    {p.changePct >= 0 ? '+' : ''}{p.changePct.toFixed(2)}%
                  </td>
                  <td className="px-5 py-3.5">
                    {p.asset !== 'USDT' && (
                      <Link to={`/trade/${p.asset}_USDT`} className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                        Trade
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {depositOpen && (
        <DepositModal onClose={() => setDepositOpen(false)} />
      )}
    </div>
  )
}

function DepositModal({ onClose }: { onClose: () => void }) {
  const [asset, setAsset] = useState('USDT')
  const [amount, setAmount] = useState('')
  const [flash, setFlash] = useState<string | null>(null)

  const submit = () => {
    const n = parseFloat(amount)
    if (!n || n <= 0) { setFlash('Enter a positive amount'); return }
    deposit(asset, n)
    setFlash(`Credited ${n} ${asset} (paper)`)
    setAmount('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-xl p-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Paper Deposit</h3>
          <button onClick={onClose} className="text-xl" style={{ color: 'var(--color-text-muted)' }}>×</button>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Instantly credit simulated funds to your paper wallet. No real transaction.
        </p>
        <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Asset</label>
        <select value={asset} onChange={(e) => setAsset(e.target.value)} className="w-full bg-transparent px-3 py-2 rounded-md text-sm mb-3 outline-none" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
          {SEED_ASSETS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Amount</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          className="w-full bg-transparent px-3 py-2 rounded-md text-sm mb-3 outline-none"
          style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        />
        {flash && (
          <div className="text-xs mb-3 px-3 py-2 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}>{flash}</div>
        )}
        <button onClick={submit} className="w-full py-2.5 rounded-lg text-sm font-bold text-white" style={{ background: 'var(--color-primary)' }}>
          Credit Paper Funds
        </button>
      </div>
    </div>
  )
}
