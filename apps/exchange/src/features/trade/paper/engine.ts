import { paperStore } from './store.ts'
import type {
  OrderSide,
  OrderType,
  PaperOrder,
  PaperState,
  PaperTrade,
  TimeInForce,
} from './types.ts'

const TAKER_FEE = 0.001 // 0.1%
const MAKER_FEE = 0.001

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function ensureBalance(state: PaperState, asset: string): PaperState {
  if (state.balances[asset]) return state
  return {
    ...state,
    balances: { ...state.balances, [asset]: { asset, free: 0, locked: 0 } },
  }
}

function adjustBalance(
  state: PaperState,
  asset: string,
  freeDelta: number,
  lockedDelta: number,
): PaperState {
  const ensured = ensureBalance(state, asset)
  const current = ensured.balances[asset]!
  return {
    ...ensured,
    balances: {
      ...ensured.balances,
      [asset]: {
        asset,
        free: current.free + freeDelta,
        locked: current.locked + lockedDelta,
      },
    },
  }
}

interface PlaceOrderInput {
  symbol: string
  base: string
  quote: string
  side: OrderSide
  type: OrderType
  timeInForce?: TimeInForce
  price: number          // for MARKET, caller passes the current ticker price
  quantity: number
}

interface PlaceResult {
  ok: boolean
  error?: string
  orderId?: string
}

/**
 * Place a paper order. For LIMIT orders, funds are locked and the order sits in openOrders
 * until `tick()` sees a crossing price. For MARKET orders, the order fills immediately
 * against the passed-in price.
 */
export function placeOrder(input: PlaceOrderInput): PlaceResult {
  const { symbol, base, quote, side, type, price, quantity } = input
  const timeInForce = input.timeInForce ?? 'GTC'

  if (!(quantity > 0)) return { ok: false, error: 'Quantity must be greater than zero' }
  if (!(price > 0)) return { ok: false, error: 'Price must be greater than zero' }

  const state = paperStore.getState()

  // Lock required funds upfront so concurrent orders can't double-spend.
  const lockAsset = side === 'BUY' ? quote : base
  const lockAmount = side === 'BUY' ? price * quantity : quantity
  const currentFree = state.balances[lockAsset]?.free ?? 0
  if (currentFree < lockAmount) {
    return { ok: false, error: `Insufficient ${lockAsset} balance (need ${lockAmount}, have ${currentFree})` }
  }

  const now = Date.now()
  const order: PaperOrder = {
    id: uid('ord'),
    symbol,
    base,
    quote,
    side,
    type,
    timeInForce,
    price,
    quantity,
    executedQty: 0,
    cummulativeQuoteQty: 0,
    status: 'NEW',
    createdAt: now,
    updatedAt: now,
  }

  paperStore.setState((prev) => {
    let next = adjustBalance(prev, lockAsset, -lockAmount, +lockAmount)
    next = { ...next, openOrders: [...next.openOrders, order] }
    return next
  })

  if (type === 'MARKET') {
    fillOrder(order.id, price, true)
  }
  // LIMIT orders sit until the next price tick from the trade page matches them.

  return { ok: true, orderId: order.id }
}

/**
 * Cancel an open order and release the locked balance.
 */
export function cancelOrder(orderId: string): PlaceResult {
  const state = paperStore.getState()
  const order = state.openOrders.find((o) => o.id === orderId)
  if (!order) return { ok: false, error: 'Order not found' }

  const remainingQty = order.quantity - order.executedQty
  const lockAsset = order.side === 'BUY' ? order.quote : order.base
  const lockAmount = order.side === 'BUY' ? order.price * remainingQty : remainingQty

  paperStore.setState((prev) => {
    let next = adjustBalance(prev, lockAsset, +lockAmount, -lockAmount)
    const canceled: PaperOrder = { ...order, status: 'CANCELED', updatedAt: Date.now() }
    next = {
      ...next,
      openOrders: next.openOrders.filter((o) => o.id !== orderId),
      orderHistory: [canceled, ...next.orderHistory].slice(0, 500),
    }
    return next
  })

  return { ok: true, orderId }
}

/**
 * Core fill routine. Called internally by placeOrder (market) and tick (limit).
 * Fully fills the remaining quantity at `fillPrice`.
 */
function fillOrder(orderId: string, fillPrice: number, isTaker: boolean): void {
  paperStore.setState((prev) => {
    const order = prev.openOrders.find((o) => o.id === orderId)
    if (!order) return prev

    const remainingQty = order.quantity - order.executedQty
    if (remainingQty <= 0) return prev

    const tradeQty = remainingQty
    const tradeQuote = fillPrice * tradeQty
    const feeRate = isTaker ? TAKER_FEE : MAKER_FEE

    // For BUY: lockedQuote was price*qty at lock time; the limit may fill below limit,
    // in which case we refund the delta. For SELL, we locked the base quantity itself.
    const lockedQuote = order.side === 'BUY' ? order.price * tradeQty : tradeQty

    let next: PaperState = prev

    if (order.side === 'BUY') {
      // Release locked quote, debit actual quote used, credit base (minus fee).
      next = adjustBalance(next, order.quote, 0, -lockedQuote)
      // If we locked more than we spent (limit buy filling below limit), refund the difference to free.
      const refund = lockedQuote - tradeQuote
      if (refund > 0) next = adjustBalance(next, order.quote, +refund, 0)
      const fee = tradeQty * feeRate
      next = adjustBalance(next, order.base, +(tradeQty - fee), 0)
      const filledOrder: PaperOrder = {
        ...order,
        executedQty: order.quantity,
        cummulativeQuoteQty: tradeQuote,
        status: 'FILLED',
        updatedAt: Date.now(),
      }
      const trade: PaperTrade = {
        id: uid('trd'),
        orderId: order.id,
        symbol: order.symbol,
        base: order.base,
        quote: order.quote,
        side: 'BUY',
        price: fillPrice,
        quantity: tradeQty,
        quoteQty: tradeQuote,
        fee,
        feeAsset: order.base,
        time: Date.now(),
        isMaker: !isTaker,
      }
      next = {
        ...next,
        openOrders: next.openOrders.filter((o) => o.id !== order.id),
        orderHistory: [filledOrder, ...next.orderHistory].slice(0, 500),
        tradeHistory: [trade, ...next.tradeHistory].slice(0, 500),
      }
    } else {
      // SELL: release locked base, credit quote (minus fee).
      next = adjustBalance(next, order.base, 0, -tradeQty)
      const fee = tradeQuote * feeRate
      next = adjustBalance(next, order.quote, +(tradeQuote - fee), 0)
      const filledOrder: PaperOrder = {
        ...order,
        executedQty: order.quantity,
        cummulativeQuoteQty: tradeQuote,
        status: 'FILLED',
        updatedAt: Date.now(),
      }
      const trade: PaperTrade = {
        id: uid('trd'),
        orderId: order.id,
        symbol: order.symbol,
        base: order.base,
        quote: order.quote,
        side: 'SELL',
        price: fillPrice,
        quantity: tradeQty,
        quoteQty: tradeQuote,
        fee,
        feeAsset: order.quote,
        time: Date.now(),
        isMaker: !isTaker,
      }
      next = {
        ...next,
        openOrders: next.openOrders.filter((o) => o.id !== order.id),
        orderHistory: [filledOrder, ...next.orderHistory].slice(0, 500),
        tradeHistory: [trade, ...next.tradeHistory].slice(0, 500),
      }
    }

    return next
  })
}

/**
 * Feed a new live price for a symbol. Walks open orders and fills any that cross.
 * Called from the trade page on every ticker update.
 */
export function tick(symbol: string, lastPrice: number): void {
  if (!(lastPrice > 0)) return
  const state = paperStore.getState()
  const candidates = state.openOrders.filter((o) => o.symbol === symbol && o.status === 'NEW')
  for (const order of candidates) {
    if (order.type !== 'LIMIT') continue
    const shouldFillBuy = order.side === 'BUY' && lastPrice <= order.price
    const shouldFillSell = order.side === 'SELL' && lastPrice >= order.price
    if (shouldFillBuy || shouldFillSell) {
      fillOrder(order.id, order.price, false)
    }
  }
}

/**
 * Credit a paper deposit. Used by the Assets page's Deposit action.
 */
export function deposit(asset: string, amount: number): void {
  if (!(amount > 0)) return
  paperStore.setState((prev) => adjustBalance(prev, asset, +amount, 0))
}

/**
 * Convert one asset to another at a given rate (both positive). Used by Convert page.
 */
export function convert(fromAsset: string, toAsset: string, fromAmount: number, rate: number): PlaceResult {
  if (!(fromAmount > 0) || !(rate > 0)) return { ok: false, error: 'Invalid amount or rate' }
  const state = paperStore.getState()
  const free = state.balances[fromAsset]?.free ?? 0
  if (free < fromAmount) return { ok: false, error: `Insufficient ${fromAsset}` }
  paperStore.setState((prev) => {
    let next = adjustBalance(prev, fromAsset, -fromAmount, 0)
    next = adjustBalance(next, toAsset, +(fromAmount * rate), 0)
    return next
  })
  return { ok: true }
}
