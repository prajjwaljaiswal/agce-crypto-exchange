export interface Ticker {
  symbol: string
  baseAsset: string | null
  quoteAsset: string | null
  baseName: string | null
  baseIconUrl: string | null
  lastPrice: number
  priceChange: number
  priceChangePercent: number
  high: number
  low: number
  volume: number
  quoteVolume: number
  openPrice: number
  count: number
  marketCap: number
}

export interface UseMarketTickersResult {
  tickers: Record<string, Ticker>
  categories: Record<string, string[]>
  isLoading: boolean
  error: Error | null
}

export function useMarketTickers(): UseMarketTickersResult
