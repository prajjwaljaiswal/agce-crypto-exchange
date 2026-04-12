export interface TickerData {
  lastPrice: string
  priceChange: string
  priceChangePercent: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  prevClose: string
}

export interface RawBookEntry {
  price: number
  amount: number
}

export interface CoinTicker {
  symbol: string
  base: string
  quote: string
  name: string
  price: string
  change: string
  volume: string
  color: string
}

export type BookMode = 'both' | 'bids' | 'asks'

export interface RecentTrade {
  price: number
  qty: number
  time: number
  buyerIsMaker: boolean
}

export type MultiLayout = '1' | '2v' | '2h' | '3v' | '3h' | '4'

export type OrdersTab = 'Open Orders' | 'Order History' | 'Trade History' | 'Loan Management' | 'Bots(0)'

export type FlowTimeframe = '15m' | '30m' | '1h' | '2h' | '4h' | '1d'

export interface FlowBucket {
  buy: number
  sell: number
}

export interface MoneyFlow {
  large: FlowBucket
  medium: FlowBucket
  small: FlowBucket
}

export interface BufferedTrade {
  price: number
  qty: number
  buyerIsMaker: boolean
  time: number
}

export interface KlineInflow {
  openTime: number
  inflow: number
}

export interface FuturesStatPoint {
  time: number
  value: number
}

export type FuturesEndpoint = 'openInterestHist' | 'globalLongShortAccountRatio' | 'topLongShortPositionRatio'

export interface CoinInfo {
  name: string
  symbol: string
  image: string
  rank: number | null
  marketCap: number | null
  fdv: number | null
  dominance: number | null
  volume24h: number | null
  circulating: number | null
  maxSupply: number | null
  totalSupply: number | null
  ath: number | null
  athDate: string | null
  atl: number | null
  atlDate: string | null
  genesisDate: string | null
  description: string
  homepage: string | null
  whitepaper: string | null
  explorer: string | null
}

export interface TradingParams {
  symbol: string
  baseAsset: string
  quoteAsset: string
  tickSize: string
  stepSize: string
  minQty: string
  maxQty: string
  minNotional: string
  status: string
}

export interface PieSlice {
  label: string
  value: number
  color: string
}
