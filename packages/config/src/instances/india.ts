import type { InstanceConfig } from '@agce/types'

export const indiaConfig: InstanceConfig = {
  id: 'india',
  name: 'AGCE India',
  shortName: 'AGCE IN',
  domain: 'in.arabglobal.exchange',
  fiat: {
    currency: 'INR',
    symbol: '₹',
    depositMethods: ['UPI', 'IMPS', 'NEFT', 'RTGS'],
  },
  features: {
    spot: true,
    margin: false,
    perpetuals: false,
    options: false,
    p2p: true,
    staking: true,
    otc: false,
    copyTrading: false,
    tokenLaunchpad: false,
    inrWallet: true,
    derivatives: false,
  },
  kyc: {
    provider: 'didit',
    requireVKYC: true,
    documents: ['aadhaar', 'pan'],
    tiers: 3,
  },
  compliance: {
    regulator: 'FIU-IND / SEBI',
    taxReporting: 'india',
    amlFramework: 'FIU-IND STR/CTR',
    travelRuleProvider: 'cryptoswift',
  },
  geo: {
    allowList: ['IN'],
    blockVPN: true,
  },
  theme: {
    primaryColor: '#F7931A',
    accentColor: '#0052FF',
    logoUrl: '/logos/agce-india.svg',
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
