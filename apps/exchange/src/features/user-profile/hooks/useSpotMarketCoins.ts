import { useMemo } from 'react'
import { useMarketTickers } from '../../Market/useMarketTickers.js'
import {
  coinDisplayName,
  coinIconSrc,
  fmtPrice,
  splitPair,
} from '../../Market/marketFormat.js'
import type { MarketCoin } from '../types.js'

interface NormalizedTicker {
  symbol: string
  lastPrice: number
  priceChangePercent: number
  high: number
  low: number
  volume: number
  quoteVolume: number
  openPrice: number
  count: number
}

function tickerToMarketCoin(t: NormalizedTicker): MarketCoin {
  const { base, quote } = splitPair(t.symbol)
  return {
    symbol: base,
    name: coinDisplayName(base),
    pair: `${base}_${quote || 'USDT'}`,
    icon: coinIconSrc(base),
    price: fmtPrice(t.lastPrice),
    high: fmtPrice(t.high),
    changePct: Number.isFinite(t.priceChangePercent)
      ? Number(t.priceChangePercent.toFixed(2))
      : 0,
    favorite: false,
  }
}

/**
 * Adapts live matching-service tickers (from useMarketTickers) into the
 * MarketCoin shape consumed by SpotMarketsCard. Keeps SpotMarketsCard purely
 * presentational — all data-source knowledge lives here.
 */
export function useSpotMarketCoins(): {
  coins: MarketCoin[]
  isLoading: boolean
  error: unknown
} {
  const { tickers, isLoading, error } = useMarketTickers()

  const coins = useMemo<MarketCoin[]>(() => {
    const list = Object.values(tickers) as NormalizedTicker[]
    return list
      .filter((t) => t.symbol)
      .map(tickerToMarketCoin)
      .sort((a, b) => b.changePct - a.changePct)
  }, [tickers])

  return { coins, isLoading, error }
}