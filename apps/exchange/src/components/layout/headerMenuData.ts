export interface SubmenuItem {
  id: string
  title: string
  titleSub?: string
  desc: string
  to: string
  iconSrc: string
}

export const BUY_CRYPTO_SUBMENU_ITEMS: SubmenuItem[] = [
  {
    id: 'buy_crypto',
    title: 'Buy Crypto',
    titleSub: 'Hot',
    desc: 'Pay via Visa, MasterCard, UPI',
    to: '/trade/Header',
    iconSrc: '/images/buy_icon_menu.svg',
  },
  {
    id: 'p2p',
    title: 'P2P',
    titleSub: '0 Fees',
    desc: 'Zero fees with direct user-to-user transactions',
    to: '/p2p-dashboard',
    iconSrc: '/images/p2p_icon_menu.svg',
  },
]

export const TRADE_SUBMENU_ITEMS: SubmenuItem[] = [
  {
    id: 'spot',
    title: 'Spot',
    desc: 'Buy and sell crypto instantly',
    to: '/trade/BTC_USDT',
    iconSrc: '/images/buy_icon_menu.svg',
  },
  {
    id: 'margin',
    title: 'Margin',
    desc: 'Trade with leverage and borrow funds',
    to: '/trade/BTC_USDT',
    iconSrc: '/images/p2p_icon_menu.svg',
  },
  {
    id: 'convert',
    title: 'Convert',
    desc: 'Instantly swap between cryptocurrencies',
    to: '/user_profile/swap',
    iconSrc: '/images/convert_icon_menu.svg',
  },
  {
    id: 'copy_trading',
    title: 'Copy Trading',
    desc: 'Copy trades from top traders',
    to: '/copy-trading',
    iconSrc: '/images/copy_icon_menu.svg',
  },
  {
    id: 'otc',
    title: 'OTC Desk',
    desc: 'Large trades with better pricing',
    to: '/otc-desk',
    iconSrc: '/images/otcdesk_icon_menu.svg',
  },
  {
    id: 'p2p_trading',
    title: 'P2P Trading',
    desc: 'Buy and sell crypto directly with users',
    to: '/p2p-dashboard',
    iconSrc: '/images/p2p_trading_menu.svg',
  },
]

export const FUTURES_SUBMENU_ITEMS: SubmenuItem[] = [
  {
    id: 'usd_m',
    title: 'USD-M',
    desc: 'Trade futures settled in USDT',
    to: '/usd_futures/BTC_USDT',
    iconSrc: '/images/usd_icon_menu.svg',
  },
  {
    id: 'coin_m',
    title: 'Coin-M',
    desc: 'Trade futures settled in crypto',
    to: '/coin-m-futures',
    iconSrc: '/images/p2p_icon_menu.svg',
  },
  {
    id: 'options',
    title: 'Options',
    desc: 'Advanced trading with flexible strategies',
    to: '/futures-options',
    iconSrc: '/images/convert_icon_menu.svg',
  },
]

export const EARNING_SUBMENU_ITEMS: SubmenuItem[] = [
  {
    id: 'launchpad',
    title: 'Launchpad',
    desc: 'Discover and invest in new crypto projects',
    to: '/launchpad',
    iconSrc: '/images/usd_icon_menu.svg',
  },
  {
    id: 'refer_earn',
    title: 'Refer & Earn',
    desc: 'Invite friends and earn rewards',
    to: '/refer_earn',
    iconSrc: '/images/p2p_icon_menu.svg',
  },
  {
    id: 'vip',
    title: 'VIP',
    desc: 'Unlock premium benefits and support',
    to: '/vip-earning',
    iconSrc: '/images/otcdesk_icon_menu.svg',
  },
  {
    id: 'simple_earn',
    title: 'Simple Earn',
    desc: 'Earn passive income on your assets',
    to: '/earning',
    iconSrc: '/images/buy_icon_menu.svg',
  },
  {
    id: 'soft_staking',
    title: 'Soft Staking',
    desc: 'Stake assets with flexible returns',
    to: '/soft-staking',
    iconSrc: '/images/convert_icon_menu.svg',
  },
]

export const MORE_SUBMENU_ITEMS: SubmenuItem[] = [
  {
    id: 'announcements',
    title: 'Announcements',
    desc: 'Latest updates and platform news',
    to: '/announcement',
    iconSrc: '/images/usd_icon_menu.svg',
  },
  {
    id: 'referral',
    title: 'Referral',
    desc: 'Earn rewards by inviting friends',
    to: '/refer_earn',
    iconSrc: '/images/convert_icon_menu.svg',
  },
  {
    id: 'affiliate',
    title: 'Affiliate Program',
    desc: 'Earn commission by promoting us',
    to: '/affiliate-program',
    iconSrc: '/images/copy_icon_menu.svg',
  },
  {
    id: 'vip_services',
    title: 'VIP Services',
    desc: 'Exclusive benefits and priority support',
    to: '/vip-earning',
    iconSrc: '/images/p2p_icon_menu.svg',
  },
  {
    id: 'proof_reserves',
    title: 'Proof of Reserves',
    desc: 'Verify assets and platform transparency',
    to: '/proof-of-reserves',
    iconSrc: '/images/buy_icon_menu.svg',
  },
  {
    id: 'help_center',
    title: 'Help Center',
    desc: 'Get support and find answers',
    to: '/contact',
    iconSrc: '/images/otcdesk_icon_menu.svg',
  },
  {
    id: 'blogs',
    title: 'Blogs',
    desc: 'Read insights and market trends',
    to: '/blogs',
    iconSrc: '/images/convert_icon_menu.svg',
  },
  {
    id: 'partners',
    title: 'Partners',
    desc: 'Explore our trusted partners',
    to: '/partners',
    iconSrc: '/images/p2p_icon_menu.svg',
  },
]
