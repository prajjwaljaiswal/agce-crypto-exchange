import { tokenStore } from './tokenStore.js'
import { refreshAccessToken } from './refresh.js'
import { ApiError, AUTH_EXPIRED_EVENT } from './http.js'

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

export type OrderSide = 'BUY' | 'SELL'
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LIMIT' | 'STOP_MARKET'
export type TimeInForce = 'GTC' | 'IOC' | 'FOK' | 'POST_ONLY'
export type OrderStatus =
  | 'OPEN'
  | 'NEW'
  | 'PARTIALLY_FILLED'
  | 'FILLED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'EXPIRED'

/** Wire format is string-decimal; the engine keeps exact precision. */
export interface DepthLevel {
  price: string
  quantity: string
}

export interface DepthSnapshot {
  symbol: string
  sequence: number
  bids: DepthLevel[]
  asks: DepthLevel[]
}

export interface TradeTick {
  id?: string | number
  symbol?: string
  price: string
  quantity: string
  side: OrderSide
  /** Epoch ms or ISO string, depending on backend. */
  timestamp: number | string
}

export interface Ticker24h {
  symbol: string
  lastPrice?: string
  priceChange?: string
  priceChangePercent?: string
  high?: string
  low?: string
  open?: string
  volume?: string
  quoteVolume?: string
  bestBid?: string
  bestAsk?: string
}

export interface OhlcvCandle {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime?: number
}

export type OhlcvInterval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d'

export interface PlaceOrderPayload {
  symbol: string
  side: OrderSide
  type: OrderType
  timeInForce: TimeInForce
  quantity: string
  price?: string
  stopPrice?: string
}

export interface Order {
  _id?: string
  orderId: string
  userId?: string
  symbol: string
  side: OrderSide
  type: OrderType
  timeInForce?: TimeInForce
  price?: string
  stopPrice?: string
  quantity: string
  /** Cumulative executed quantity from matching-service. */
  filledQty?: string
  status: OrderStatus
  instance?: string
  createdAt?: string
  updatedAt?: string
}

// ──────────────────────────────────────────────────────────────────────────
// Tiny fetch wrapper
// Separate from lib/http.ts because matching-service doesn't wrap responses
// in the auth service's `{ success, data[], message }` envelope.
// ──────────────────────────────────────────────────────────────────────────

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  auth?: boolean
  signal?: AbortSignal
  query?: Record<string, string | number | undefined>
}

function getBaseUrl(): string {
  const env = import.meta.env as Record<string, string | undefined>
  const raw = env.VITE_MATCHING_API_URL ?? env.VITE_AUTH_API_URL
  if (!raw) {
    throw new Error(
      'VITE_MATCHING_API_URL (or VITE_AUTH_API_URL as fallback) is not set.',
    )
  }
  return raw.replace(/\/+$/, '')
}

function buildQuery(query?: RequestOptions['query']): string {
  if (!query) return ''
  const parts: string[] = []
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === '') continue
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
  }
  return parts.length ? `?${parts.join('&')}` : ''
}

function emitAuthExpired(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))
}

async function parse<T>(response: Response): Promise<T> {
  const text = await response.text()
  let body: unknown
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      throw new ApiError(
        `Non-JSON response from ${response.url} (status ${response.status})`,
        response.status,
      )
    }
  }

  if (!response.ok) {
    const message =
      (body && typeof body === 'object' && 'message' in body
        ? String((body as { message: unknown }).message)
        : null) ?? `Request failed with status ${response.status}`
    const code =
      body && typeof body === 'object' && 'code' in body
        ? String((body as { code: unknown }).code)
        : undefined
    throw new ApiError(message, response.status, code)
  }

  // matching-service returns raw JSON. If a gateway decides to wrap it in
  // { success, data } later, unwrap `data` transparently.
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    'data' in body
  ) {
    return (body as { data: T }).data
  }
  return body as T
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}${buildQuery(opts.query)}`
  const headers = new Headers()
  if (opts.body !== undefined) headers.set('Content-Type', 'application/json')
  if (opts.auth !== false) {
    const token = tokenStore.getAccess()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const init: RequestInit = {
    method: opts.method ?? 'GET',
    headers,
    signal: opts.signal,
  }
  if (opts.body !== undefined) init.body = JSON.stringify(opts.body)

  const response = await fetch(url, init)

  if (response.status === 401 && opts.auth !== false) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      const token = tokenStore.getAccess()
      if (token) headers.set('Authorization', `Bearer ${token}`)
      const retry = await fetch(url, { ...init, headers })
      return parse<T>(retry)
    }
    tokenStore.clear()
    emitAuthExpired()
    throw new ApiError('Session expired', 401)
  }

  return parse<T>(response)
}

// ──────────────────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────────────────

const MARKET = '/api/v1/market'
const ORDERS = '/api/v1/orders'

export const marketApi = {
  depth(symbol: string, levels = 20, granularity = 0, signal?: AbortSignal) {
    return request<DepthSnapshot>(`${MARKET}/depth`, {
      auth: false,
      signal,
      query: { symbol, levels, granularity },
    })
  },

  trades(symbol: string, limit = 50, signal?: AbortSignal) {
    return request<TradeTick[]>(`${MARKET}/trades`, {
      auth: false,
      signal,
      query: { symbol, limit },
    })
  },

  ticker(symbol: string, signal?: AbortSignal) {
    return request<Ticker24h>(`${MARKET}/ticker`, {
      auth: false,
      signal,
      query: { symbol },
    })
  },

  ohlcv(symbol: string, interval: OhlcvInterval = '1m', limit = 500, signal?: AbortSignal) {
    return request<OhlcvCandle[]>(`${MARKET}/ohlcv`, {
      auth: false,
      signal,
      query: { symbol, interval, limit },
    })
  },

  symbols(signal?: AbortSignal) {
    return request<string[]>(`${MARKET}/symbols`, { auth: false, signal })
  },
}

export const ordersApi = {
  place(payload: PlaceOrderPayload, signal?: AbortSignal) {
    return request<Order>(ORDERS, { method: 'POST', body: payload, signal })
  },

  cancel(orderId: string, signal?: AbortSignal) {
    console.log(orderId, " :  ABHAY")
    return request<{ orderId: string; status: OrderStatus }>(
      `${ORDERS}/${encodeURIComponent(orderId)}`,
      { method: 'DELETE', signal },
    )
  },

  mine(limit = 100, signal?: AbortSignal) {
    return request<Order[]>(`${ORDERS}/mine`, { signal, query: { limit } })
  },
}

export const matchingHealth = {
  healthz(signal?: AbortSignal) {
    return request<{ status: string }>('/healthz', { auth: false, signal })
  },
}

// ──────────────────────────────────────────────────────────────────────────
// Wallet API  –  GET /api/v1/wallet/balances[/:code]  &  /wallet/ledger
// JWT required for all wallet endpoints.
// ──────────────────────────────────────────────────────────────────────────

export interface WalletBalance {
  userId?: string
  /** Asset code e.g. "BTC", "USDT" */
  asset: string
  /** Free balance — available for new orders */
  free: string
  /** Held in open orders */
  locked: string
  instance?: string
  updatedAt?: string
}

export interface LedgerEntry {
  id?: string
  asset: string
  type: string
  amount: string
  balanceBefore?: string
  balanceAfter?: string
  createdAt?: string
  description?: string
}

const WALLET = '/api/v1/wallet'

export const walletApi = {
  balances(signal?: AbortSignal) {
    return request<WalletBalance[]>(`${WALLET}/balances`, { signal })
  },

  balance(code: string, signal?: AbortSignal) {
    return request<WalletBalance>(`${WALLET}/balances/${encodeURIComponent(code)}`, { signal })
  },

  ledger(limit = 100, signal?: AbortSignal) {
    return request<LedgerEntry[]>(`${WALLET}/ledger`, { signal, query: { limit } })
  },
}

// ──────────────────────────────────────────────────────────────────────────
// Assets API  –  GET /api/v1/assets
// ──────────────────────────────────────────────────────────────────────────

export interface AssetNetwork {
  network: string
  networkDisplayName: string
  fireblocksAssetId: string
  depositEnabled: boolean
  withdrawEnabled: boolean
  minDeposit: string
  minWithdraw: string
  maxWithdrawPerTx: string
  confirmationsRequired: number
  isActive: boolean
}

export interface Asset {
  assetCode: string
  name: string
  iconUrl: string
  description: string
  decimals: number
  category: 'CRYPTO' | 'STABLECOIN' | 'FIAT' | string
  isActive: boolean
  instance: string
  networks: AssetNetwork[]
}

export const assetsApi = {
  list(signal?: AbortSignal) {
    return request<Asset[]>('/api/v1/assets', { auth: false, signal })
  },

  get(code: string, signal?: AbortSignal) {
    return request<Asset>(`/api/v1/assets/${encodeURIComponent(code)}`, { auth: false, signal })
  },

  networks(code: string, signal?: AbortSignal) {
    return request<AssetNetwork[]>(
      `/api/v1/assets/${encodeURIComponent(code)}/networks`,
      { auth: false, signal },
    )
  },
}

// ──────────────────────────────────────────────────────────────────────────
// Pairs API  –  GET /api/v1/pairs[?quote=X|?base=X]  &  GET /api/v1/pairs/:symbol
// ──────────────────────────────────────────────────────────────────────────

export interface TradingPair {
  symbol: string            // "BTC-USDT"
  baseAsset: string         // "BTC"
  quoteAsset: string        // "USDT"
  displayPriority: number
  isActive: boolean
  isTradable?: boolean
  category?: 'SPOT' | string
  tickSize?: string
  /** Server field name since backend rename. Older builds may still send `stepSize`. */
  lotSize?: string
  stepSize?: string         // legacy fallback
  minNotional?: string
  minOrderQty?: string
  maxOrderQty?: string
  makerFee?: string
  takerFee?: string
  /** Fallback price (from Binance or last known) used when no local trades yet. */
  referencePrice?: string
  referencePriceSource?: 'binance' | string
  referencePriceUpdatedAt?: string
  instance?: string
}

export interface TradingPairDetail extends TradingPair {
  baseMeta: Asset
  quoteMeta: Asset
}

export interface PairsQuery {
  quote?: string
  base?: string
  [key: string]: string | undefined
}

export const pairsApi = {
  list(query?: PairsQuery, signal?: AbortSignal) {
    return request<TradingPair[]>('/api/v1/pairs', { auth: false, signal, query })
  },

  get(symbol: string, signal?: AbortSignal) {
    return request<TradingPairDetail>(
      `/api/v1/pairs/${encodeURIComponent(symbol)}`,
      { auth: false, signal },
    )
  },
}
