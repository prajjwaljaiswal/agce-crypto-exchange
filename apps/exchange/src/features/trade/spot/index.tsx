import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { tick as paperTick } from '../paper/index.js'
import { useBinanceTicker, useBinanceOrderBook } from './hooks.js'
import { TickerBar } from './TickerBar.js'
import { ChartSection } from './ChartSection.js'
import { OrderBook } from './OrderBook.js'
import { TradeForm } from './TradeForm.js'
import { OpenOrdersPanel } from './OrdersPanel.js'

export function SpotTradePage() {
  const { pairs } = useParams<{ pairs: string }>()
  const pairStr = pairs ?? 'BTC_USDT'
  const parts = pairStr.includes('_') ? pairStr.split('_') : ['BTC', 'USDT']
  const base = parts[0] || 'BTC'
  const quote = parts[1] || 'USDT'
  const symbol = `${base}${quote}`.toUpperCase()

  const ticker = useBinanceTicker(symbol)
  const { bids, asks } = useBinanceOrderBook(symbol)
  const prevPriceRef = useRef(ticker.lastPrice)
  const [prevPrice, setPrevPrice] = useState(ticker.lastPrice)

  useEffect(() => {
    if (ticker.lastPrice !== '0' && ticker.lastPrice !== prevPriceRef.current) {
      setPrevPrice(prevPriceRef.current)
      prevPriceRef.current = ticker.lastPrice
    }
    // Feed the live price into the paper engine so open limit orders can match.
    const numeric = parseFloat(ticker.lastPrice.replace(/,/g, ''))
    if (numeric > 0) paperTick(symbol, numeric)
  }, [ticker.lastPrice, symbol])

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-[1fr_300px_300px] lg:[grid-template-rows:auto_minmax(0,1fr)_auto] lg:h-[calc(120vh)]"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Row 1: Ticker — full width */}
      <div
        className="order-1 lg:order-none lg:col-start-1 lg:col-end-4 lg:row-start-1 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <TickerBar base={base} quote={quote} ticker={ticker} prevPrice={prevPrice} />
      </div>

      {/* Row 2 — Chart | OrderBook | TradeForm (fills remaining viewport on desktop) */}
      <div
        className="order-2 lg:order-none lg:col-start-1 lg:row-start-2 flex flex-col min-w-0 min-h-[400px] lg:min-h-0 lg:overflow-hidden lg:border-r"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <ChartSection symbol={symbol} />
      </div>
      <div
        className="order-4 lg:order-none lg:col-start-2 lg:row-start-2 flex flex-col min-h-[400px] lg:min-h-0 overflow-y-auto lg:border-r"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <OrderBook symbol={symbol} bids={bids} asks={asks} lastPrice={ticker.lastPrice} prevPrice={prevPrice} base={base} quote={quote} />
      </div>
      <div
        className="order-3 lg:order-none lg:col-start-3 lg:row-start-2 lg:row-end-4 flex flex-col min-h-[400px] lg:min-h-0 overflow-y-auto lg:border-l"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <TradeForm base={base} quote={quote} lastPrice={ticker.lastPrice} />
      </div>

      {/* Row 3: Open Orders — spans only Chart + OrderBook columns */}
      <div
        className="order-5 lg:order-none lg:col-start-1 lg:col-end-3 lg:row-start-3 w-full border-t lg:max-h-[42vh] lg:overflow-y-auto"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <OpenOrdersPanel symbol={symbol} />
      </div>
    </div>
  )
}
