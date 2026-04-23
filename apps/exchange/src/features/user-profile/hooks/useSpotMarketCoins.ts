import { useMemo } from 'react'
import { useMarketTickers } from '../../Market/useMarketTickers.js'
import { fmtPrice, splitPair } from '../../Market/marketFormat.js'
import type { MarketCoin } from '../types.js'

interface NormalizedTicker {
  symbol: string
  baseAsset: string | null
  quoteAsset: string | null
  baseName: string | null
  baseIconUrl: string | null
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
    symbol: t.baseAsset ?? base,
    name: t.baseName ?? base,
    pair: `${t.baseAsset ?? base}_${t.quoteAsset ?? quote ?? 'USDT'}`,
    icon: t.baseIconUrl ?? '',
    price: fmtPrice(t.lastPrice),
    high: fmtPrice(t.high),
    low: fmtPrice(t.low),
    changePct: Number.isFinite(t.priceChangePercent)
      ? Number(t.priceChangePercent.toFixed(2))
      : 0,
    favorite: false,
  }
}

export function useSpotMarketCoins(): {
  coins: MarketCoin[]
  categories: Record<string, string[]>
  isLoading: boolean
  error: unknown
} {
  const { tickers, categories, isLoading, error } = useMarketTickers()

  const coins = useMemo<MarketCoin[]>(() => {
    return (Object.values(tickers) as NormalizedTicker[])
      .filter((t) => t.symbol)
      .map(tickerToMarketCoin)
  }, [tickers])

  return { coins, categories, isLoading, error }
}
