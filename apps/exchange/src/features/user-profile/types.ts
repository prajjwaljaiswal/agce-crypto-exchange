export type MarketTab = 'all' | 'favorite' | 'trending' | 'hot' | 'new' | 'gainers'

export interface MarketCoin {
  symbol: string
  name: string
  pair: string
  icon: string
  price: string
  high: string
  low: string
  changePct: number
  favorite: boolean
}

export interface PerkStep {
  step: number
  title: string
  description?: string
  highlight?: string
  countdown?: string[]
  ctaLabel: string
  image: string
  active?: boolean
}

export interface AnnouncementItem {
  id: string
  title: string
  time: string
}

export interface ProfileSnapshot {
  email: string
  uid: string
  referralCode: string
  kycStatus: 'pending' | 'approved' | 'rejected'
  signupAt: string
  lastLoginAt: string
  lastLoginIp: string
  vipLevel: string
  riskLevel: string
  verified: boolean
  walletBalanceUsd: string
  walletBalanceBnb: string
}
