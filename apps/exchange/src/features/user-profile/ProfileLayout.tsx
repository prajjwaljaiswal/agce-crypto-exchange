import { useContext, useEffect, useState, useMemo } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ProfileContext } from '../../context/ProfileProvider.js'
import OrderSidebar from '../../customComponents/OrderSidebar.js'
import DashboardSidebar from '../../customComponents/DashboardSidebar.js'
import { isOrderSidebarPath } from '../../customComponents/userProfileSidebarMode.js'
import './profile-sidebar.css'

const capitalizeWallet = (str: string) => {
  if (!str) return 'Wallet'
  return str.charAt(0).toUpperCase() + str.slice(1) + ' Wallet'
}

export function ProfileLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentPage, setCurrentPage, walletTypes } = useContext(ProfileContext)

  const orderRail = useMemo(() => isOrderSidebarPath(location.pathname), [location.pathname])
  const hideSidebar = location.pathname.startsWith('/user_profile/security/')

  useEffect(() => {
    const path = location.pathname

    if (path.includes('/user_profile/dashboard')) setCurrentPage('Dashboard')
    else if (path.includes('asset_overview')) setCurrentPage('Overview')
    else if (path.includes('wallet/')) {
      const walletMatch = path.match(/wallet\/([^/]+)/)
      if (walletMatch && walletMatch[1]) {
        setCurrentPage(capitalizeWallet(walletMatch[1]))
      }
    } else if (path.includes('spot_position_history')) setCurrentPage('Spot Position History')
    else if (path.includes('spot_order_history') || path.includes('spot_open_orders')) setCurrentPage('Spot Order History')
    else if (path.includes('spot_orders')) setCurrentPage('Spot Order')
    else if (path.includes('futures_open_orders')) setCurrentPage('Futures Open Order')
    else if (path.includes('transaction_history')) setCurrentPage('Transaction History')
    else if (path.includes('futures_order_history')) setCurrentPage('Futures Order History')
    else if (path.includes('options_position_history')) setCurrentPage('Options Position History')
    else if (path.includes('position_history')) setCurrentPage('Position History')
    else if (path.includes('position_orders')) setCurrentPage('Position Orders')
    else if (path.includes('futures_trade_history')) setCurrentPage('Futures Trade History')
    else if (path.includes('options_order_history')) setCurrentPage('Options Order History')
    else if (path.includes('options_trade_history')) setCurrentPage('Options Trade History')
    else if (path.includes('options_open_orders')) setCurrentPage('Options Open Orders')
    else if (path.includes('staking_orders')) setCurrentPage('Staking Orders')
    else if (path.includes('convert_orders')) setCurrentPage('Convert')
    else if (path.includes('copy_trading_orders')) setCurrentPage('Copy Trading')
    else if (path.includes('launchpad_transactions')) setCurrentPage('Launchpad Transactions')
    else if (path === '/user_profile/orders' || path.includes('/user_profile/orders/open_orders')) setCurrentPage('Open Order')
    else if (path.includes('swap_history')) setCurrentPage('Swap History')
    else if (path.includes('profile_setting')) setCurrentPage('Settings')
    else if (path.includes('kyc')) setCurrentPage('Identification')
    else if (path.includes('bank')) setCurrentPage('Bank Details')
    else if (path.includes('currency_preference')) setCurrentPage('Currency Preference')
    else if (path.includes('support')) setCurrentPage('Support')
    else if (
      path.includes('two_factor_authentication') ||
      (path.startsWith('/user_profile/security') && !path.includes('/user_profile/security/'))
    ) {
      setCurrentPage('Security')
    } else if (path.includes('password_security')) setCurrentPage('Reset Password')
    else if (path.includes('arbitrage_bot') || path.includes('arbitrage_dashboard')) setCurrentPage('Arbitrage Bot')
    else if (path.includes('wallet_transfer_History')) setCurrentPage('Wallet Transfer History')
    else if (path.includes('swap')) setCurrentPage('Quick Swap')
    else if (path.includes('notification')) setCurrentPage('Notification')
    else if (path.includes('activity_logs')) setCurrentPage('Activity logs')
    else if (path.includes('earning_plan_history')) setCurrentPage('Earning Plan History')
    else if (path.includes('bonus_history')) setCurrentPage('Bonus History')
  }, [location.pathname, setCurrentPage])

  const [isActive, setIsActive] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleContent = (page?: string) => {
    setIsActive((v) => !v)
    if (page) setCurrentPage(page)
  }

  const getPageIcon = useMemo(() => {
    const iconMap: Record<string, string> = {
      Dashboard: '/images/dasboard_home.svg',
      Overview: '/images/dashboard_assets.svg',
      'Spot Order': '/images/dashboard_order.svg',
      'Spot Order History': '/images/dashboard_order.svg',
      'Spot Position History': '/images/dashboard_order.svg',
      'Open Order': '/images/dashboard_order.svg',
      'Futures Open Order': '/images/dashboard_order.svg',
      'Futures Order History': '/images/dashboard_order.svg',
      'Position History': '/images/dashboard_order.svg',
      'Position Orders': '/images/dashboard_order.svg',
      'Futures Trade History': '/images/dashboard_order.svg',
      'Staking Orders': '/images/earning_icon3.svg',
      Convert: '/images/quick-swap.svg',
      'Copy Trading': '/images/dashboard_order.svg',
      'Launchpad Transactions': '/images/earning_icon3.svg',
      Identification: '/images/dashboard_profile.svg',
      'Transaction History': '/images/dashboard_order.svg',
      'Swap History': '/images/dashboard_order.svg',
      'Wallet Transfer History': '/images/dashboard_order.svg',
      'Earning Plan History': '/images/dashboard_order.svg',
      'Bonus History': '/images/dashboard_order.svg',
      Settings: '/images/dashboard_profile.svg',
      Verification: '/images/dashboard_profile.svg',
      kyc: '/images/dashboard_profile.svg',
      'Bank Details': '/images/dashboard_profile.svg',
      'Currency Preference': '/images/dashboard_profile.svg',
      Support: '/images/dashboard_profile.svg',
      Earning: '/images/earning_icon3.svg',
      Security: '/images/dashboard_security.svg',
      'Reset Password': '/images/dashboard_security.svg',
      'Quick Swap': '/images/quick-swap.svg',
      Notification: '/images/dashboard_notification.svg',
      'Activity logs': '/images/dashboard_logs.svg',
    }

    if (currentPage?.includes('Wallet') && currentPage !== 'Wallet Transfer History') {
      return '/images/dashboard_assets.svg'
    }

    return iconMap[currentPage] ?? '/images/dasboard_home.svg'
  }, [currentPage])

  const logOut = () => {
    localStorage.clear()
    navigate('/')
    window.location.reload()
  }

  return (
    <>
      <Helmet>
        <title> Wrathcode Exchange | The world class new generation crypto asset exchange</title>
      </Helmet>
      <div className="mobile_view" id="toggleBtn" onClick={() => toggleContent()}>
        <img src={getPageIcon} alt={currentPage} width={20} height={20} style={{ marginRight: '8px' }} />
        <div className="d-flex align-items-center justify-content-between w-100">
          {currentPage}
          <span>
            <i className="ri-arrow-down-s-line"></i>
          </span>
        </div>
      </div>

      <div className={`dashboard${sidebarCollapsed ? ' dashboard--sidebar-collapsed' : ''}${hideSidebar ? ' dashboard--no-sidebar' : ''}`}>
        {!hideSidebar && (
          <div
            id="content"
            className={`${isActive ? 'active flex-shrink-0 leftside_menu' : 'flex-shrink-0 leftside_menu'} profile-sidebar-shell${sidebarCollapsed ? ' profile-sidebar-shell--collapsed' : ''}${orderRail ? ' profile-sidebar-shell--orders' : ' profile-sidebar-shell--dashboard'}`}
          >
            <button
              type="button"
              className="profile-sidebar-collapse-btn"
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-expanded={!sidebarCollapsed}
              aria-label={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              <i className={sidebarCollapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} aria-hidden="true" />
            </button>

            {orderRail ? (
              <OrderSidebar toggleContent={toggleContent} />
            ) : (
              <DashboardSidebar toggleContent={toggleContent} walletTypes={walletTypes} />
            )}
            {!orderRail && (
              <div className="logout_btn" onClick={logOut}>
                <Link to="#/">
                  Logout<i className="ri-logout-circle-r-line"></i>
                </Link>
              </div>
            )}
          </div>
        )}
        <Outlet />
      </div>
    </>
  )
}
