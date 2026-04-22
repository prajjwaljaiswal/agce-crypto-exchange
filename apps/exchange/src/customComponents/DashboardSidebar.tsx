import { Link, useLocation } from 'react-router-dom'
import { getUserProfileSegment } from './userProfileSidebarMode.js'

interface DashboardSidebarProps {
  toggleContent: (page?: string) => void
  walletTypes?: string[]
}

export default function DashboardSidebar({ toggleContent }: DashboardSidebarProps) {
  const location = useLocation()
  const seg = getUserProfileSegment(location.pathname)

  const fire = (label: string) => () => toggleContent(label)
  const liActive = (segment: string) => (seg === segment ? 'active mb-1' : 'mb-1')

  return (
    <ul className="list-unstyled ps-0 navi_sidebar dashboard-sidebar-root">
      <li className={liActive('dashboard')} onClick={fire('Dashboard')}>
        <Link to="dashboard">
          {/* <i className="ri-dashboard-line navi_sidebar_icon" aria-hidden="true" /> */}
          <img className="navi_sidebar_icon" src="/images/dashboard_menu_icon.svg" alt="Overview" width={20} height={20} />
          <div className="dashboard_menu_hd">Overview</div>
        </Link>
      </li>

      {/* <li className="mb-1">
        <button
          type="button"
          className="btn btn-toggle collapsed"
          onClick={() => setOpenAssets((v) => !v)}
        >
          <i className="ri-wallet-3-line navi_sidebar_icon" aria-hidden="true" />
          <div
            className={`dashboard_menu_hd ${
              walletActive ? "active_ul" : ""
            }`}
          >
            Assets
          </div>
          <span>
            <i
              className={openAssets ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}
              aria-hidden="true"
            />
          </span>
        </button>
        <div className={`collapse ${openAssets ? "show" : ""}`}>
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li
              className={liActive("asset_overview")}
              onClick={fire("Overview")}
            >
              <Link to="asset_overview" className="rounded">
                Overview
              </Link>
            </li>
            {walletTypes?.length > 0 &&
              walletTypes.map((wallet) => {
                const walletLabel = capitalizeWallet(wallet);
                const active =
                  location.pathname.includes(`/wallet/${wallet}`) ||
                  location.pathname.endsWith(`/wallet/${wallet}`);
                return (
                  <li
                    key={wallet}
                    className={active ? "active mb-1" : "mb-1"}
                    onClick={() => toggleContent?.(walletLabel)}
                  >
                    <Link to={`wallet/${wallet}`} className="rounded">
                      {walletLabel}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </li> */}

      <li className={liActive('security')} onClick={fire('Security')}>
        <Link to="security">
          {/* <i className="ri-shield-check-line navi_sidebar_icon" aria-hidden="true" /> */}
          <img className="navi_sidebar_icon" src="/images/dashboard_menu_icon2.svg" alt="Security" width={20} height={20} />
          <div className="dashboard_menu_hd">Security</div>
        </Link>
      </li>

      <li className={liActive('kyc')} onClick={fire('Identification')}>
        <Link to="kyc">
          {/* <i className="ri-id-card-line navi_sidebar_icon" aria-hidden="true" /> */}
          <img className="navi_sidebar_icon" src="/images/dashboard_menu_icon3.svg" alt="Identification" width={20} height={20} />
          <div className="dashboard_menu_hd">Identification</div>
        </Link>
      </li>

      {/* <li className="mb-1" onClick={fire("Dashboard")}>
        <Link to="dashboard">
          <i className="ri-group-line navi_sidebar_icon" aria-hidden="true" />
          <div className="dashboard_menu_hd">Subaccounts</div>
        </Link>
      </li>

      <li className="mb-1" onClick={fire("Dashboard")}>
        <Link to="dashboard">
          <i className="ri-key-2-line navi_sidebar_icon" aria-hidden="true" />
          <div className="dashboard_menu_hd">API Key Management</div>
        </Link>
      </li>

      <li className="mb-1" onClick={fire("Dashboard")}>
        <Link to="dashboard">
          <i className="ri-coupon-3-line navi_sidebar_icon" aria-hidden="true" />
          <div className="dashboard_menu_hd">Vouchers</div>
        </Link>
      </li>

      <li className={liActive("support")} onClick={fire("Support")}>
        <Link to="support">
          <i className="ri-customer-service-2-line navi_sidebar_icon" aria-hidden="true" />
          <div className="dashboard_menu_hd">My Tickets</div>
        </Link>
      </li>

      <li className={liActive("profile_setting")} onClick={fire("Settings")}>
        <Link to="profile_setting">
          <i className="ri-settings-3-line navi_sidebar_icon" aria-hidden="true" />
          <div className="dashboard_menu_hd">Settings</div>
        </Link>
      </li>

      <li className="mb-1" onClick={fire("Earning")}>
        <Link to="/earning">
          <i className="ri-money-dollar-circle-line navi_sidebar_icon" aria-hidden="true" />
          <div className="dashboard_menu_hd">Earning</div>
        </Link>
      </li>

      <li className={liActive("notification")} onClick={fire("Notification")}>
        <Link to="notification">
          <i className="ri-notification-3-line navi_sidebar_icon" aria-hidden="true" />
          <div className="dashboard_menu_hd">Notification</div>
        </Link>
      </li>

      <li className={liActive("activity_logs")} onClick={fire("Activity logs")}>
        <Link to="activity_logs">
          <i className="ri-history-line navi_sidebar_icon" aria-hidden="true" />
          <div className="dashboard_menu_hd">Activity logs</div>
        </Link>
      </li> */}
    </ul>
  )
}
