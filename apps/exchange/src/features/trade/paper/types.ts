// Paper trading types. Everything is stored in localStorage and runs client-side.

export type OrderSide = 'BUY' | 'SELL'
export type OrderType = 'LIMIT' | 'MARKET'
export type TimeInForce = 'GTC' | 'IOC' | 'FOK'
export type OrderStatus = 'NEW' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELED' | 'REJECTED'

export interface PaperOrder {
  id: string
  symbol: string       // e.g. "BTCUSDT"
  base: string         // e.g. "BTC"
  quote: string        // e.g. "USDT"
  side: OrderSide
  type: OrderType
  timeInForce: TimeInForce
  price: number        // limit price; for MARKET it's the trigger price captured at placement
  quantity: number     // base qty
  executedQty: number
  cummulativeQuoteQty: number // total quote filled (price * qty)
  status: OrderStatus
  createdAt: number
  updatedAt: number
}

export interface PaperTrade {
  id: string
  orderId: string
  symbol: string
  base: string
  quote: string
  side: OrderSide
  price: number
  quantity: number
  quoteQty: number
  fee: number
  feeAsset: string
  time: number
  isMaker: boolean     // limit orders match as maker; market as taker
}

export interface PaperBalance {
  asset: string
  free: number
  locked: number
}

export interface PaperState {
  balances: Record<string, PaperBalance>
  openOrders: PaperOrder[]
  orderHistory: PaperOrder[]
  tradeHistory: PaperTrade[]
  /** One-time seed flag so we don't reseed balances on every reload. */
  seeded: boolean
}
