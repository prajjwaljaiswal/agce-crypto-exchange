/** Smart price formatting — keeps significant digits like Binance */
export function fmtPrice(v: string | number): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (isNaN(n) || n === 0) return '0'
  if (n >= 10000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (n >= 1) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  // For small numbers, show all significant digits
  const s = n.toPrecision(6)
  return parseFloat(s).toString()
}

/** Format volume with K/M/B suffixes */
export function fmtVol(v: string | number): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K'
  return n.toFixed(2)
}

/** Format amount — add commas, no abbreviations */
export function fmtAmount(v: string): string {
  if (!v || v === '0') return '0'
  // If the string contains 'e' (scientific notation from JSON.parse), expand it
  let str = v
  if (str.includes('e') || str.includes('E')) {
    str = Number(str).toFixed(20)
  }
  // Remove trailing zeros after decimal
  if (str.includes('.')) {
    str = str.replace(/0+$/, '').replace(/\.$/, '')
  }
  // If empty after cleanup
  if (!str || str === '0') return '0'
  // Split integer and decimal
  const parts = str.split('.')
  const intPart = parts[0]
  const decPart = parts[1] || ''
  // Add commas to integer part
  const signed = intPart.startsWith('-')
  const digits = signed ? intPart.slice(1) : intPart
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formatted = signed ? '-' + withCommas : withCommas
  return decPart ? `${formatted}.${decPart}` : formatted
}

export function fmtUsdCompact(n: number | null): string {
  if (n == null) return '—'
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`
  return `$${n.toFixed(2)}`
}

export function fmtSupply(n: number | null, sym: string): string {
  if (n == null) return `∞ ${sym}`
  return `${Math.round(n).toLocaleString('en-US')} ${sym}`
}

export function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return iso.slice(0, 10)
}

export function fmtTradeTime(ms: number): string {
  const d = new Date(ms)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function fmtTradeQty(n: number): string {
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
  if (n >= 1) return n.toFixed(4)
  return n.toFixed(6).replace(/\.?0+$/, '') || '0'
}

export function fmtTradePrice(n: number): string {
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (n >= 1) return n.toFixed(2)
  return n.toFixed(6).replace(/\.?0+$/, '')
}

export function decimalsForPrecision(p: number): number {
  if (p >= 1) return 0
  const s = p.toString()
  const idx = s.indexOf('.')
  return idx < 0 ? 0 : s.length - idx - 1
}

export function fmtGroupedPrice(price: number, precision: number): string {
  const d = decimalsForPrecision(precision)
  return price.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
}

export function fmtFlowNum(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (abs >= 1e3) return `${(n / 1e3).toFixed(2)}K`
  return n.toFixed(2)
}

export function fmtDepthQty(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (abs >= 1e3) return `${(n / 1e3).toFixed(2)}K`
  return n.toFixed(2)
}

/** Extract base asset from a Binance symbol by stripping the quote suffix. */
export function parseBase(symbol: string): string {
  return symbol.endsWith('USDT') ? symbol.slice(0, -4)
    : symbol.endsWith('USDC') ? symbol.slice(0, -4)
    : symbol.endsWith('BTC') ? symbol.slice(0, -3)
    : symbol.endsWith('BNB') ? symbol.slice(0, -3)
    : symbol.endsWith('ETH') ? symbol.slice(0, -3)
    : symbol
}
