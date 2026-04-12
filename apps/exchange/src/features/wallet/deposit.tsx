import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Copy, Check, QrCode, ShieldAlert } from 'lucide-react'
import { deposit, useBalance } from '../trade/paper/index.js'

const DEPOSIT_ASSETS = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'MATIC', 'TRX'] as const

// Representative networks per asset — labels only, used to give the UI realism.
const NETWORKS: Record<string, { id: string; label: string; minDeposit: number; confirmations: number }[]> = {
  USDT: [
    { id: 'TRC20', label: 'Tron (TRC20)', minDeposit: 1, confirmations: 19 },
    { id: 'ERC20', label: 'Ethereum (ERC20)', minDeposit: 10, confirmations: 64 },
    { id: 'BEP20', label: 'BNB Smart Chain (BEP20)', minDeposit: 1, confirmations: 15 },
  ],
  BTC: [{ id: 'BTC', label: 'Bitcoin', minDeposit: 0.0001, confirmations: 2 }],
  ETH: [
    { id: 'ERC20', label: 'Ethereum (ERC20)', minDeposit: 0.002, confirmations: 64 },
    { id: 'ARBITRUM', label: 'Arbitrum One', minDeposit: 0.001, confirmations: 120 },
  ],
  BNB: [{ id: 'BEP20', label: 'BNB Smart Chain (BEP20)', minDeposit: 0.01, confirmations: 15 }],
  SOL: [{ id: 'SOL', label: 'Solana', minDeposit: 0.01, confirmations: 1 }],
}

function networksFor(asset: string) {
  return NETWORKS[asset] ?? [{ id: 'DEFAULT', label: `${asset} Network`, minDeposit: 0.0001, confirmations: 6 }]
}

// Deterministic fake address so the page isn't totally empty.
function addressFor(asset: string, network: string): string {
  const pool = '0123456789abcdefghijklmnopqrstuvwxyz'
  const seed = `${asset}${network}`.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  let out = ''
  let x = seed
  const len = asset === 'BTC' ? 34 : 42
  for (let i = 0; i < len; i++) {
    x = (x * 1103515245 + 12345) & 0x7fffffff
    out += pool[x % pool.length]
  }
  return asset === 'BTC' ? `bc1${out.slice(0, 39)}` : `0x${out.slice(0, 40)}`
}

export function WalletDepositPage() {
  const [asset, setAsset] = useState<string>('USDT')
  const [network, setNetwork] = useState<string>(networksFor('USDT')[0]!.id)
  const [amount, setAmount] = useState('')
  const [copied, setCopied] = useState(false)
  const [flash, setFlash] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)

  const balance = useBalance(asset)
  const networks = useMemo(() => networksFor(asset), [asset])
  const selectedNetwork = networks.find((n) => n.id === network) ?? networks[0]!
  const address = useMemo(() => addressFor(asset, selectedNetwork.id), [asset, selectedNetwork.id])

  const onAssetChange = (next: string) => {
    setAsset(next)
    const first = networksFor(next)[0]!
    setNetwork(first.id)
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setFlash({ kind: 'err', msg: 'Could not copy — select the address manually' })
    }
  }

  const submitCredit = () => {
    const n = parseFloat(amount)
    if (!n || n <= 0) { setFlash({ kind: 'err', msg: 'Enter a positive amount' }); return }
    if (n < selectedNetwork.minDeposit) {
      setFlash({ kind: 'err', msg: `Minimum deposit on this network is ${selectedNetwork.minDeposit} ${asset}` })
      return
    }
    deposit(asset, n)
    setFlash({ kind: 'ok', msg: `Credited ${n} ${asset} (paper)` })
    setAmount('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/wallet/overview" className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <ArrowLeft size={16} />
          Back to assets
        </Link>
        <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
          Paper
        </span>
      </div>

      <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Deposit</h1>

      <div className="rounded-xl border border-[var(--color-border)] p-6 space-y-5" style={{ background: 'var(--color-surface)' }}>
        {/* Asset */}
        <div>
          <label className="block text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Select Coin</label>
          <select
            value={asset}
            onChange={(e) => onAssetChange(e.target.value)}
            className="w-full bg-transparent px-4 py-3 rounded-lg text-sm outline-none"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          >
            {DEPOSIT_ASSETS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-muted)' }}>
            Current balance: <span className="tabular-nums" style={{ color: 'var(--color-text)' }}>{balance.free.toFixed(6)} {asset}</span>
          </p>
        </div>

        {/* Network */}
        <div>
          <label className="block text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Network</label>
          <div className="grid sm:grid-cols-2 gap-2">
            {networks.map((n) => (
              <button
                key={n.id}
                onClick={() => setNetwork(n.id)}
                className="text-left px-4 py-3 rounded-lg transition-colors"
                style={{
                  border: `1px solid ${n.id === network ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: n.id === network ? 'var(--color-surface-2)' : 'transparent',
                }}
              >
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{n.label}</p>
                <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                  Min {n.minDeposit} {asset} · {n.confirmations} confirmations
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Address + QR */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-32 h-32 shrink-0 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
            <QrCode size={80} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <label className="block text-xs" style={{ color: 'var(--color-text-muted)' }}>{asset} Deposit Address</label>
            <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
              <code className="flex-1 text-xs break-all" style={{ color: 'var(--color-text)' }}>{address}</code>
              <button onClick={copyAddress} className="shrink-0 p-1.5 rounded hover:bg-[var(--color-surface)]" style={{ color: copied ? 'var(--color-green)' : 'var(--color-text-muted)' }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <div className="flex items-start gap-2 text-[11px] rounded-md p-2.5" style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
              <span>
                Paper deposit address. Real funds sent here are unrecoverable.
                Use the form below to credit simulated funds instantly.
              </span>
            </div>
          </div>
        </div>

        {/* Amount + credit */}
        <div>
          <label className="block text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Simulate Deposit</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Amount (${asset})`}
              className="flex-1 bg-transparent px-4 py-3 rounded-lg text-sm outline-none"
              style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            />
            <button
              onClick={submitCredit}
              className="px-6 py-3 rounded-lg text-sm font-bold text-white"
              style={{ background: 'var(--color-primary)' }}
            >
              Credit
            </button>
          </div>
          {flash && (
            <div className="mt-3 text-xs rounded-md px-3 py-2" style={{
              background: flash.kind === 'ok' ? 'rgba(14,203,129,0.12)' : 'rgba(246,70,93,0.12)',
              color: flash.kind === 'ok' ? '#0ecb81' : '#f6465d',
              border: `1px solid ${flash.kind === 'ok' ? 'rgba(14,203,129,0.4)' : 'rgba(246,70,93,0.4)'}`,
            }}>
              {flash.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
