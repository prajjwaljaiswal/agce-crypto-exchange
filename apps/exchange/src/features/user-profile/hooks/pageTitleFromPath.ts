const capitalizeWallet = (str: string) => {
  if (!str) return 'Wallet'
  return str.charAt(0).toUpperCase() + str.slice(1) + ' Wallet'
}

export function pageTitleFromPath(pathname: string): string {
  if (pathname.includes('/user_profile/dashboard')) return 'Dashboard'
  if (pathname.includes('asset_overview')) return 'Overview'
  if (pathname.includes('wallet/')) {
    const match = pathname.match(/wallet\/([^/]+)/)
    if (match && match[1]) return capitalizeWallet(match[1])
  }
  if (pathname.includes('spot_orders')) return 'Spot Order'
  if (pathname.includes('transaction_history')) return 'Transaction History'
  if (pathname.includes('open_orders')) return 'Open Order'
  if (pathname.includes('swap_history')) return 'Swap History'
  if (pathname.includes('profile_setting')) return 'Settings'
  if (pathname.includes('kyc')) return 'Verification'
  if (pathname.includes('support')) return 'Support'
  if (pathname.includes('two_factor_authentication')) return 'Security'
  if (pathname.includes('wallet_transfer_history'))
    return 'Wallet Transfer History'
  if (pathname.endsWith('/user_profile/swap')) return 'Quick Swap'
  if (pathname.includes('notification')) return 'Notification'
  if (pathname.includes('activity_logs')) return 'Activity logs'
  if (pathname.includes('earning_plan_history')) return 'Earning Plan History'
  if (pathname === '/earning') return 'Earning'
  return 'Dashboard'
}

export function isWalletPageTitle(currentPage: string): boolean {
  return (
    currentPage.includes('Wallet') && currentPage !== 'Wallet Transfer History'
  )
}

const PAGE_ICON_MAP: Record<string, string> = {
  Dashboard: '/images/dasboard_home.svg',
  Overview: '/images/dashboard_assets.svg',
  'Spot Order': '/images/dashboard_order.svg',
  'Open Order': '/images/dashboard_order.svg',
  'Transaction History': '/images/dashboard_order.svg',
  'Swap History': '/images/dashboard_order.svg',
  'Wallet Transfer History': '/images/dashboard_order.svg',
  'Earning Plan History': '/images/dashboard_order.svg',
  Settings: '/images/dashboard_profile.svg',
  Verification: '/images/dashboard_profile.svg',
  Support: '/images/dashboard_profile.svg',
  Earning: '/images/earning_icon3.svg',
  Security: '/images/dashboard_security.svg',
  'Quick Swap': '/images/quick-swap.svg',
  Notification: '/images/dashboard_notification.svg',
  'Activity logs': '/images/dashboard_logs.svg',
}

export function pageIconFromTitle(currentPage: string): string {
  if (isWalletPageTitle(currentPage)) return '/images/dashboard_assets.svg'
  return PAGE_ICON_MAP[currentPage] || '/images/dasboard_home.svg'
}
