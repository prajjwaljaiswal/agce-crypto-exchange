import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowDownUp, RefreshCw } from 'lucide-react'
import { subscribeAllTickers } from '@agce/binance'
import { convert as doConvert, useBalance } from '../trade/paper/index.js'

const CONVERT_ASSETS = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'MATIC', 'TRX', 'AVAX', 'DOT', 'LINK'] as const

/**
 * Price in USDT for every supported asset, from the live Binance !ticker@arr stream.
 * USDT is 1:1; unknown assets fall back to 0.
 */
function useUsdtPrices(): Record<string, number> {
  const [prices, setPrices] = useState<Record<string, number>>({ USDT: 1 })
  useEffect(() => {
    return subscribeAllTickers((tickers) => {
      const next: Record<string, number> = { USDT: 1 }
      for (const t of tickers) {
        if (!t.s.endsWith('USDT')) continue
        const base = t.s.slice(0, -4)
        next[base] = parseFloat(t.c)
      }
      setPrices(next)
    })
  }, [])
  return prices
}

export function WalletConvertPage() {
  const [fromAsset, setFromAsset] = useState('USDT')
  const [toAsset, setToAsset] = useState('BTC')
  const [fromAmount, setFromAmount] = useState('')
  const [flash, setFlash] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)

  const prices = useUsdtPrices()
  const fromBalance = useBalance(fromAsset)

  // Rate = price(from)/price(to) — how many `to` you get per 1 `from`.
  const rate = useMemo(() => {
    const fp = prices[fromAsset] ?? 0
    const tp = prices[toAsset] ?? 0
    if (!fp || !tp) return 0
    return fp / tp
  }, [prices, fromAsset, toAsset])

  const toAmount = useMemo(() => {
    const n = parseFloat(fromAmount)
    if (!n || !rate) return ''
    return (n * rate).toString()
  }, [fromAmount, rate])

  const swap = () => {
    setFromAsset(toAsset)
    setToAsset(fromAsset)
    setFromAmount('')
  }

  const submit = () => {
    const n = parseFloat(fromAmount)
    if (!n || n <= 0) { setFlash({ kind: 'err', msg: 'Enter a valid amount' }); return }
    if (fromAsset === toAsset) { setFlash({ kind: 'err', msg: 'Pick different assets' }); return }
    if (!rate) { setFlash({ kind: 'err', msg: 'Rate unavailable — price feed not ready' }); return }
    const result = doConvert(fromAsset, toAsset, n, rate)
    if (result.ok) {
      setFlash({ kind: 'ok', msg: `Converted ${n} ${fromAsset} → ${(n * rate).toFixed(6)} ${toAsset}` })
      setFromAmount('')
    } else {
      setFlash({ kind: 'err', msg: result.error ?? 'Convert failed' })
    }
  }

  const setPercent = (pct: number) => {
    const v = fromBalance.free * (pct / 100)
    setFromAmount(v.toString())
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/wallet/overview" className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <ArrowLeft size={16} />
          Back to assets
        </Link>
        <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
          Paper · live rate
        </span>
      </div>

      <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Convert</h1>

      <div className="rounded-xl border border-[var(--color-border)] p-6 space-y-3" style={{ background: 'var(--color-surface)' }}>
        {/* From */}
        <div className="rounded-lg p-4" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>From</span>
            <span className="text-xs tabular-nums" style={{ color: 'var(--color-text-muted)' }}>
              Balance: {fromBalance.free.toFixed(6)} {fromAsset}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent text-2xl font-bold outline-none"
              style={{ color: 'var(--color-text)' }}
            />
            <select
              value={fromAsset}
              onChange={(e) => setFromAsset(e.target.value)}
              className="bg-transparent px-3 py-2 rounded-md text-sm font-bold outline-none"
              style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            >
              {CONVERT_ASSETS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            {[25, 50, 75, 100].map((p) => (
              <button key={p} onClick={() => setPercent(p)} className="text-[11px] px-2 py-1 rounded" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                {p}%
              </button>
            ))}
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button onClick={swap} className="p-2 rounded-full" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
            <ArrowDownUp size={16} />
          </button>
        </div>

        {/* To */}
        <div className="rounded-lg p-4" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>To</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>≈ estimated</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={toAmount ? parseFloat(toAmount).toLocaleString('en-US', { maximumFractionDigits: 8 }) : ''}
              readOnly
              placeholder="0.00"
              className="flex-1 bg-transparent text-2xl font-bold outline-none"
              style={{ color: 'var(--color-text)' }}
            />
            <select
              value={toAsset}
              onChange={(e) => setToAsset(e.target.value)}
              className="bg-transparent px-3 py-2 rounded-md text-sm font-bold outline-none"
              style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            >
              {CONVERT_ASSETS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* Rate line */}
        <div className="flex items-center justify-between text-xs px-1" style={{ color: 'var(--color-text-muted)' }}>
          <span>Rate</span>
          <span className="flex items-center gap-1 tabular-nums" style={{ color: 'var(--color-text)' }}>
            1 {fromAsset} ≈ {rate ? rate.toLocaleString('en-US', { maximumFractionDigits: 8 }) : '—'} {toAsset}
            <RefreshCw size={10} />
          </span>
        </div>

        {flash && (
          <div className="text-xs rounded-md px-3 py-2" style={{
            background: flash.kind === 'ok' ? 'rgba(14,203,129,0.12)' : 'rgba(246,70,93,0.12)',
            color: flash.kind === 'ok' ? '#0ecb81' : '#f6465d',
            border: `1px solid ${flash.kind === 'ok' ? 'rgba(14,203,129,0.4)' : 'rgba(246,70,93,0.4)'}`,
          }}>
            {flash.msg}
          </div>
        )}

        <button
          onClick={submit}
          disabled={!rate || fromAsset === toAsset}
          className="w-full py-3 rounded-lg text-sm font-bold text-white disabled:opacity-50"
          style={{ background: 'var(--color-primary)' }}
        >
          Convert
        </button>
      </div>

      <p className="text-[11px] text-center" style={{ color: 'var(--color-text-muted)' }}>
        Rates stream live from Binance <code>!ticker@arr</code>. Conversions execute against your paper wallet instantly with zero fee.
      </p>
    </div>
  )
}
