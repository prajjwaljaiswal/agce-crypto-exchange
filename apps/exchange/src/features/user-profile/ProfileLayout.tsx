import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../providers/index.js'

type SectionKey = 'assets' | 'orders' | 'account' | null

const capitalizeWallet = (str: string) => {
  if (!str) return 'Wallet'
  return str.charAt(0).toUpperCase() + str.slice(1) + ' Wallet'
}

export function ProfileLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  // TODO: replace with wallet types fetched from backend (ProfileContext)
  const [walletTypes] = useState<string[]>([])

  const [currentPage, setCurrentPage] = useState<string>('Dashboard')
  const [isActive, setIsActive] = useState(false)
  const [openSection, setOpenSection] = useState<SectionKey>(null)

  // Dynamic page detection — mirrors legacy ProfilePage useEffect
  useEffect(() => {
    const path = location.pathname

    if (path.includes('/user_profile/dashboard')) setCurrentPage('Dashboard')
    else if (path.includes('asset_overview')) setCurrentPage('Overview')
    else if (path.includes('wallet/')) {
      const walletMatch = path.match(/wallet\/([^/]+)/)
      if (walletMatch && walletMatch[1]) {
        setCurrentPage(capitalizeWallet(walletMatch[1]))
      }
    } else if (path.includes('spot_orders')) setCurrentPage('Spot Order')
    else if (path.includes('transaction_history'))
      setCurrentPage('Transaction History')
    else if (path.includes('open_orders')) setCurrentPage('Open Order')
    else if (path.includes('swap_history')) setCurrentPage('Swap History')
    else if (path.includes('profile_setting')) setCurrentPage('Settings')
    else if (path.includes('kyc')) setCurrentPage('Verification')
    else if (path.includes('support')) setCurrentPage('Support')
    else if (path.includes('two_factor_autentication'))
      setCurrentPage('Security')
    else if (path.includes('wallet_transfer_History'))
      setCurrentPage('Wallet Transfer History')
    else if (path.endsWith('/user_profile/swap')) setCurrentPage('Quick Swap')
    else if (path.includes('notification')) setCurrentPage('Notification')
    else if (path.includes('activity_logs')) setCurrentPage('Activity logs')
    else if (path.includes('earning_plan_history'))
      setCurrentPage('Earning Plan History')
    else if (path === '/earning') setCurrentPage('Earning')
  }, [location.pathname])

  const isWalletPage = useMemo(() => {
    return (
      currentPage?.includes('Wallet') && currentPage !== 'Wallet Transfer History'
    )
  }, [currentPage])

  const getPageIcon = useMemo(() => {
    const iconMap: Record<string, string> = {
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

    if (isWalletPage) return '/images/dashboard_assets.svg'
    return iconMap[currentPage] || '/images/dasboard_home.svg'
  }, [currentPage, isWalletPage])

  const toggleContent = (page?: string) => {
    setIsActive((v) => !v)
    if (page) setCurrentPage(page)
  }

  const toggleSection = (key: Exclude<SectionKey, null>) =>
    setOpenSection((cur) => (cur === key ? null : key))

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const assetsActiveUl = currentPage === 'Overview' || isWalletPage
  const ordersActiveUl =
    currentPage === 'Spot Order' ||
    currentPage === 'Open Order' ||
    currentPage === 'Transaction History' ||
    currentPage === 'Swap History' ||
    currentPage === 'Wallet Transfer History' ||
    currentPage === 'Earning Plan History'
  const accountActiveUl =
    currentPage === 'Settings' ||
    currentPage === 'Verification' ||
    currentPage === 'Support'

  return (
    <>
      <div
        className="mobile_view"
        id="toggleBtn"
        onClick={() => toggleContent()}
      >
        <img
          src={getPageIcon}
          alt={currentPage}
          width={20}
          height={20}
          style={{ marginRight: 8 }}
        />
        <div className="d-flex align-items-center justify-content-between w-100">
          {currentPage}
          <span>
            <i className="ri-arrow-down-s-line" />
          </span>
        </div>
      </div>

      <div className="dashboard">
        <div
          id="content"
          className={
            isActive
              ? 'active flex-shrink-0 leftside_menu'
              : 'flex-shrink-0 leftside_menu'
          }
        >
          <ul className="list-unstyled ps-0 navi_sidebar">
            {/* Dashboard */}
            <li
              onClick={() => toggleContent('Dashboard')}
              className={`${currentPage === 'Dashboard' ? 'active' : ''} mb-1`}
            >
              <Link to="/user_profile/dashboard">
                <i className="ri-home-4-line navi_sidebar_icon" aria-hidden />
                <div className="dashboard_menu_hd">Dashboard</div>
              </Link>
            </li>

            {/* Assets */}
            <li className="mb-1">
              <button
                type="button"
                className="btn btn-toggle collapsed"
                onClick={() => toggleSection('assets')}
              >
                <i className="ri-wallet-3-line navi_sidebar_icon" aria-hidden />
                <div
                  className={`dashboard_menu_hd ${assetsActiveUl ? 'active_ul' : ''}`}
                >
                  Assets
                </div>
                <span>
                  <i className="ri-arrow-down-s-line" />
                </span>
              </button>
              <div
                className={`collapse ${openSection === 'assets' ? 'show' : ''}`}
              >
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li
                    onClick={() => toggleContent('Overview')}
                    className={currentPage === 'Overview' ? 'active' : ''}
                  >
                    <Link to="/user_profile/asset_overview" className="rounded">
                      Overview
                    </Link>
                  </li>
                  {walletTypes?.length > 0 &&
                    walletTypes.map((wallet) => {
                      const walletLabel = capitalizeWallet(wallet)
                      return (
                        <li
                          key={wallet}
                          onClick={() => toggleContent(walletLabel)}
                          className={currentPage === walletLabel ? 'active' : ''}
                        >
                          <Link
                            to={`/user_profile/wallet/${wallet}`}
                            className="rounded"
                          >
                            {walletLabel}
                          </Link>
                        </li>
                      )
                    })}
                </ul>
              </div>
            </li>

            {/* Orders */}
            <li className="mb-1">
              <button
                type="button"
                className="btn btn-toggle collapsed"
                onClick={() => toggleSection('orders')}
              >
                <i
                  className="ri-file-list-3-line navi_sidebar_icon"
                  aria-hidden
                />
                <div
                  className={`dashboard_menu_hd ${ordersActiveUl ? 'active_ul' : ''}`}
                >
                  Orders
                </div>
                <span>
                  <i className="ri-arrow-down-s-line" />
                </span>
              </button>
              <div
                className={`collapse ${openSection === 'orders' ? 'show' : ''}`}
              >
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li
                    onClick={() => toggleContent('Spot Order')}
                    className={currentPage === 'Spot Order' ? 'active' : ''}
                  >
                    <Link to="/user_profile/spot_orders" className="rounded">
                      Spot Order
                    </Link>
                  </li>
                  <li
                    onClick={() => toggleContent('Open Order')}
                    className={currentPage === 'Open Order' ? 'active' : ''}
                  >
                    <Link to="/user_profile/open_orders" className="rounded">
                      Open Order
                    </Link>
                  </li>
                  <li
                    onClick={() => toggleContent('Transaction History')}
                    className={
                      currentPage === 'Transaction History' ? 'active' : ''
                    }
                  >
                    <Link
                      to="/user_profile/transaction_history"
                      className="rounded"
                    >
                      Transaction History
                    </Link>
                  </li>
                  <li
                    onClick={() => toggleContent('Swap History')}
                    className={currentPage === 'Swap History' ? 'active' : ''}
                  >
                    <Link to="/user_profile/swap_history" className="rounded">
                      Swap History
                    </Link>
                  </li>
                  <li
                    onClick={() => toggleContent('Wallet Transfer History')}
                    className={
                      currentPage === 'Wallet Transfer History' ? 'active' : ''
                    }
                  >
                    <Link
                      to="/user_profile/wallet_transfer_History"
                      className="rounded"
                    >
                      Internal Wallet Transfer
                    </Link>
                  </li>
                  <li
                    onClick={() => toggleContent('Earning Plan History')}
                    className={
                      currentPage === 'Earning Plan History' ? 'active' : ''
                    }
                  >
                    <Link
                      to="/user_profile/earning_plan_history"
                      className="rounded"
                    >
                      Earning History
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* Account */}
            <li className="mb-1">
              <button
                type="button"
                className="btn btn-toggle collapsed"
                onClick={() => toggleSection('account')}
              >
                <i
                  className="ri-user-settings-line navi_sidebar_icon"
                  aria-hidden
                />
                <div
                  className={`dashboard_menu_hd ${accountActiveUl ? 'active_ul' : ''}`}
                >
                  Account
                </div>
                <span>
                  <i className="ri-arrow-down-s-line" />
                </span>
              </button>
              <div
                className={`collapse ${openSection === 'account' ? 'show' : ''}`}
              >
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li
                    onClick={() => toggleContent('Settings')}
                    className={currentPage === 'Settings' ? 'active' : ''}
                  >
                    <Link to="/user_profile/profile_setting" className="rounded">
                      Settings
                    </Link>
                  </li>
                  <li
                    onClick={() => toggleContent('Verification')}
                    className={currentPage === 'Verification' ? 'active' : ''}
                  >
                    <Link to="/user_profile/kyc" className="rounded">
                      Verification
                    </Link>
                  </li>
                  <li
                    onClick={() => toggleContent('Support')}
                    className={currentPage === 'Support' ? 'active' : ''}
                  >
                    <Link to="/user_profile/support" className="rounded">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* Earning */}
            <li
              onClick={() => toggleContent('Earning')}
              className={`${currentPage === 'Earning' ? 'active' : ''} mb-1`}
            >
              <Link to="/earning">
                <i
                  className="ri-money-dollar-circle-line navi_sidebar_icon"
                  aria-hidden
                />
                <div className="dashboard_menu_hd">Earning</div>
              </Link>
            </li>

            {/* Security */}
            <li
              onClick={() => toggleContent('Security')}
              className={`${currentPage === 'Security' ? 'active' : ''} mb-1`}
            >
              <Link to="/user_profile/two_factor_autentication">
                <i
                  className="ri-shield-check-line navi_sidebar_icon"
                  aria-hidden
                />
                <div className="dashboard_menu_hd">Security</div>
              </Link>
            </li>

            {/* Quick Swap */}
            <li
              onClick={() => toggleContent('Quick Swap')}
              className={`${currentPage === 'Quick Swap' ? 'active' : ''} mb-1`}
            >
              <Link to="/user_profile/swap">
                <i className="ri-swap-line navi_sidebar_icon" aria-hidden />
                <div className="dashboard_menu_hd">Quick Swap</div>
              </Link>
            </li>

            {/* Notification */}
            <li
              onClick={() => toggleContent('Notification')}
              className={`${currentPage === 'Notification' ? 'active' : ''} mb-1`}
            >
              <Link to="/user_profile/notification">
                <i
                  className="ri-notification-3-line navi_sidebar_icon"
                  aria-hidden
                />
                <div className="dashboard_menu_hd">Notification</div>
              </Link>
            </li>

            {/* Activity logs */}
            <li
              onClick={() => toggleContent('Activity logs')}
              className={`${currentPage === 'Activity logs' ? 'active' : ''} mb-1`}
            >
              <Link to="/user_profile/activity_logs">
                <i className="ri-history-line navi_sidebar_icon" aria-hidden />
                <div className="dashboard_menu_hd">Activity logs</div>
              </Link>
            </li>
          </ul>

          <div className="logout_btn" onClick={handleLogout}>
            <Link to="#/">
              Logout
              <i className="ri-logout-circle-r-line" />
            </Link>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  )
}
