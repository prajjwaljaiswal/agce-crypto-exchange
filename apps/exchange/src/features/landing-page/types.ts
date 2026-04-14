export interface TrendingPair {
  id: string
  baseCurrency: string
  quoteCurrency: string
  assetName: string
  buyPrice: number
  changePercentage: number
  iconSrc: string
}

export interface PromoSlide {
  id: string
  src: string
  alt: string
}

export type FeatureHubId = 'instant' | 'simpleEarn' | 'demo' | 'spot'

export interface FeatureHubEntry {
  id: FeatureHubId
  title: string
  text: string
  spinnerAngle: number
}

export interface TradingProduct {
  icon: string
  title: string
  description: string
}

export interface TrustCard {
  id: string
  tabLabel: string
  icon: string
  title: string
  description: string
}

export interface HowItWorksStep {
  icon: string
  step: string
  title: string
  description: string
}

export interface DownloadPlatform {
  icon: string
  label: string
}
