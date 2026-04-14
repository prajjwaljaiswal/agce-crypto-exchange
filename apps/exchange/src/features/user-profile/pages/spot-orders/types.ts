export type OrderStatus = 'EXECUTED' | 'CANCELLED' | 'PARTIALLY EXECUTED'
export type OrderSide = 'BUY' | 'SELL'
export type OrderType = 'LIMIT' | 'MARKET'

export interface ExecutedTrade {
  price: string
  executed: string
  fee: string
  total: string
}

export interface SpotOrder {
  id: string
  date: string
  time: string
  pair: string
  side: OrderSide
  price: string
  average: string
  quantity: string
  remaining: string
  total: string
  fee: string
  type: OrderType
  status: OrderStatus
  trades?: ExecutedTrade[]
}

export const STATUS_CLASS: Record<OrderStatus, string> = {
  EXECUTED: 'text-success',
  CANCELLED: 'text-danger',
  'PARTIALLY EXECUTED': 'text-warning',
}

export const TABLE_HEADERS = [
  'Date',
  'Trading Pair',
  'Side',
  'Price',
  'Average',
  'Quantity',
  'Remaining',
  'Total',
  'Fee',
  'Order Type',
  'Status',
]
