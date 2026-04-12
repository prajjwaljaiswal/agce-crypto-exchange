import type {
  Banner,
  Coin,
  CoinTab,
  FeatureCopy,
  FeatureId,
  Platform,
  Product,
  SocialLink,
  Step,
  TrustItem,
} from '../types/index.js'

// ─── Hero ────────────────────────────────────────────────────────────────────

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Continue with Google', icon: '/images/googleicon.svg', iconSize: 28 },
  { label: 'Continue with Apple', icon: '/images/appleicon.svg', iconSize: 24 },
  { label: 'Continue with Telegram', icon: '/images/telegramicon.svg', iconSize: 28 },
]

export const DOWNLOAD_LINK: SocialLink = {
  label: 'Download App',
  icon: '/images/downloadicon.svg',
  iconSize: 28,
}

// ─── Promo Banners ───────────────────────────────────────────────────────────

export const BANNERS: Banner[] = [
  { id: 1, src: '/images/cardbnr_img.jpg', alt: 'Trade march meme trading fest — PEPE & USDT rewards' },
  { id: 2, src: '/images/cardbnr_img2.jpg', alt: 'Exclusive Airdrop For New Users — AVL' },
  { id: 3, src: '/images/cardbnr_img3.jpg', alt: 'JYAI new listing' },
  { id: 4, src: '/images/cardbnr_img4.jpg', alt: 'Spot Listing Blub (BLUB)' },
]

// ─── Trending Crypto ─────────────────────────────────────────────────────────

const HOT_COINS: Coin[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$87,339.15', change: '-2.4%', positive: false, icon: '/images/hot_bitcoin.svg' },
  { symbol: 'ETH', name: 'Ethereum', price: '$2,944.15', change: '-2.34%', positive: false, icon: '/images/hot_eth.svg' },
  { symbol: 'BTC', name: 'Bitcoin', price: '$10.75', change: '-0.98%', positive: false, icon: '/images/hot_bitcoin.svg' },
  { symbol: 'ZEC', name: 'ZEC', price: '$530.64', change: '-0.27%', positive: false, icon: '/images/hot_zec.svg' },
  { symbol: 'TOKEN', name: 'TokenFi', price: '$0.006', change: '-29.16%', positive: false, icon: '/images/hot_token.svg' },
]

const NEW_COINS: Coin[] = [
  { symbol: 'TTD', name: 'Trade Tide Token', price: '$0.006', change: '-17.77%', positive: false, icon: '/images/coin_icon.svg' },
  { symbol: 'HLS', name: 'Helios', price: '$0.006', change: '-1.54%', positive: false, icon: '/images/coin_icon2.svg' },
  { symbol: 'ZKP', name: 'zkPass', price: '$0.128', change: '-11.19%', positive: false, icon: '/images/coin_icon3.svg' },
  { symbol: 'ZIG', name: 'ZigCoin', price: '$0.057', change: '-1.33%', positive: false, icon: '/images/coin_icon4.svg' },
  { symbol: 'VOOI', name: 'VOOI', price: '$0.028', change: '-7.95%', positive: false, icon: '/images/coin_icon5.svg' },
]

const TOP_GAINER_COINS: Coin[] = [
  { symbol: 'SCOR', name: 'Scor', price: '$0.023', change: '+91.97%', positive: true, icon: '/images/gainers_icon.svg' },
  { symbol: 'ANLOG', name: 'ANLOG', price: '$0.0006', change: '+79.18%', positive: true, icon: '/images/gainers_icon2.svg' },
  { symbol: 'PINGPONG', name: 'PINGPONG', price: '$0.006', change: '+47.28%', positive: true, icon: '/images/gainers_icon3.svg' },
  { symbol: 'ELIZAOS', name: 'elizaOS', price: '$0.004', change: '+44.68%', positive: true, icon: '/images/gainers_icon4.svg' },
  { symbol: 'MAIGA', name: 'MAIGA Token', price: '$0.015', change: '+39.18%', positive: true, icon: '/images/gainers_icon5.svg' },
]

export const COIN_TABS: CoinTab[] = [
  { key: 'hot', label: 'Hot', data: HOT_COINS },
  { key: 'newCoins', label: 'New Coins', data: NEW_COINS },
  { key: 'topGainers', label: 'Top Gainers', data: TOP_GAINER_COINS },
]

// ─── Trade Anywhere ──────────────────────────────────────────────────────────

export const PLATFORMS: Platform[] = [
  { icon: '/images/mac_icon1.svg', label: 'Mac OS' },
  { icon: '/images/windows_icon1.svg', label: 'Windows' },
  { icon: '/images/api_icon1.svg', label: 'API' },
]

// ─── Platform Features ───────────────────────────────────────────────────────

export const FEATURE_HUB_COPY: Record<FeatureId, FeatureCopy> = {
  instant: {
    title: 'Instant Withdrawals',
    text: 'Get your funds instantly, anytime you need them.',
  },
  simpleEarn: {
    title: 'Simple Earn',
    text: 'Grow your idle assets with up to 42% APR returns.',
  },
  demo: {
    title: 'Demo Trading',
    text: 'Learn crypto trading at 0% cost before investing real money.',
  },
  spot: {
    title: 'Spot Trading',
    text: 'Buy and sell crypto instantly with live market prices.',
  },
}

export const FEATURE_HUB_STROKE = { on: '#D1AA67', off: '#C5CAD3' } as const

export const FEATURE_ORBIT_MS = 14000

export const FEATURE_SPINNER_ANGLE: Record<FeatureId, number> = {
  demo: 0,
  spot: 90,
  simpleEarn: 180,
  instant: 270,
}

export const FEATURE_CONNECTOR_ICONS = [
  '/images/featuresicon.svg',
  '/images/featuresicon2.svg',
  '/images/featuresicon3.svg',
  '/images/featuresicon4.svg',
] as const

// ─── Trading Products ────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  {
    img: '/images/platform_vector.svg',
    title: 'Spot',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
    active: true,
  },
  {
    img: '/images/platform_vector2.svg',
    title: 'Derivatives',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
    active: false,
  },
  {
    img: '/images/platform_vector3.svg',
    title: 'Launchpad',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
    active: false,
  },
  {
    img: '/images/platform_vector4.svg',
    title: 'Margin',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
    active: false,
  },
  {
    img: '/images/platform_vector5.svg',
    title: 'Minimal Interface',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
    active: false,
  },
  {
    img: '/images/platform_vector6.svg',
    title: 'Futures & Options',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
    active: false,
  },
]

// ─── Trust Features ──────────────────────────────────────────────────────────

export const TRUST_ITEMS: TrustItem[] = [
  {
    img: '/images/global_trade_vector.svg',
    title: 'Compliance Matrix',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
  },
  {
    img: '/images/global_trade_vector2.svg',
    title: 'Account Security',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
  },
  {
    img: '/images/global_trade_vector3.svg',
    title: '100% Reserves',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
  },
]

// ─── How It Works ────────────────────────────────────────────────────────────

export const STEPS: Step[] = [
  {
    number: 'Step 1',
    icon: '/images/work_icon.svg',
    title: 'Login & Register',
    description: 'Enter your email address and create a strong password.',
  },
  {
    number: 'Step 2',
    icon: '/images/work_icon2.svg',
    title: 'Complete KYC',
    description: 'Complete the two-factor authentication process (2FA). Wait for your account to be verified and approved.',
  },
  {
    number: 'Step 3',
    icon: '/images/work_icon3.svg',
    title: 'Start Trading',
    description: 'Once approved, login to your account and start trading.',
  },
]
