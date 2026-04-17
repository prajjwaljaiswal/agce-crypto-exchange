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