export interface MarketRow {
  symbol: string
  icon: string
  price: string
  volume24h: string
  change24h: string
  positive: boolean
}

export interface Announcement {
  timeAgo: string
  title: string
}
