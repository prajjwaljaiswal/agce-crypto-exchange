import type { MarketRow, Announcement } from '../types/index.js'

export const MARKET_ROWS: MarketRow[] = [
  {
    symbol: 'USDT',
    icon: '/images/coin_usdt.svg',
    price: '$6.67',
    volume24h: '639.51K',
    change24h: '+1.99%',
    positive: true,
  },
  {
    symbol: 'WIF',
    icon: '/images/coin_wif.svg',
    price: '$1.9917',
    volume24h: '55.38M',
    change24h: '+93.77%',
    positive: true,
  },
  {
    symbol: 'BNB',
    icon: '/images/coin_bnb.svg',
    price: '$0.54',
    volume24h: '10.53M',
    change24h: '+27.58%',
    positive: true,
  },
  {
    symbol: 'TRX',
    icon: '/images/coin_trx.svg',
    price: '$0.09668',
    volume24h: '2.8M',
    change24h: '+34.73%',
    positive: true,
  },
]

export const ANNOUNCEMENTS: Announcement[] = [
  {
    timeAgo: '51 minute 43 sec ago',
    title:
      'Token Crew Phase 9: Invite Friends to Share a $600,000 Prize Pool\u2014No Cap on Individual Token Rewar...',
  },
  {
    timeAgo: '16 hours 19 minute 35 sec ago',
    title: 'AGCE USDD Bonus Newbies Special: Earn 4.5% APY & ShareExtra 10,000 USDT',
  },
]

export const MARKET_TABS = [
  { key: 'favorites', label: 'Favorites' },
  { key: 'my', label: 'My' },
  { key: 'hot', label: 'Hot' },
  { key: 'gainers', label: 'Top Gainers' },
  { key: 'new', label: 'New' },
] as const
