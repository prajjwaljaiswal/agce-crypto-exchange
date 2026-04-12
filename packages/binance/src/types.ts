// Binance Spot API — types used by REST + WS helpers.
// Public market data only; private endpoints live behind a backend and are not typed here.

export type KlineInterval =
  | '1s' | '1m' | '3m' | '5m' | '15m' | '30m'
  | '1h' | '2h' | '4h' | '6h' | '8h' | '12h'
  | '1d' | '3d' | '1w' | '1M'

export interface ExchangeSymbol {
  symbol: string
  status: string
  baseAsset: string
  baseAssetPrecision: number
  quoteAsset: string
  quotePrecision: number
  quoteAssetPrecision: number
  orderTypes: string[]
  isSpotTradingAllowed: boolean
  filters: Array<Record<string, unknown>>
}

export interface ExchangeInfo {
  timezone: string
  serverTime: number
  symbols: ExchangeSymbol[]
}

export interface Ticker24hr {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  count: number
}

export interface PriceTicker {
  symbol: string
  price: string
}

export interface BookTicker {
  symbol: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
}

/** REST /api/v3/depth response */
export interface DepthSnapshot {
  lastUpdateId: number
  bids: [string, string][] // [price, qty]
  asks: [string, string][]
}

/** REST /api/v3/trades response entry */
export interface RecentTrade {
  id: number
  price: string
  qty: string
  quoteQty: string
  time: number
  isBuyerMaker: boolean
  isBestMatch: boolean
}

// ─── Kline ───────────────────────────────────────────────────────────────────
// REST returns an array; we expose it as a typed tuple.
export type KlineTuple = [
  number,  // openTime
  string,  // open
  string,  // high
  string,  // low
  string,  // close
  string,  // volume
  number,  // closeTime
  string,  // quoteAssetVolume
  number,  // numberOfTrades
  string,  // takerBuyBaseAssetVolume
  string,  // takerBuyQuoteAssetVolume
  string,  // unused
]

export interface Kline {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteVolume: string
  trades: number
}

// ─── WebSocket payloads ──────────────────────────────────────────────────────

/** <symbol>@ticker — 24hr rolling window single-symbol ticker */
export interface WsTicker {
  e: '24hrTicker'
  E: number    // event time
  s: string    // symbol
  p: string    // price change
  P: string    // price change percent
  w: string    // weighted avg price
  x: string    // previous day close price
  c: string    // last price
  Q: string    // last qty
  b: string    // best bid price
  B: string    // best bid qty
  a: string    // best ask price
  A: string    // best ask qty
  o: string    // open price
  h: string    // high price
  l: string    // low price
  v: string    // total traded base asset volume
  q: string    // total traded quote asset volume
  O: number    // statistics open time
  C: number    // statistics close time
  F: number    // first trade id
  L: number    // last trade id
  n: number    // total number of trades
}

/** <symbol>@miniTicker — lightweight 24hr rolling window (cheaper than full @ticker) */
export interface WsMiniTicker {
  e: '24hrMiniTicker'
  E: number    // event time
  s: string    // symbol
  c: string    // close / last
  o: string    // open
  h: string    // high
  l: string    // low
  v: string    // base volume
  q: string    // quote volume
}

/** !miniTicker@arr — array of all-market mini tickers */
export type WsAllMiniTickers = WsMiniTicker[]

/** <symbol>@depth<levels> — partial book depth */
export interface WsDepth {
  lastUpdateId: number
  bids: [string, string][]
  asks: [string, string][]
}

/** <symbol>@trade — individual market trades */
export interface WsTrade {
  e: 'trade'
  E: number
  s: string
  t: number   // trade id
  p: string   // price
  q: string   // quantity
  T: number   // trade time
  m: boolean  // buyer is market maker
  M: boolean
}

/** <symbol>@kline_<interval> — candlestick stream */
export interface WsKline {
  e: 'kline'
  E: number
  s: string
  k: {
    t: number  // kline start time
    T: number  // kline close time
    s: string
    i: string
    f: number
    L: number
    o: string
    c: string
    h: string
    l: string
    v: string
    n: number
    x: boolean // is this kline closed?
    q: string
    V: string
    Q: string
    B: string
  }
}

/** !ticker@arr — array of all tickers */
export type WsAllTickers = WsTicker[]
