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

// ─── Trading domain ──────────────────────────────────────────────────────────

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

// ─── Auth + KYC ──────────────────────────────────────────────────────────────

export type {
  Jurisdiction,
  OtpType,
  OtpPurpose,
  IdentifierCheckPurpose,
  AuthUser,
  AuthTokens,
  AuthSession,
  CheckIdentifierPayload,
  RegisterPayload,
  RegisterResponse,
  RegisteredUser,
  PasswordLoginPayload,
  TwoFactorChallenge,
  LoginSuccess,
  LoginResponse,
  SendOtpPayload,
  VerifyOtpPayload,
  RefreshTokenPayload,
  MeResponse,
  UpdatePreferredCurrencyPayload,
  UpdatePreferredCurrencyResponse,
  SignupPayload,
  GoogleLoginPayload,
  GoogleRegisterPayload,
  Country,
} from './auth.js'

export type {
  DiditStatus,
  KycLevel,
  KycDecision,
  KycStartSessionPayload,
  KycSessionResponse,
  KycStatusResponse,
} from './kyc.js'
