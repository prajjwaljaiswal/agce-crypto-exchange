export interface FeaturedPair {
  symbol: string
  baseCurrency: string
  quoteCurrency: string
  price: string
  change: string
  positive: boolean
  volume: string
  icon: string
}

export interface MarketPair {
  symbol: string
  baseCurrency: string
  quoteCurrency: string
  price: string
  priceUsd: string
  change: string
  positive: boolean
  high24h: string
  low24h: string
  volume: string
  marketCap: string
  icon: string
}

export interface MarketTab {
  key: string
  label: string
}

export interface CategoryFilter {
  key: string
  label: string
}
