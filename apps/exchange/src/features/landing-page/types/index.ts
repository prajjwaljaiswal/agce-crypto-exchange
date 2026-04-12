export interface Coin {
  symbol: string
  name: string
  price: string
  change: string
  positive: boolean
  icon: string
}

export interface CoinTab {
  key: string
  label: string
  data: Coin[]
}

export interface Banner {
  id: number
  src: string
  alt: string
}

export interface Product {
  img: string
  title: string
  description: string
  active?: boolean
}

export interface TrustItem {
  img: string
  title: string
  description: string
}

export interface Step {
  number: string
  icon: string
  title: string
  description: string
}

export type FeatureId = 'instant' | 'simpleEarn' | 'demo' | 'spot'

export interface FeatureCopy {
  title: string
  text: string
}

export interface SocialLink {
  label: string
  icon: string
  iconSize: number
}

export interface Platform {
  icon: string
  label: string
}
