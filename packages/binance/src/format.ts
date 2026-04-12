// Shared formatting helpers used across the exchange UI.
// Keeps number display consistent everywhere that renders Binance data.

/** Smart price formatting — mirrors Binance's significant-digit display. */
export function fmtPrice(v: string | number): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (isNaN(n) || n === 0) return '0'
  if (n >= 10000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (n >= 1) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  return parseFloat(n.toPrecision(6)).toString()
}

/** Volume / turnover with K/M/B suffix. */
export function fmtVol(v: string | number): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K'
  return n.toFixed(2)
}

/** Amount — comma-thousands, no scientific notation, trim trailing zeros. */
export function fmtAmount(v: string | number): string {
  if (v === null || v === undefined || v === '' || v === '0') return '0'
  let str = typeof v === 'number' ? String(v) : v
  if (str.includes('e') || str.includes('E')) str = Number(str).toFixed(20)
  if (str.includes('.')) str = str.replace(/0+$/, '').replace(/\.$/, '')
  if (!str || str === '0') return '0'
  const parts = str.split('.')
  const intPart = parts[0] ?? '0'
  const decPart = parts[1] ?? ''
  const signed = intPart.startsWith('-')
  const digits = signed ? intPart.slice(1) : intPart
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formatted = signed ? '-' + withCommas : withCommas
  return decPart ? `${formatted}.${decPart}` : formatted
}

/** Percentage with sign, e.g. "+1.23%" or "-0.45%". */
export function fmtPct(v: string | number): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (isNaN(n)) return '0.00%'
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
}

/** Human time — "12:34:56" (local). */
export function fmtTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-GB', { hour12: false })
}

/** Full date — "2026-04-12 12:34:56". */
export function fmtDateTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
