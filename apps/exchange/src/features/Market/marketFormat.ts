export const COIN_NAMES: Record<string, string> = {
  BTC: 'Bitcoin', ETH: 'Ethereum', BNB: 'Binance Coin', SOL: 'Solana',
  XRP: 'Ripple', ADA: 'Cardano', DOGE: 'Dogecoin', DOT: 'Polkadot',
  LINK: 'Chainlink', MATIC: 'Polygon', LTC: 'Litecoin', AVAX: 'Avalanche',
  TRX: 'TRON', UNI: 'Uniswap', ATOM: 'Cosmos', NEAR: 'NEAR Protocol',
  SHIB: 'Shiba Inu', PEPE: 'Pepe', APT: 'Aptos', ARB: 'Arbitrum',
  OP: 'Optimism', SUI: 'Sui', TON: 'Toncoin', XLM: 'Stellar',
  HBAR: 'Hedera', FIL: 'Filecoin', ICP: 'Internet Computer',
  USDC: 'USD Coin', BCH: 'Bitcoin Cash', ETC: 'Ethereum Classic',
}

const QUOTES = ['USDT', 'USDC', 'BTC', 'ETH', 'BNB', 'BUSD', 'DAI', 'TUSD', 'FDUSD', 'TRY', 'EUR']

export interface SplitSymbol {
  base: string
  quote: string
}

/** Accepts dashed (`BTC-USDT`) or concat (`BTCUSDT`) symbol formats. */
export function splitPair(symbol: string): SplitSymbol {
  if (symbol.includes('-')) {
    const [base, quote = ''] = symbol.split('-')
    return { base, quote }
  }
  for (const q of QUOTES) {
    if (symbol.endsWith(q) && symbol.length > q.length) {
      return { base: symbol.slice(0, symbol.length - q.length), quote: q }
    }
  }
  return { base: symbol, quote: '' }
}

export function fmtPrice(n: number): string {
  if (!Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
  if (abs >= 1) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  if (abs >= 0.01) return n.toFixed(4)
  if (abs > 0) return n.toFixed(8)
  return '0'
}

export function fmtShortUsd(n: number): string {
  if (!Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(2)}K`
  return `$${n.toFixed(2)}`
}

// Approximate circulating supply for display-only market cap. Values drift over
// time; refresh if a real supply feed becomes available.
export const CIRCULATING_SUPPLY: Record<string, number> = {
  BTC: 19_700_000, ETH: 120_000_000, BNB: 153_000_000, SOL: 450_000_000,
  XRP: 54_000_000_000, ADA: 35_000_000_000, DOGE: 144_000_000_000,
  DOT: 1_400_000_000, LINK: 588_000_000, MATIC: 10_000_000_000,
  POL: 10_000_000_000, LTC: 74_000_000, AVAX: 408_000_000,
  TRX: 88_000_000_000, UNI: 598_000_000, ATOM: 390_000_000,
  NEAR: 1_080_000_000, SHIB: 589_000_000_000_000, PEPE: 420_000_000_000_000,
  APT: 516_000_000, ARB: 4_250_000_000, OP: 1_500_000_000,
  SUI: 3_000_000_000, TON: 2_500_000_000, XLM: 29_000_000_000,
  HBAR: 36_000_000_000, FIL: 594_000_000, ICP: 473_000_000,
  USDC: 32_000_000_000, BCH: 19_700_000, ETC: 148_000_000,
}

export function marketCap(base: string, lastPrice: number): number {
  const supply = CIRCULATING_SUPPLY[base]
  return supply && lastPrice ? supply * lastPrice : 0
}

export function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return '—'
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

export function coinIconSrc(base: string): string {
  return `/images/market-img/icons/${base.toLowerCase()}.svg`
}

export function coinDisplayName(base: string): string {
  return COIN_NAMES[base] ?? base
}