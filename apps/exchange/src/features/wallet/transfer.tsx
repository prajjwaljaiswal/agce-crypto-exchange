import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowDownUp, Info } from 'lucide-react'
import { useBalance } from '../trade/paper/index.js'

type WalletType = 'Spot' | 'Futures' | 'Funding' | 'Earn'

const WALLETS: WalletType[] = ['Spot', 'Futures', 'Funding', 'Earn']
const ASSETS = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA'] as const

/**
 * Transfer is a pure-UI simulation: paper trading only tracks the Spot wallet,
 * so there's nothing to actually move. We still let the user click through and
 * show the right feedback so the flow feels real.
 */
export function WalletTransferPage() {
  const [fromWallet, setFromWallet] = useState<WalletType>('Spot')
  const [toWallet, setToWallet] = useState<WalletType>('Futures')
  const [asset, setAsset] = useState<string>('USDT')
  const [amount, setAmount] = useState('')
  const [flash, setFlash] = useState<{ kind: 'ok' | 'err' | 'info'; msg: string } | null>(null)

  const balance = useBalance(asset)

  const swap = () => {
    setFromWallet(toWallet)
    setToWallet(fromWallet)
  }

  const submit = () => {
    const n = parseFloat(amount)
    if (!n || n <= 0) { setFlash({ kind: 'err', msg: 'Enter a valid amount' }); return }
    if (fromWallet === toWallet) { setFlash({ kind: 'err', msg: 'Source and destination must differ' }); return }
    if (fromWallet === 'Spot' && n > balance.free) {
      setFlash({ kind: 'err', msg: `Insufficient Spot balance (have ${balance.free.toFixed(6)} ${asset})` })
      return
    }
    // Paper mode: there's only a Spot wallet. Tell the user honestly.
    if (fromWallet !== 'Spot' || toWallet !== 'Spot') {
      setFlash({
        kind: 'info',
        msg: `Transfer of ${n} ${asset} from ${fromWallet} → ${toWallet} simulated. In paper mode, all funds stay in the Spot wallet.`,
      })
      setAmount('')
      return
    }
    setFlash({ kind: 'ok', msg: 'Transfer executed' })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/wallet/overview" className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <ArrowLeft size={16} />
          Back to assets
        </Link>
        <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
          Paper
        </span>
      </div>

      <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Transfer</h1>

      <div className="rounded-xl border border-[var(--color-border)] p-6 space-y-4" style={{ background: 'var(--color-surface)' }}>
        {/* From wallet */}
        <div>
          <label className="block text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>From</label>
          <div className="grid grid-cols-4 gap-2">
            {WALLETS.map((w) => (
              <button
                key={w}
                onClick={() => setFromWallet(w)}
                className="text-xs font-semibold py-2.5 rounded-lg"
                style={{
                  border: `1px solid ${fromWallet === w ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: fromWallet === w ? 'var(--color-surface-2)' : 'transparent',
                  color: 'var(--color-text)',
                }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Swap */}
        <div className="flex justify-center">
          <button onClick={swap} className="p-2 rounded-full" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
            <ArrowDownUp size={16} />
          </button>
        </div>

        {/* To wallet */}
        <div>
          <label className="block text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>To</label>
          <div className="grid grid-cols-4 gap-2">
            {WALLETS.map((w) => (
              <button
                key={w}
                onClick={() => setToWallet(w)}
                className="text-xs font-semibold py-2.5 rounded-lg"
                style={{
                  border: `1px solid ${toWallet === w ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: toWallet === w ? 'var(--color-surface-2)' : 'transparent',
                  color: 'var(--color-text)',
                }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Asset */}
        <div>
          <label className="block text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Asset</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full bg-transparent px-4 py-3 rounded-lg text-sm outline-none"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          >
            {ASSETS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Amount</label>
            <span className="text-xs tabular-nums" style={{ color: 'var(--color-text-muted)' }}>
              Available: {balance.free.toFixed(6)} {asset}
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent px-4 py-3 rounded-lg text-sm outline-none"
              style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            />
            <button
              onClick={() => setAmount(balance.free.toString())}
              className="px-4 rounded-lg text-xs font-bold"
              style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            >
              MAX
            </button>
          </div>
        </div>

        {flash && (
          <div className="flex items-start gap-2 text-xs rounded-md px-3 py-2" style={{
            background: flash.kind === 'ok' ? 'rgba(14,203,129,0.12)' : flash.kind === 'err' ? 'rgba(246,70,93,0.12)' : 'var(--color-surface-2)',
            color: flash.kind === 'ok' ? '#0ecb81' : flash.kind === 'err' ? '#f6465d' : 'var(--color-text)',
            border: `1px solid ${flash.kind === 'ok' ? 'rgba(14,203,129,0.4)' : flash.kind === 'err' ? 'rgba(246,70,93,0.4)' : 'var(--color-border)'}`,
          }}>
            {flash.kind === 'info' && <Info size={14} className="shrink-0 mt-0.5" />}
            <span>{flash.msg}</span>
          </div>
        )}

        <button
          onClick={submit}
          className="w-full py-3 rounded-lg text-sm font-bold text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          Confirm Transfer
        </button>
      </div>

      <div className="rounded-lg p-4 text-xs" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
        <p className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>About paper transfers</p>
        <p>
          This environment paper-simulates a single Spot wallet. Futures, Funding, and Earn wallets are
          visual only — they track no independent balance. Real cross-wallet transfers require the
          Binance signed endpoint <code>/sapi/v1/asset/transfer</code> behind a backend proxy.
        </p>
      </div>
    </div>
  )
}
