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

export type OhlcvInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w'

/**
 * Availability decides WHERE the backend sources the data from:
 *   LOCAL  → our matching-service trade tape / candle collection.
 *   GLOBAL → market-data-service proxies to Binance.
 * One query param, same response shape per endpoint.
 */
export type MarketAvailability = 'LOCAL' | 'GLOBAL'

/**
 * Binance kline REST response — a 12-element array per candle.
 * Index layout:
 *   0 openTime, 1 open, 2 high, 3 low, 4 close, 5 baseVolume,
 *   6 closeTime, 7 quoteVolume, 8 tradeCount,
 *   9 takerBuyBase, 10 takerBuyQuote, 11 unused
 */
export type BinanceKlineTuple = [
  number, string, string, string, string, string,
  number, string, number, string, string, string,
]

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

/** User-scoped trade fill returned by GET /api/v1/orders/mine/trades. */
export interface UserTrade {
  tradeId: string
  symbol: string
  price: string
  quantity: string
  makerOrderId: string
  takerOrderId: string
  makerUserId: string
  takerUserId: string
  /** Side of the taker leg (not necessarily the current user). */
  takerSide: OrderSide
  /** Epoch ms. */
  timestamp: number
  instance?: string
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

/**
 * Base URL for market-data-service endpoints (/api/v1/klines etc.).
 * Prefers VITE_MARKET_DATA_URL (same env the socket client reads), and
 * falls back to the matching/auth base URL so a single-gateway deploy
 * still works without adding env vars.
 */
function getMarketDataBaseUrl(): string {
  const env = import.meta.env as Record<string, string | undefined>
  const raw =
    env.VITE_MARKET_DATA_URL ??
    env.VITE_MATCHING_API_URL ??
    env.VITE_AUTH_API_URL
  if (!raw) {
    throw new Error(
      'VITE_MARKET_DATA_URL (or VITE_MATCHING_API_URL / VITE_AUTH_API_URL) is not set.',
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

  ohlcv(
    symbol: string,
    interval: OhlcvInterval = '1m',
    limit = 500,
    opts: {
      availability?: MarketAvailability
      from?: number
      to?: number
      signal?: AbortSignal
    } = {},
  ) {
    const { availability = 'LOCAL', from, to, signal } = opts
    const query: Record<string, string | number> = {
      symbol,
      interval,
      limit,
      availability,
    }
    if (from !== undefined) query.from = from
    if (to !== undefined) query.to = to
    return request<OhlcvCandle[]>(`${MARKET}/ohlcv`, {
      auth: false,
      signal,
      query,
    })
  },

  symbols(signal?: AbortSignal) {
    return request<string[]>(`${MARKET}/symbols`, { auth: false, signal })
  },
}

/**
 * Binance REST proxy exposed by market-data-service via the gateway.
 * Useful for GLOBAL pairs where the matching engine has no trades and
 * the local /market/ticker would return zeros — we need Binance's
 * 24h stats for the initial paint, then WS events keep them live.
 */
export const binanceMarketApi = {
  /**
   * GET /api/v1/binance/ticker/24hr?symbol=BTCUSDT
   * Response is Binance's raw 24h ticker shape (lastPrice, priceChange,
   * priceChangePercent, highPrice, lowPrice, volume, quoteVolume, ...).
   */
  ticker24h(symbol: string, signal?: AbortSignal) {
    // Strip dashes — Binance symbols never carry them.
    const sym = symbol.replace(/-/g, '').toUpperCase()
    return request<Record<string, unknown>>(
      '/api/v1/binance/ticker/24hr',
      { auth: false, signal, query: { symbol: sym } },
    )
  },
}

/**
 * Kline endpoint on market-data-service — returns the Binance kline shape
 * (array of 12-element arrays) regardless of availability. Prefer this
 * over `marketApi.ohlcv` for new chart code: it supports startTime/endTime
 * pagination for horizontal scroll and carries quote/taker-buy volumes.
 *
 *   GET /api/v1/klines?symbol=BTC-USDT&interval=1m
 *                     &availability=LOCAL|GLOBAL
 *                     &startTime=&endTime=&limit=
 */
export const klinesApi = {
  async klines(
    symbol: string,
    interval: OhlcvInterval = '1m',
    opts: {
      availability?: MarketAvailability
      startTime?: number
      endTime?: number
      limit?: number
      signal?: AbortSignal
    } = {},
  ): Promise<BinanceKlineTuple[]> {
    const {
      availability = 'LOCAL',
      startTime,
      endTime,
      limit = 500,
      signal,
    } = opts

    // Binance symbols carry no dash (BTCUSDT). Our backend already handles
    // the dash for LOCAL; for GLOBAL it collapses server-side. We still
    // normalise here so both paths accept either form.
    const sym = availability === 'GLOBAL' ? symbol.replace(/-/g, '') : symbol

    const params = new URLSearchParams()
    params.set('symbol', sym)
    params.set('interval', interval)
    params.set('availability', availability)
    params.set('limit', String(limit))
    if (startTime !== undefined) params.set('startTime', String(startTime))
    if (endTime !== undefined) params.set('endTime', String(endTime))

    const url = `${getMarketDataBaseUrl()}/api/v1/klines?${params.toString()}`
    const res = await fetch(url, { method: 'GET', signal })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new ApiError(
        `klines fetch failed: ${body || res.statusText}`,
        res.status,
      )
    }
    return (await res.json()) as BinanceKlineTuple[]
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

  myTrades(limit = 100, signal?: AbortSignal) {
    return request<UserTrade[]>(`${ORDERS}/mine/trades`, {
      signal,
      query: { limit },
    })
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

export interface EstimatedBalanceAsset {
  asset: string
  /** Relative path from the backend (e.g. "/icons/btc.svg") — resolve against VITE_MATCHING_API_URL. */
  iconPath?: string
  free: string
  locked: string
  total: string
  valueInPreferredCurrency: string
  /** USD value as computed by the backend. */
  valueInUSD?: string
}

export interface EstimatedBalanceResponse {
  totalValue: string
  /** Total portfolio value in USD, as computed by the backend. */
  totalValueInUSD?: string
  preferredCurrency: string
  assets: EstimatedBalanceAsset[]
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

  estimatedBalance(signal?: AbortSignal) {
    return request<EstimatedBalanceResponse>(`${WALLET}/estimated-balance`, { signal })
  },
}

// ──────────────────────────────────────────────────────────────────────────
// Custody API  –  Deposit address generation & history
// ──────────────────────────────────────────────────────────────────────────

export interface DepositAddressResponse {
  asset: string
  network: string
  networkDisplayName: string
  address: string
  tag: string | null
  fireblocksAssetId: string
  vaultAccountId: string
  minDeposit: string
  confirmationsRequired: number
}

export interface CustodyAddressEntry {
  asset: string
  network: string
  address: string
  tag?: string
  createdAt: string
}

export interface CustodyOverviewResponse {
  userId: string
  vaultAccountId: string
  addresses: CustodyAddressEntry[]
}

export interface DepositRecord {
  id: string
  assetId: string
  network: string
  address: string
  txId: string | null
  amount: string
  status: string
  createdAt: string
}

const CUSTODY = '/api/v1/custody'

export const custodyApi = {
  me(signal?: AbortSignal) {
    return request<CustodyOverviewResponse>(`${CUSTODY}/me`, { signal })
  },

  depositAddress(
    payload: { asset: string; network: string },
    signal?: AbortSignal,
  ) {
    return request<DepositAddressResponse>(`${CUSTODY}/deposit-address`, {
      method: 'POST',
      body: payload,
      signal,
    })
  },

  depositHistory(limit = 50, signal?: AbortSignal) {
    return request<DepositRecord[]>(`${CUSTODY}/deposits`, { signal, query: { limit } })
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

export interface AssetLink {
  label: string
  url: string
}

export interface Asset {
  assetCode: string
  name: string
  iconUrl: string
  description: string
  decimals: number
  minDeposit?: string
  depositFee?: string
  makerFee?: string
  takerFee?: string
  totalSupply?: string
  circulatingSupply?: string
  issueDate?: string
  links?: AssetLink[]
  category: 'CRYPTO' | 'STABLECOIN' | 'FIAT' | string
  isActive: boolean
  instance: string
  networks: AssetNetwork[]
}

export const assetsApi = {
  list(signal?: AbortSignal, search?: string) {
    return request<Asset[]>('/api/v1/assets', {
      auth: false,
      signal,
      query: { q: search },
    })
  },

  get(code: string, signal?: AbortSignal) {
    return request<Asset>(`/api/v1/assets/${encodeURIComponent(code)}`, { auth: false, signal })
  },

  networks(code: string, signal?: AbortSignal, search?: string) {
    return request<AssetNetwork[]>(
      `/api/v1/assets/${encodeURIComponent(code)}/networks`,
      { auth: false, signal, query: { q: search } },
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
  /**
   * Where market data for this pair is sourced:
   *   LOCAL  → AGCE matching engine (local order book + trades).
   *   GLOBAL → Binance (chart REST + ticker WS come through market-data-service).
   * Set per-pair by asset-service; see PairAvailability on the backend.
   */
  availability?: MarketAvailability
  /** Live market price maintained by the backend. For GLOBAL pairs this
   *  tracks Binance; for LOCAL pairs it's updated by the matching engine
   *  on each trade. Absent for a pair with no price yet. */
  price?: string
  priceUpdatedAt?: string
  /** Admin-supplied seed price at pair creation (from /api/v1/pairs/admin).
   *  Useful as a fallback when `price` is absent. */
  initialPrice?: string
  initialPriceSource?: 'admin' | 'binance' | string
  initialPriceUpdatedAt?: string
  /** Legacy field name. Older backend builds may still return this;
   *  newer builds populate `price` / `initialPrice` instead. */
  referencePrice?: string
  referencePriceSource?: 'binance' | string
  referencePriceUpdatedAt?: string
  instance?: string
  iconUrl?: string
  /** Per-asset icon URLs returned on detail + list responses. `iconUrl`
   *  is kept as an alias for `baseIconUrl` for backwards compatibility. */
  baseIconUrl?: string | null
  quoteIconUrl?: string | null
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
