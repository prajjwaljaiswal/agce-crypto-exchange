import type { InstanceConfig } from '@agce/types'

export const dubaiConfig: InstanceConfig = {
  id: 'dubai',
  name: 'AGCE Dubai',
  shortName: 'AGCE DXB',
  domain: 'dubai.arabglobal.exchange',
  fiat: {
    currency: 'AED',
    symbol: 'د.إ',
    depositMethods: ['Bank Transfer'],
  },
  features: {
    spot: true,
    margin: true,
    perpetuals: true,
    options: true,
    p2p: false,
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
    documents: ['emirates_id', 'passport'],
    tiers: 3,
  },
  compliance: {
    regulator: 'VARA',
    taxReporting: 'uae',
    amlFramework: 'VARA AML Framework',
    travelRuleProvider: 'cryptoswift',
  },
  geo: {
    allowList: ['AE', 'GB', 'US', 'EU'],
    blockVPN: true,
  },
  theme: {
    primaryColor: '#C8102E',
    accentColor: '#006C35',
    logoUrl: '/logos/agce-dubai.svg',
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
