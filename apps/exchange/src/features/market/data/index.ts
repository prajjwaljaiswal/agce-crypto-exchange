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
  { key: 'stocks', label: 'Stocks' },
  { key: 'metals', label: 'Metals' },
  { key: 'indices', label: 'Indices' },
  { key: 'forex', label: 'Forex' },
  { key: 'commodities', label: 'Commodities' },
  { key: 'meme', label: 'Meme' },
  { key: 'chinese', label: 'Chinese' },
  { key: 'ai', label: 'AI' },
  { key: 'bsc', label: 'BSC(Eco)' },
  { key: 'defi', label: 'DeFi' },
  { key: 'layer1', label: 'Layer1' },
  { key: 'layer2', label: 'Layer2' },
  { key: 'trump', label: 'Trump' },
  { key: 'exchange-tokens', label: 'Exchange Tokens' },
  { key: 'brc20', label: 'BRC20' },
]
