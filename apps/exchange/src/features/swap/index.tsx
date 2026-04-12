import { useState } from 'react'
import { ArrowUpDown, ChevronDown, Info } from 'lucide-react'

const currencies = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
  { symbol: 'USDT', name: 'Tether', icon: '$', color: '#26A17B' },
  { symbol: 'BNB', name: 'BNB', icon: 'B', color: '#F3BA2F' },
  { symbol: 'SOL', name: 'Solana', icon: '◎', color: '#9945FF' },
  { symbol: 'AGCE', name: 'AGCE Token', icon: 'A', color: '#D1AA67' },
]

export function SwapPage() {
  const [fromCurrency, setFromCurrency] = useState(currencies[0])
  const [toCurrency, setToCurrency] = useState(currencies[2])
  const [fromAmount, setFromAmount] = useState('')
  const [showFromSelect, setShowFromSelect] = useState(false)
  const [showToSelect, setShowToSelect] = useState(false)

  const toAmount = fromAmount ? (parseFloat(fromAmount) * 63450.25).toFixed(2) : ''

  function swapCurrencies() {
    const tmp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(tmp)
    setFromAmount(toAmount)
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[460px]">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2 text-center">Quick Swap</h1>
        <p className="text-[var(--color-text-muted)] text-sm text-center mb-8">
          Instantly swap between any supported assets
        </p>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-3">
          {/* From */}
          <div>
            <label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">From</label>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <button
                    onClick={() => { setShowFromSelect(!showFromSelect); setShowToSelect(false) }}
                    className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${fromCurrency.color}22`, color: fromCurrency.color }}
                    >
                      {fromCurrency.icon}
                    </span>
                    {fromCurrency.symbol}
                    <ChevronDown size={14} />
                  </button>
                  {showFromSelect && (
                    <div className="absolute top-full mt-1 left-0 z-20 w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl overflow-hidden">
                      {currencies.map((c) => (
                        <button
                          key={c.symbol}
                          onClick={() => { setFromCurrency(c); setShowFromSelect(false) }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors text-left"
                        >
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: `${c.color}22`, color: c.color }}
                          >
                            {c.icon}
                          </span>
                          <span className="font-semibold">{c.symbol}</span>
                          <span className="text-[var(--color-text-muted)] text-xs">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-right text-xs text-[var(--color-text-muted)]">
                  Balance: 0.05823 {fromCurrency.symbol}
                </div>
              </div>
              <input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="w-full bg-transparent text-2xl font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-border)]"
              />
            </div>
          </div>

          {/* Swap direction */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="w-10 h-10 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-black transition-all"
            >
              <ArrowUpDown size={18} />
            </button>
          </div>

          {/* To */}
          <div>
            <label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">To</label>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <button
                    onClick={() => { setShowToSelect(!showToSelect); setShowFromSelect(false) }}
                    className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${toCurrency.color}22`, color: toCurrency.color }}
                    >
                      {toCurrency.icon}
                    </span>
                    {toCurrency.symbol}
                    <ChevronDown size={14} />
                  </button>
                  {showToSelect && (
                    <div className="absolute top-full mt-1 left-0 z-20 w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl overflow-hidden">
                      {currencies.map((c) => (
                        <button
                          key={c.symbol}
                          onClick={() => { setToCurrency(c); setShowToSelect(false) }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors text-left"
                        >
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: `${c.color}22`, color: c.color }}
                          >
                            {c.icon}
                          </span>
                          <span className="font-semibold">{c.symbol}</span>
                          <span className="text-[var(--color-text-muted)] text-xs">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-right text-xs text-[var(--color-text-muted)]">
                  Balance: 1,240.50 {toCurrency.symbol}
                </div>
              </div>
              <div className="text-2xl font-semibold text-[var(--color-text-muted)]">
                {toAmount || '0.00'}
              </div>
            </div>
          </div>

          {/* Rate and fee info */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-muted)] flex items-center gap-1">
                Rate <Info size={12} />
              </span>
              <span className="text-[var(--color-text)]">
                1 {fromCurrency.symbol} = 63,450.25 {toCurrency.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-muted)]">Fee</span>
              <span className="text-[var(--color-text)]">0.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-muted)]">Slippage</span>
              <span className="text-[var(--color-primary)]">0.5%</span>
            </div>
          </div>

          <button className="w-full rounded-xl bg-[var(--color-primary)] text-black font-semibold py-4 text-base hover:opacity-90 transition-opacity mt-1">
            Swap Now
          </button>
        </div>
      </div>
    </div>
  )
}
