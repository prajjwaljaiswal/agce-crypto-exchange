import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useSidebarState } from '@agce/hooks'
import { useAuth } from '../../providers/index.js'
import { usePageTitle } from './hooks/usePageTitle.js'
import {
  isWalletPageTitle,
  pageIconFromTitle,
} from './hooks/pageTitleFromPath.js'

type SectionKey = 'assets' | 'orders' | 'account'

const capitalizeWallet = (str: string) => {
  if (!str) return 'Wallet'
  return str.charAt(0).toUpperCase() + str.slice(1) + ' Wallet'
}

export function ProfileLayout() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  // TODO: replace with wallet types fetched from backend (ProfileContext)
  const [walletTypes] = useState<string[]>([])

  const currentPage = usePageTitle()
  const isWalletPage = isWalletPageTitle(currentPage)
  const pageIcon = pageIconFromTitle(currentPage)

  const { isActive, toggleActive, openSection, toggleSection } =
    useSidebarState<SectionKey>()

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
      <div className="mobile_view" id="toggleBtn" onClick={toggleActive}>
        <img
          src={pageIcon}
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
              onClick={toggleActive}
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
                    onClick={toggleActive}
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
                          onClick={toggleActive}
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
                    onClick={toggleActive}
                    className={currentPage === 'Spot Order' ? 'active' : ''}
                  >
                    <Link to="/user_profile/spot_orders" className="rounded">
                      Spot Order
                    </Link>
                  </li>
                  <li
                    onClick={toggleActive}
                    className={currentPage === 'Open Order' ? 'active' : ''}
                  >
                    <Link to="/user_profile/open_orders" className="rounded">
                      Open Order
                    </Link>
                  </li>
                  <li
                    onClick={toggleActive}
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
                    onClick={toggleActive}
                    className={currentPage === 'Swap History' ? 'active' : ''}
                  >
                    <Link to="/user_profile/swap_history" className="rounded">
                      Swap History
                    </Link>
                  </li>
                  <li
                    onClick={toggleActive}
                    className={
                      currentPage === 'Wallet Transfer History' ? 'active' : ''
                    }
                  >
                    <Link
                      to="/user_profile/wallet_transfer_history"
                      className="rounded"
                    >
                      Internal Wallet Transfer
                    </Link>
                  </li>
                  <li
                    onClick={toggleActive}
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
                    onClick={toggleActive}
                    className={currentPage === 'Settings' ? 'active' : ''}
                  >
                    <Link to="/user_profile/profile_setting" className="rounded">
                      Settings
                    </Link>
                  </li>
                  <li
                    onClick={toggleActive}
                    className={currentPage === 'Verification' ? 'active' : ''}
                  >
                    <Link to="/user_profile/kyc" className="rounded">
                      Verification
                    </Link>
                  </li>
                  <li
                    onClick={toggleActive}
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
              onClick={toggleActive}
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
              onClick={toggleActive}
              className={`${currentPage === 'Security' ? 'active' : ''} mb-1`}
            >
              <Link to="/user_profile/two_factor_authentication">
                <i
                  className="ri-shield-check-line navi_sidebar_icon"
                  aria-hidden
                />
                <div className="dashboard_menu_hd">Security</div>
              </Link>
            </li>

            {/* Quick Swap */}
            <li
              onClick={toggleActive}
              className={`${currentPage === 'Quick Swap' ? 'active' : ''} mb-1`}
            >
              <Link to="/user_profile/swap">
                <i className="ri-swap-line navi_sidebar_icon" aria-hidden />
                <div className="dashboard_menu_hd">Quick Swap</div>
              </Link>
            </li>

            {/* Notification */}
            <li
              onClick={toggleActive}
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
              onClick={toggleActive}
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
