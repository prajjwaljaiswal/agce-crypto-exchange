import { NavLink, Outlet } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/asset_management/deposit', label: 'Deposit Crypto', icon: 'ri-download-2-line' },
  { to: '/asset_management/withdraw', label: 'Withdraw', icon: 'ri-upload-2-line' },
]

export function AssetManagementLayout() {
  return (
    <div className="dashboard">
      <div id="content" className="flex-shrink-0 leftside_menu">
        <ul className="list-unstyled ps-0 navi_sidebar">
          {NAV_ITEMS.map((item) => (
            <li key={item.to} className="mb-1">
              <NavLink
                to={item.to}
                className={({ isActive }) => (isActive ? 'active-link' : undefined)}
              >
                <i className={`${item.icon} navi_sidebar_icon`} aria-hidden />
                <div className="dashboard_menu_hd">{item.label}</div>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </div>
  )
}
