import { useState, useEffect, useRef } from 'react'
import { placeOrder, useBalance } from '../paper/index.js'

export function TradeForm({ base, quote, lastPrice }: { base: string; quote: string; lastPrice: string }) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'conditional'>('limit')
  const [condType, setCondType] = useState<'stop-limit' | 'stop-market'>('stop-limit')
  const [condOpen, setCondOpen] = useState(false)
  const condRef = useRef<HTMLDivElement>(null)
  const [price, setPrice] = useState(lastPrice)
  const [amount, setAmount] = useState('')
  const [slider, setSlider] = useState(0)
  const [flash, setFlash] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)

  const quoteBalance = useBalance(quote)
  const baseBalance = useBalance(base)

  useEffect(() => { if (orderType === 'market') setPrice(lastPrice) }, [lastPrice, orderType])

  useEffect(() => {
    if (!condOpen) return
    const handler = (e: MouseEvent) => {
      if (condRef.current && !condRef.current.contains(e.target as Node)) setCondOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [condOpen])
  useEffect(() => {
    if (!flash) return
    const id = setTimeout(() => setFlash(null), 3000)
    return () => clearTimeout(id)
  }, [flash])

  // Slider controls amount based on available balance.
  useEffect(() => {
    const priceNum = parseFloat(price.replace(/,/g, ''))
    if (!priceNum || !isFinite(priceNum)) return
    if (slider === 0) return
    if (side === 'buy') {
      const maxQuote = quoteBalance.free * (slider / 100)
      setAmount((maxQuote / priceNum).toFixed(6).replace(/\.?0+$/, ''))
    } else {
      const maxBase = baseBalance.free * (slider / 100)
      setAmount(maxBase.toFixed(6).replace(/\.?0+$/, ''))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slider])

  const total = price && amount ? (parseFloat(price.replace(/,/g, '')) * parseFloat(amount)).toFixed(2) : ''
  const green = '#0ecb81'
  const red = '#f6465d'
  const accent = side === 'buy' ? green : red

  const handleSubmit = () => {
    const priceNum = parseFloat(price.replace(/,/g, ''))
    const qtyNum = parseFloat(amount)
    if (!priceNum || !qtyNum) {
      setFlash({ kind: 'err', msg: 'Enter price and amount' })
      return
    }
    const result = placeOrder({
      symbol: `${base}${quote}`,
      base,
      quote,
      side: side === 'buy' ? 'BUY' : 'SELL',
      type: orderType === 'market' ? 'MARKET' : 'LIMIT',
      price: priceNum,
      quantity: qtyNum,
    })
    if (result.ok) {
      setFlash({ kind: 'ok', msg: `${orderType === 'market' ? 'Market' : 'Limit'} ${side} placed` })
      setAmount('')
      setSlider(0)
    } else {
      setFlash({ kind: 'err', msg: result.error ?? 'Order failed' })
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: 'var(--color-bg)' }}>
      {/* Spot header */}
      <div className="px-4 h-10 flex items-center shrink-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Spot</span>
      </div>

      <div className="px-4 pt-3 flex flex-col gap-3 flex-1">
        {/* Buy / Sell toggle */}
        <div className="flex gap-0 rounded-md overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
          <button className="flex-1 py-2 text-sm font-bold" style={{ background: side === 'buy' ? green : 'transparent', color: side === 'buy' ? '#fff' : 'var(--color-text-muted)' }} onClick={() => setSide('buy')}>Buy</button>
          <button className="flex-1 py-2 text-sm font-bold" style={{ background: side === 'sell' ? red : 'transparent', color: side === 'sell' ? '#fff' : 'var(--color-text-muted)' }} onClick={() => setSide('sell')}>Sell</button>
        </div>

        {/* Order type tabs */}
        <div className="flex items-center gap-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
          {(['limit', 'market'] as const).map(t => (
            <button
              key={t}
              className="text-xs pb-2 capitalize"
              style={{
                color: orderType === t ? 'var(--color-text)' : 'var(--color-text-muted)',
                borderBottom: orderType === t ? '2px solid var(--color-text)' : '2px solid transparent',
                marginBottom: '-1px',
              }}
              onClick={() => { setOrderType(t); setCondOpen(false) }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}

          {/* Conditional + dropdown */}
          <div className="relative" ref={condRef}>
            <button
              className="text-xs pb-2 flex items-center gap-1"
              style={{
                color: orderType === 'conditional' ? 'var(--color-text)' : 'var(--color-text-muted)',
                borderBottom: orderType === 'conditional' ? '2px solid var(--color-text)' : '2px solid transparent',
                marginBottom: '-1px',
              }}
              onClick={() => setCondOpen((o) => !o)}
            >
              {orderType === 'conditional'
                ? (condType === 'stop-limit' ? 'Stop Limit' : 'Stop Market')
                : 'Conditional'}
              <span className="text-[10px] transition-transform" style={{ transform: condOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
            </button>

            {condOpen && (
              <div
                className="absolute left-0 top-full mt-1 rounded-lg shadow-2xl overflow-hidden z-50 min-w-[140px]"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                {([
                  { key: 'stop-limit', label: 'Stop Limit' },
                  { key: 'stop-market', label: 'Stop Market' },
                ] as const).map((opt) => (
                  <button
                    key={opt.key}
                    className="w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-[var(--color-surface-2)]"
                    style={{
                      color: 'var(--color-text)',
                      background: orderType === 'conditional' && condType === opt.key ? 'var(--color-surface-2)' : 'transparent',
                    }}
                    onClick={() => {
                      setCondType(opt.key)
                      setOrderType('conditional')
                      setCondOpen(false)
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="text-xs block mb-1" style={{ color: 'var(--color-text-muted)' }}>Price</label>
          <div className="flex items-center rounded-md px-3 py-2" style={{ border: '1px solid var(--color-border)' }}>
            <input type="text" value={price} onChange={e => setPrice(e.target.value)} disabled={orderType === 'market'} className="flex-1 bg-transparent outline-none text-sm" style={{ color: 'var(--color-text)' }} />
            <span className="text-xs font-medium ml-2 px-1.5 py-0.5 rounded" style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface-2)' }}>{quote}</span>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs block mb-1" style={{ color: 'var(--color-text-muted)' }}>Amount</label>
          <div className="flex items-center rounded-md px-3 py-2" style={{ border: '1px solid var(--color-border)' }}>
            <input type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--color-text-subtle)]" style={{ color: 'var(--color-text)' }} />
            <span className="text-xs font-medium ml-2 px-1.5 py-0.5 rounded" style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface-2)' }}>{base}</span>
          </div>
        </div>

        {/* Slider */}
        <div>
          <input type="range" min={0} max={100} value={slider} onChange={e => setSlider(Number(e.target.value))} className="w-full h-1 appearance-none rounded-full" style={{ background: `linear-gradient(to right, ${accent} ${slider}%, var(--color-border) ${slider}%)`, accentColor: accent }} />
          <div className="flex justify-between mt-1">
            {[0, 25, 50, 75, 100].map(v => (
              <button key={v} className="w-2.5 h-2.5 rounded-full transition-colors" style={{ background: slider >= v ? accent : 'var(--color-surface-2)', border: `2px solid ${slider >= v ? accent : 'var(--color-border)'}` }} onClick={() => setSlider(v)} />
            ))}
          </div>
          <div className="flex justify-between mt-0.5 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
            {['0%', '25%', '50%', '75%', '100%'].map(l => <span key={l}>{l}</span>)}
          </div>
        </div>

        {/* Total */}
        <div>
          <label className="text-xs block mb-1" style={{ color: 'var(--color-text-muted)' }}>Total</label>
          <div className="flex items-center rounded-md px-3 py-2" style={{ border: '1px solid var(--color-border)' }}>
            <input type="text" value={total} readOnly placeholder="≈ 1" className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--color-text-subtle)]" style={{ color: 'var(--color-text)' }} />
            <span className="text-xs font-medium ml-2 px-1.5 py-0.5 rounded" style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface-2)' }}>{quote}</span>
          </div>
        </div>

        {/* Available / Max */}
        <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <span>Available</span>
          <span>{side === 'buy' ? `${quoteBalance.free.toFixed(4)} ${quote}` : `${baseBalance.free.toFixed(6)} ${base}`} ●</span>
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <span>Max</span>
          <span>
            {(() => {
              const p = parseFloat(price.replace(/,/g, '')) || 0
              if (side === 'buy') return p > 0 ? `${(quoteBalance.free / p).toFixed(6)} ${base}` : `0 ${base}`
              return `${baseBalance.free.toFixed(6)} ${base}`
            })()}
          </span>
        </div>

        {/* FOK / IOC */}
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}><input type="checkbox" className="w-3 h-3" /> FOK</label>
          <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}><input type="checkbox" className="w-3 h-3" /> IOC</label>
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

        {/* Buy/Sell button */}
        <button className="w-full py-2.5 rounded-full text-sm font-bold" style={{ background: accent, color: '#fff' }} onClick={handleSubmit}>
          {side === 'buy' ? `Buy ${base}` : `Sell ${base}`}
        </button>

        {/* Maker/Taker */}
        <p className="text-center text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Maker 0.2%&ensp;Taker 0.2%</p>

        {/* Staking promo */}
        <div className="flex items-center justify-between px-3 py-2 rounded-md" style={{ border: '1px solid var(--color-border)' }}>
          <span className="text-xs" style={{ color: '#0ecb81' }}>BTC Staking Estimated APR 2.45%</span>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>›</span>
        </div>
      </div>

      {/* Assets */}
      <div className="px-4 py-3 shrink-0" style={{ borderTop: '1px solid var(--color-border)' }}>
        <p className="text-sm font-bold mb-2" style={{ color: 'var(--color-text)' }}>Assets</p>
        <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <span>{quote} Balance</span><span>{quoteBalance.free.toFixed(4)} {quote}</span>
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          <span>{base} Balance</span><span>{baseBalance.free.toFixed(6)} {base}</span>
        </div>
        {(quoteBalance.locked > 0 || baseBalance.locked > 0) && (
          <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
            <span>In Orders</span>
            <span>{quoteBalance.locked.toFixed(2)} {quote} · {baseBalance.locked.toFixed(6)} {base}</span>
          </div>
        )}
        <div className="flex gap-2 mt-3">
          {['Deposit', 'Convert', 'Transfer'].map(l => (
            <a key={l} href={`/wallet/${l.toLowerCase()}`} className="flex-1 py-2 rounded-md text-xs font-semibold text-center" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
