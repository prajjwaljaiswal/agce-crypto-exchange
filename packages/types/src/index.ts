export type InstanceId = 'india' | 'abudhabi' | 'dubai' | 'global'

export interface FeatureFlags {
  spot: boolean
  margin: boolean
  perpetuals: boolean
  options: boolean
  p2p: boolean
  staking: boolean
  otc: boolean
  copyTrading: boolean
  tokenLaunchpad: boolean
  inrWallet: boolean
  derivatives: boolean
}

export interface FiatConfig {
  currency: string
  symbol: string
  depositMethods: string[]
}

export interface KYCConfig {
  provider: 'didit'
  requireVKYC: boolean
  documents: string[]
  tiers: number
}

export interface ComplianceConfig {
  regulator: string
  taxReporting: 'india' | 'uae' | null
  amlFramework: string
  travelRuleProvider: 'cryptoswift'
}

export interface GeoConfig {
  allowList: string[]
  blockVPN: boolean
}

export interface ThemeConfig {
  primaryColor: string
  accentColor: string
  logoUrl: string
}

export interface VIPTier {
  name: string
  minVolume30d: number | null
  maxVolume30d: number | null
  makerFee: number
  takerFee: number
  benefits: string[]
}

export interface FeeConfig {
  vipTiers: VIPTier[]
  nativeTokenDiscount: boolean
  referralSplitPercent: number
}

export interface InstanceConfig {
  id: InstanceId
  name: string
  shortName: string
  domain: string
  fiat: FiatConfig
  features: FeatureFlags
  kyc: KYCConfig
  compliance: ComplianceConfig
  geo: GeoConfig
  theme: ThemeConfig
  fees: FeeConfig
}
