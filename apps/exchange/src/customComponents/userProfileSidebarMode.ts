const ORDER_RAIL_PREFIXES = [
  '/user_profile/orders',
  '/user_profile/spot_orders',
  '/user_profile/spot_order_history',
  '/user_profile/spot_open_orders',
  '/user_profile/spot_position_history',
  '/user_profile/open_orders',
  '/user_profile/futures_open_orders',
  '/user_profile/futures_order_history',
  '/user_profile/futures_trade_history',
  '/user_profile/position_history',
  '/user_profile/position_orders',
  '/user_profile/options_open_orders',
  '/user_profile/options_order_history',
  '/user_profile/options_trade_history',
  '/user_profile/options_position_history',
  '/user_profile/transaction_history',
  '/user_profile/swap_history',
  '/user_profile/wallet_transfer_history',
  '/user_profile/earning_plan_history',
  '/user_profile/bonus_history',
  '/user_profile/staking_orders',
  '/user_profile/convert_orders',
  '/user_profile/copy_trading_orders',
  '/user_profile/launchpad_transactions',
]

export function isOrderSidebarPath(pathname: string): boolean {
  return ORDER_RAIL_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function getUserProfileSegment(pathname: string): string {
  const match = pathname.match(/^\/user_profile\/([^/?#]+)/)
  return match?.[1] ?? ''
}

export function getUserProfileOrdersSegment(pathname: string): string {
  const match = pathname.match(/^\/user_profile\/orders\/([^/?#]+)/)
  return match?.[1] ?? ''
}

export const STAKING_PLACEHOLDER = '#'
