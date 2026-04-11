import type { InstanceConfig } from '@agce/types'

export const globalConfig: InstanceConfig = {
  id: 'global',
  name: 'AGCE Global',
  shortName: 'AGCE',
  domain: 'global.arabglobal.exchange',
  fiat: {
    currency: 'USD',
    symbol: '$',
    depositMethods: ['USDT', 'USDC'],
  },
  features: {
    spot: true,
    margin: true,
    perpetuals: true,
    options: true,
    p2p: true,
    staking: true,
    otc: true,
    copyTrading: true,
    tokenLaunchpad: true,
    inrWallet: false,
    derivatives: true,
  },
  kyc: {
    provider: 'didit',
    requireVKYC: false,
    documents: ['passport', 'national_id'],
    tiers: 3,
  },
  compliance: {
    regulator: 'Best-practice baseline',
    taxReporting: null,
    amlFramework: 'FATF-based',
    travelRuleProvider: 'cryptoswift',
  },
  geo: {
    // Loosely regulated jurisdictions; blocks FATF high-risk, India, UAE (prevent arbitrage)
    allowList: [],
    blockVPN: true,
  },
  theme: {
    primaryColor: '#2563EB',
    accentColor: '#7C3AED',
    logoUrl: '/logos/agce-global.svg',
  },
  fees: {
    vipTiers: [
      { name: 'Standard', minVolume30d: null, maxVolume30d: 50000, makerFee: 0.001, takerFee: 0.0015, benefits: ['Standard access'] },
      { name: 'VIP 1', minVolume30d: 50000, maxVolume30d: 500000, makerFee: 0.0008, takerFee: 0.0012, benefits: ['Priority support'] },
      { name: 'VIP 2', minVolume30d: 500000, maxVolume30d: 2000000, makerFee: 0.0006, takerFee: 0.001, benefits: ['Higher API limits'] },
      { name: 'VIP 3', minVolume30d: 2000000, maxVolume30d: 10000000, makerFee: 0.0004, takerFee: 0.0008, benefits: ['Dedicated manager'] },
      { name: 'VIP 4', minVolume30d: 10000000, maxVolume30d: null, makerFee: 0, takerFee: 0, benefits: ['OTC desk access', 'Custom fees'] },
    ],
    nativeTokenDiscount: true,
    referralSplitPercent: 30,
  },
}
