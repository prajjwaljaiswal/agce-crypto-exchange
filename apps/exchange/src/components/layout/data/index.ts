import {
  BarChart2, Users, LineChart, Coins, Gift,
} from 'lucide-react'
import type { DemoPair, DropdownItem, FooterSection, FooterSocialLink } from '../types/index.js'

// ─── Navbar ──────────────────────────────────────────────────────────────────

export const TRADE_ITEMS: DropdownItem[] = [
  { icon: BarChart2, label: 'Spot Trading', desc: 'Trade spot pairs with instant execution', href: '/trade/BTC_USDT' },
  { icon: Users, label: 'P2P', desc: 'Buy and sell crypto with other users', href: '/p2p-dashboard' },
]

export const FUTURES_ITEMS: DropdownItem[] = [
  { icon: LineChart, label: 'USDⓈ-M Futures', desc: 'Trade perpetual futures with leverage', href: '/usd_futures/BTC_USDT' },
]

export const EARN_ITEMS: DropdownItem[] = [
  { icon: Coins, label: 'Earning', desc: 'Staking, savings and earn rewards', href: '/earning' },
  { icon: Gift, label: 'Refer & Earn', desc: 'Invite friends and earn commission', href: '/refer_earn' },
]

export const DEMO_PAIRS: DemoPair[] = [
  { base: 'BTC', quote: 'USDT', name: 'Bitcoin', price: '$43,234', change: '-1.07', up: false, color: '#f7931a' },
  { base: 'ETH', quote: 'USDT', name: 'Ethereum', price: '$2,123', change: '+5.67', up: true, color: '#627eea' },
  { base: 'BNB', quote: 'USDT', name: 'BNB', price: '$318', change: '-2.43', up: false, color: '#f0b90b' },
  { base: 'SOL', quote: 'USDT', name: 'Solana', price: '$96.59', change: '+3.45', up: true, color: '#9945ff' },
  { base: 'ADA', quote: 'USDT', name: 'Cardano', price: '$0.52', change: '+1.23', up: true, color: '#0033ad' },
  { base: 'DOGE', quote: 'USDT', name: 'Dogecoin', price: '$0.082', change: '-8.23', up: false, color: '#c2a633' },
  { base: 'XRP', quote: 'USDT', name: 'Ripple', price: '$0.594', change: '-3.21', up: false, color: '#00aae4' },
  { base: 'MATIC', quote: 'USDT', name: 'Polygon', price: '$0.89', change: '+12.7', up: true, color: '#8247e5' },
]

// ─── Footer ──────────────────────────────────────────────────────────────────

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    key: 'about',
    title: 'About',
    links: [
      { label: 'About Us', href: '/aboutus' },
      { label: 'Careers', href: '/coming-soon' },
      { label: 'Newsroom', href: '/blogs' },
      { label: 'User Agreement', href: '/TermsofUse' },
      { label: 'Risk Warning', href: '/RiskDisclosure' },
      { label: 'Privacy Policy', href: '/PrivacyDataProtectionPolicy' },
      { label: 'Cookie Policy', href: '/coming-soon' },
      { label: 'Proof of Reserves', href: '/coming-soon' },
      { label: 'License', href: '/coming-soon' },
      { label: 'Security', href: '/security_system' },
    ],
  },
  {
    key: 'products',
    title: 'Products',
    links: [
      { label: 'Buy Crypto', href: '/trade/BTC_USDT', isNew: true },
      { label: 'P2P', href: '/p2p-dashboard' },
      { label: 'Convert & Block Trading', href: '/coming-soon' },
      { label: 'Spot Trading', href: '/trade/BTC_USDT' },
      { label: 'Margin', href: '/coming-soon' },
      { label: 'Earn Center', href: '/earning' },
      { label: 'Futures', href: '/usd_futures/BTC_USDT' },
      { label: 'OTC', href: '/coming-soon' },
    ],
  },
  {
    key: 'services',
    title: 'Services',
    links: [
      { label: 'VIP Benefits', href: '/coming-soon' },
      { label: 'Institutional', href: '/coming-soon' },
      { label: 'User Feedback', href: '/contact' },
      { label: 'Announcement', href: '/announcement' },
      { label: 'Fees', href: '/fees' },
      { label: 'Help Center', href: '/FAQ' },
      { label: 'Submit a Request', href: '/contact' },
      { label: 'Listing', href: '/coin_list' },
      { label: 'Developers', href: '/coming-soon' },
      { label: 'Affiliate Program', href: '/refer_earn' },
    ],
  },
  {
    key: 'learn',
    title: 'Learn',
    links: [
      { label: 'Learn', href: '/blogs' },
      { label: 'Crypto Market', href: '/market' },
      { label: 'Big Data', href: '/coming-soon' },
      { label: 'Crypto Price', href: '/market', isNew: true },
      { label: 'How to Buy Crypto', href: '/blogs', isNew: true },
      { label: 'Crypto Price Prediction', href: '/coming-soon', isNew: true },
      { label: 'Crypto to Fiat', href: '/coming-soon', isNew: true },
      { label: 'Crypto Encyclopedia', href: '/blogs' },
    ],
  },
]

export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  { img: '/images/email_icon.svg', label: 'Email', href: 'mailto:support@agce.com' },
  { img: '/images/facebook.svg', label: 'Facebook', href: 'https://facebook.com' },
  { img: '/images/twitter.png', label: 'Twitter', href: 'https://twitter.com' },
  { img: '/images/telegramicon.svg', label: 'Telegram', href: 'https://t.me' },
  { img: '/images/instagram.svg', label: 'Instagram', href: 'https://instagram.com' },
  { img: '/images/linkdin.svg', label: 'LinkedIn', href: 'https://linkedin.com' },
  { img: '/images/youtube.svg', label: 'YouTube', href: 'https://youtube.com' },
]
