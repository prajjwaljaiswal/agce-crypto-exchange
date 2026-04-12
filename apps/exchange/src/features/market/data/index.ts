import type { MarketTab, CategoryFilter } from '@agce/types'

export const MARKET_TABS: MarketTab[] = [
  { key: 'favourite', label: 'Favorites' },
  { key: 'spot', label: 'Spot' },
  { key: 'futures', label: 'Futures' },
  { key: 'cryptos', label: 'Cryptos' },
  { key: 'alpha', label: 'Alpha' },
]

export const CATEGORY_FILTERS: CategoryFilter[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'hot', label: 'Hot' },
  { key: 'meme', label: 'Meme' },
  { key: 'ai', label: 'AI' },
  { key: 'bsc', label: 'BSC(Eco)' },
  { key: 'defi', label: 'DeFi' },
  { key: 'layer1', label: 'Layer1' },
  { key: 'layer2', label: 'Layer2' },
  { key: 'exchange-tokens', label: 'Exchange Tokens' },
  { key: 'stocks', label: 'Stocks' },
  { key: 'metals', label: 'Metals' },
  { key: 'indices', label: 'Indices' },
  { key: 'forex', label: 'Forex' },
  { key: 'commodities', label: 'Commodities' },
  { key: 'chinese', label: 'Chinese' },
  { key: 'trump', label: 'Trump' },
  { key: 'brc20', label: 'BRC20' },
]

/**
 * Maps category keys → base-currency symbols in that category.
 * Only the keys present here act as inclusion filters; keys absent from the map
 * (stocks, metals, forex, etc.) will produce an empty result set, which is the
 * correct behaviour for a crypto-only exchange.
 */
export const COIN_CATEGORIES: Record<string, string[]> = {
  new:               ['SUI', 'APT', 'TON', 'TAO', 'FET', 'RENDER', 'INJ'],
  meme:              ['DOGE', 'SHIB', 'PEPE'],
  ai:                ['RENDER', 'FET', 'TAO', 'INJ'],
  bsc:               ['BNB'],
  defi:              ['UNI', 'AAVE', 'LINK'],
  layer1:            ['BTC', 'ETH', 'SOL', 'ADA', 'AVAX', 'DOT', 'NEAR', 'ATOM', 'APT', 'TRX', 'TON', 'SUI', 'BNB'],
  layer2:            ['ARB', 'OP', 'MATIC'],
  'exchange-tokens': ['BNB'],
}

/** Coins considered "alpha" — newly-listed / emerging high-beta names. */
export const ALPHA_BASES: string[] = ['SUI', 'APT', 'TON', 'TAO', 'FET', 'RENDER', 'INJ', 'PEPE']
