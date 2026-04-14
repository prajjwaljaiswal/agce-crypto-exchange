import type {
  DownloadPlatform,
  FeatureHubEntry,
  HowItWorksStep,
  PromoSlide,
  TradingProduct,
  TrendingPair,
  TrustCard,
} from './types.js'

const PROMO_BASE: PromoSlide[] = [
  { id: 'cb1', src: '/images/cardbnr_img.jpg', alt: 'Trade March meme trading fest — PEPE & USDT rewards' },
  { id: 'cb2', src: '/images/cardbnr_img2.jpg', alt: 'Exclusive airdrop for new users' },
  { id: 'cb3', src: '/images/cardbnr_img3.jpg', alt: 'JYAI new listing' },
  { id: 'cb4', src: '/images/cardbnr_img4.jpg', alt: 'Spot listing BLUB' },
]

export const PROMO_SLIDES: PromoSlide[] = [
  ...PROMO_BASE.map((s, i) => ({ ...s, id: `${s.id}-a${i}` })),
  ...PROMO_BASE.map((s, i) => ({ ...s, id: `${s.id}-b${i}` })),
]

export const MOCK_HOT_PAIRS: TrendingPair[] = [
  { id: 'm1', baseCurrency: 'BTC', quoteCurrency: 'USDT', assetName: 'Bitcoin', buyPrice: 87339.15, changePercentage: -2.4, iconSrc: '/images/hot_bitcoin.svg' },
  { id: 'm2', baseCurrency: 'ETH', quoteCurrency: 'USDT', assetName: 'Ethereum', buyPrice: 2944.15, changePercentage: -2.34, iconSrc: '/images/hot_eth.svg' },
  { id: 'm3', baseCurrency: 'BTC', quoteCurrency: 'USDT', assetName: 'Bitcoin', buyPrice: 10.75, changePercentage: -0.98, iconSrc: '/images/hot_bitcoin.svg' },
  { id: 'm4', baseCurrency: 'ZEC', quoteCurrency: 'USDT', assetName: 'ZEC', buyPrice: 530.64, changePercentage: -0.27, iconSrc: '/images/hot_zec.svg' },
  { id: 'm5', baseCurrency: 'TOKEN', quoteCurrency: 'USDT', assetName: 'TokenFi', buyPrice: 0.00602455, changePercentage: -29.16, iconSrc: '/images/hot_token.svg' },
]

export const MOCK_NEW_LISTINGS: TrendingPair[] = [
  { id: 'n1', baseCurrency: 'TTD', quoteCurrency: 'USDT', assetName: 'Trade Tide Token', buyPrice: 0.00628119, changePercentage: -17.77, iconSrc: '/images/coin_icon.svg' },
  { id: 'n2', baseCurrency: 'HLS', quoteCurrency: 'USDT', assetName: 'Helios', buyPrice: 0.00636108, changePercentage: -1.54, iconSrc: '/images/coin_icon2.svg' },
  { id: 'n3', baseCurrency: 'ZKP', quoteCurrency: 'USDT', assetName: 'zkPass', buyPrice: 0.12817031, changePercentage: -11.19, iconSrc: '/images/coin_icon3.svg' },
  { id: 'n4', baseCurrency: 'ZIG', quoteCurrency: 'USDT', assetName: 'ZigCoin', buyPrice: 0.0569202, changePercentage: -1.33, iconSrc: '/images/coin_icon4.svg' },
  { id: 'n5', baseCurrency: 'VOOI', quoteCurrency: 'USDT', assetName: 'VOOI', buyPrice: 0.02763126, changePercentage: -7.95, iconSrc: '/images/coin_icon5.svg' },
]

export const MOCK_TOP_GAINERS: TrendingPair[] = [
  { id: 'g1', baseCurrency: 'SCOR', quoteCurrency: 'USDT', assetName: 'Scor', buyPrice: 0.0229678, changePercentage: 91.97, iconSrc: '/images/gainers_icon.svg' },
  { id: 'g2', baseCurrency: 'ANLOG', quoteCurrency: 'USDT', assetName: 'ANLOG', buyPrice: 0.00055881, changePercentage: 79.18, iconSrc: '/images/gainers_icon2.svg' },
  { id: 'g3', baseCurrency: 'PINGPONG', quoteCurrency: 'USDT', assetName: 'PINGPONG', buyPrice: 0.00569202, changePercentage: 47.28, iconSrc: '/images/gainers_icon3.svg' },
  { id: 'g4', baseCurrency: 'ELIZAOS', quoteCurrency: 'USDT', assetName: 'elizaOS', buyPrice: 0.00362791, changePercentage: 44.68, iconSrc: '/images/gainers_icon4.svg' },
  { id: 'g5', baseCurrency: 'MAIGA', quoteCurrency: 'USDT', assetName: 'MAIGA Token', buyPrice: 0.01528856, changePercentage: 39.18, iconSrc: '/images/gainers_icon5.svg' },
]

export const FEATURE_HUB_ENTRIES: FeatureHubEntry[] = [
  { id: 'instant', title: 'Instant Withdrawals', text: 'Get your funds instantly, anytime you need them.', spinnerAngle: 270 },
  { id: 'simpleEarn', title: 'Simple Earn', text: 'Grow your idle assets with up to 42% APR returns.', spinnerAngle: 180 },
  { id: 'demo', title: 'Demo Trading', text: 'Learn crypto trading at 0% cost before investing real money.', spinnerAngle: 0 },
  { id: 'spot', title: 'Spot Trading', text: 'Buy and sell crypto instantly with live market prices.', spinnerAngle: 90 },
]

export const FEATURE_ORBIT_MS = 14000
export const FEATURE_HUB_STROKE = { on: '#D1AA67', off: '#C5CAD3' }

export const TRADING_PRODUCTS: TradingProduct[] = [
  { icon: '/images/platform_vector.svg', title: 'Spot', description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.' },
  { icon: '/images/platform_vector2.svg', title: 'Derivatives', description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.' },
  { icon: '/images/platform_vector3.svg', title: 'Launchpad', description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.' },
  { icon: '/images/platform_vector4.svg', title: 'Margin', description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.' },
  { icon: '/images/platform_vector5.svg', title: 'Minimal Interface', description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.' },
  { icon: '/images/platform_vector6.svg', title: 'Futures & Options', description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.' },
]

export const TRUST_CARDS: TrustCard[] = [
  { id: 'compliance', tabLabel: 'Compliance', icon: '/images/global_trade_vector.svg', title: 'Compliance Matrix', description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.' },
  { id: 'security', tabLabel: 'Security', icon: '/images/global_trade_vector2.svg', title: 'Account Security', description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.' },
  { id: 'reserves', tabLabel: 'Reserves', icon: '/images/global_trade_vector3.svg', title: '100% Reserves', description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.' },
]

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  { icon: '/images/work_icon.svg', step: 'Step 1', title: 'Login & Register', description: 'Enter your email address and create a strong password.' },
  { icon: '/images/work_icon2.svg', step: 'Step 2', title: 'Complete KYC', description: 'Complete the two-factor authentication process (2FA). Wait for your account to be verified and approved.' },
  { icon: '/images/work_icon3.svg', step: 'Step 3', title: 'Start Trading', description: 'Once approved, login to your account and start trading.' },
]

export const DOWNLOAD_PLATFORMS: DownloadPlatform[] = [
  { icon: '/images/mac_icon1.svg', label: 'Mac OS' },
  { icon: '/images/windows_icon1.svg', label: 'Windows' },
  { icon: '/images/api_icon1.svg', label: 'API' },
]
