import type {
  ExchangeInfo,
  Ticker24hr,
  PriceTicker,
  BookTicker,
  DepthSnapshot,
  RecentTrade,
  Kline,
  KlineInterval,
  KlineTuple,
} from './types.ts'

// Primary + redundancy base URLs per Binance docs.
const BASE_URLS = [
  'https://api.binance.com/api/v3',
  'https://api1.binance.com/api/v3',
  'https://api2.binance.com/api/v3',
  'https://api3.binance.com/api/v3',
  'https://api4.binance.com/api/v3',
] as const

export class BinanceRestError extends Error {
  status: number
  code?: number
  constructor(status: number, message: string, code?: number) {
    super(message)
    this.status = status
    this.code = code
    this.name = 'BinanceRestError'
  }
}

interface RequestOptions {
  signal?: AbortSignal
}

async function get<T>(path: string, params: Record<string, string | number | undefined> = {}, opts: RequestOptions = {}): Promise<T> {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')

  let lastErr: unknown
  for (const base of BASE_URLS) {
    const url = `${base}${path}${qs ? `?${qs}` : ''}`
    try {
      const res = await fetch(url, { signal: opts.signal })
      if (!res.ok) {
        let code: number | undefined
        let msg = `HTTP ${res.status}`
        try {
          const body = (await res.json()) as { code?: number; msg?: string }
          if (body.code) code = body.code
          if (body.msg) msg = body.msg
        } catch { /* ignore parse failure */ }
        throw new BinanceRestError(res.status, msg, code)
      }
      return (await res.json()) as T
    } catch (err) {
      if (opts.signal?.aborted) throw err
      lastErr = err
      // on network failure, try the next base URL
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Binance REST failed')
}

// ─── Public market data endpoints ────────────────────────────────────────────

export function getExchangeInfo(opts?: RequestOptions): Promise<ExchangeInfo> {
  return get<ExchangeInfo>('/exchangeInfo', {}, opts)
}

/** GET /api/v3/ticker/24hr — all symbols or a specific symbol */
export function get24hrTicker(symbol?: string, opts?: RequestOptions): Promise<Ticker24hr | Ticker24hr[]> {
  return get<Ticker24hr | Ticker24hr[]>('/ticker/24hr', symbol ? { symbol } : {}, opts)
}

export function get24hrTickers(symbols: string[], opts?: RequestOptions): Promise<Ticker24hr[]> {
  return get<Ticker24hr[]>('/ticker/24hr', { symbols: JSON.stringify(symbols) }, opts)
}

/** GET /api/v3/ticker/price — latest price for one or all symbols */
export function getPriceTicker(symbol?: string, opts?: RequestOptions): Promise<PriceTicker | PriceTicker[]> {
  return get<PriceTicker | PriceTicker[]>('/ticker/price', symbol ? { symbol } : {}, opts)
}

/** GET /api/v3/ticker/bookTicker — best bid/ask */
export function getBookTicker(symbol?: string, opts?: RequestOptions): Promise<BookTicker | BookTicker[]> {
  return get<BookTicker | BookTicker[]>('/ticker/bookTicker', symbol ? { symbol } : {}, opts)
}

/** GET /api/v3/depth — order book snapshot. Valid limits: 5,10,20,50,100,500,1000,5000 */
export function getDepth(symbol: string, limit = 100, opts?: RequestOptions): Promise<DepthSnapshot> {
  return get<DepthSnapshot>('/depth', { symbol, limit }, opts)
}

/** GET /api/v3/trades — recent public trades (no auth) */
export function getRecentTrades(symbol: string, limit = 50, opts?: RequestOptions): Promise<RecentTrade[]> {
  return get<RecentTrade[]>('/trades', { symbol, limit }, opts)
}

/** GET /api/v3/klines — candlesticks. Returns tuples; use getKlines for objects. */
export function getKlineTuples(
  symbol: string,
  interval: KlineInterval,
  limit = 500,
  opts?: RequestOptions,
): Promise<KlineTuple[]> {
  return get<KlineTuple[]>('/klines', { symbol, interval, limit }, opts)
}

export async function getKlines(
  symbol: string,
  interval: KlineInterval,
  limit = 500,
  opts?: RequestOptions,
): Promise<Kline[]> {
  const rows = await getKlineTuples(symbol, interval, limit, opts)
  return rows.map((r) => ({
    openTime: r[0],
    open: r[1],
    high: r[2],
    low: r[3],
    close: r[4],
    volume: r[5],
    closeTime: r[6],
    quoteVolume: r[7],
    trades: r[8],
  }))
}
