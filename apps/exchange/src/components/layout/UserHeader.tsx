import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  BUY_CRYPTO_SUBMENU_ITEMS,
  TRADE_SUBMENU_ITEMS,
  FUTURES_SUBMENU_ITEMS,
  EARNING_SUBMENU_ITEMS,
  MORE_SUBMENU_ITEMS,
  type SubmenuItem,
} from './headerMenuData.js'

type DropdownKey = 'buy_crypto' | 'trade' | 'futures' | 'earning' | 'more' | 'download' | null

export function UserHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownCloseTimerRef = useRef<number | null>(null)
  const downloadTimerRef = useRef<number | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null)
  const [downloadActive, setDownloadActive] = useState(false)
  const [isLightTheme, setIsLightTheme] = useState(false)

  const isAuthPage = ['/login', '/signup', '/forgot_password', '/account-verification'].some(
    (p) => location.pathname.startsWith(p),
  )

  const isActive = useCallback(
    (path: string, exact = true): boolean => {
      if (isAuthPage) return false
      return exact ? location.pathname === path : location.pathname.includes(path)
    },
    [isAuthPage, location.pathname],
  )

  const isAnyActive = useCallback(
    (paths: string[]): boolean => paths.some((p) => isActive(p, false)),
    [isActive],
  )

  useEffect(() => {
    const onClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpenDropdown(null)
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('touchstart', onClickOutside)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('touchstart', onClickOutside)
    }
  }, [])

  useEffect(() => {
    try {
      if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light_theme')
        setIsLightTheme(true)
      }
    } catch { /* noop */ }
  }, [])

  useEffect(() => {
    return () => {
      if (dropdownCloseTimerRef.current) window.clearTimeout(dropdownCloseTimerRef.current)
      if (downloadTimerRef.current) window.clearTimeout(downloadTimerRef.current)
    }
  }, [])

  const toggleNavbar = () => setIsOpen((v) => !v)
  const closeNavbar = () => { setIsOpen(false); setOpenDropdown(null) }
  const toggleDropdown = (key: Exclude<DropdownKey, null>) =>
    setOpenDropdown((cur) => (cur === key ? null : key))
  const openDropdownHover = (key: Exclude<DropdownKey, null>) => {
    if (dropdownCloseTimerRef.current) {
      window.clearTimeout(dropdownCloseTimerRef.current)
      dropdownCloseTimerRef.current = null
    }
    if (window.innerWidth >= 992) setOpenDropdown(key)
  }
  const closeDropdownHover = () => {
    if (window.innerWidth < 992) return
    dropdownCloseTimerRef.current = window.setTimeout(() => setOpenDropdown(null), 200)
  }

  const toggleTheme = () => {
    const light = document.body.classList.contains('light_theme')
    if (light) {
      document.body.classList.remove('light_theme')
      setIsLightTheme(false)
      try { localStorage.setItem('theme', 'dark') } catch { /* noop */ }
    } else {
      document.body.classList.add('light_theme')
      setIsLightTheme(true)
      try { localStorage.setItem('theme', 'light') } catch { /* noop */ }
    }
  }

  const openDownload = () => {
    if (downloadTimerRef.current) window.clearTimeout(downloadTimerRef.current)
    setDownloadActive(true)
  }
  const closeDownload = () => {
    downloadTimerRef.current = window.setTimeout(() => setDownloadActive(false), 200)
  }

  const renderSubmenu = (
    key: Exclude<DropdownKey, null>,
    items: SubmenuItem[],
    extraClass = '',
  ) => (
    <ul
      className={`dropdown-menu ${extraClass} ${openDropdown === key ? 'show' : ''}`}
      onMouseEnter={() => openDropdownHover(key)}
      onMouseLeave={closeDropdownHover}
    >
      {items.map((item) => (
        <li key={item.id}>
          <Link className="dropdown-item" to={item.to} onClick={closeNavbar}>
            <img
              className="nav_submenu_icon"
              src={item.iconSrc}
              alt=""
              width={44}
              height={44}
              loading="lazy"
            />
            <span className="dropdown-item-content">
              <span className="dropdown-item-text">
                {item.title}
                {item.titleSub ? <sub>{item.titleSub}</sub> : null}
              </span>
              <span className="dropdown-item-desc">{item.desc}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )

  return (
    <header className="sticky-top">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 logo_s">
            <div className="logo">
              <Link to="/">
                <img className="darkogo" src="/images/logo_light.svg" alt="logo" />
              </Link>
            </div>
          </div>

          <div className="col-lg-6 navigation_s">
            <div className="navigation" ref={dropdownRef}>
              <nav className="navbar navbar-expand-lg">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleNavbar}
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon">
                    <img src="/images/toggle_icon.svg" alt="toggle" />
                  </span>
                </button>

                <div
                  className={`navbar-collapse agce-navbar-collapse ${isOpen ? 'show' : ''}`}
                  id="mainNavbar"
                >
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                    {/* Buy Crypto */}
                    <li
                      className={`nav-item dropdown ${isAnyActive(['/buy_crypto', '/p2p']) ? 'active' : ''}`}
                      onMouseEnter={() => openDropdownHover('buy_crypto')}
                      onMouseLeave={closeDropdownHover}
                    >
                      <span
                        className={`nav-link dropdown-toggle ${isAnyActive(['/buy_crypto', '/p2p']) ? 'active' : ''}`}
                        role="button"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleDropdown('buy_crypto')}
                      >
                        Buy Crypto
                      </span>
                      {renderSubmenu('buy_crypto', BUY_CRYPTO_SUBMENU_ITEMS)}
                    </li>

                    {/* Market */}
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${isActive('/market') ? 'active' : ''}`}
                        to="/market"
                        onClick={closeNavbar}
                      >
                        Market
                      </Link>
                    </li>

                    {/* Trade */}
                    <li
                      className={`nav-item dropdown ${isAnyActive(['/trade', '/p2p-dashboard', '/copy-trading', '/otc-desk', '/user_profile/swap']) ? 'active' : ''}`}
                      onMouseEnter={() => openDropdownHover('trade')}
                      onMouseLeave={closeDropdownHover}
                    >
                      <span
                        className={`nav-link dropdown-toggle ${isAnyActive(['/trade', '/p2p-dashboard']) ? 'active' : ''}`}
                        role="button"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleDropdown('trade')}
                      >
                        Trade
                      </span>
                      {renderSubmenu('trade', TRADE_SUBMENU_ITEMS, 'dropdown-menu--trade')}
                    </li>

                    {/* Futures */}
                    <li
                      className={`nav-item dropdown ${isAnyActive(['/usd_futures', '/coin-m-futures', '/futures-options']) ? 'active' : ''}`}
                      onMouseEnter={() => openDropdownHover('futures')}
                      onMouseLeave={closeDropdownHover}
                    >
                      <span
                        className={`nav-link dropdown-toggle ${isAnyActive(['/usd_futures', '/coin-m-futures', '/futures-options']) ? 'active' : ''}`}
                        role="button"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleDropdown('futures')}
                      >
                        Futures
                      </span>
                      {renderSubmenu('futures', FUTURES_SUBMENU_ITEMS, 'dropdown-menu--futures')}
                    </li>

                    {/* Earning */}
                    <li
                      className={`nav-item dropdown ${isAnyActive(['/earning', '/refer_earn', '/launchpad', '/vip-earning', '/soft-staking']) ? 'active' : ''}`}
                      onMouseEnter={() => openDropdownHover('earning')}
                      onMouseLeave={closeDropdownHover}
                    >
                      <span
                        className={`nav-link dropdown-toggle ${isAnyActive(['/earning', '/refer_earn', '/launchpad', '/vip-earning', '/soft-staking']) ? 'active' : ''}`}
                        role="button"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleDropdown('earning')}
                      >
                        Earning
                      </span>
                      {renderSubmenu('earning', EARNING_SUBMENU_ITEMS, 'dropdown-menu--earning')}
                    </li>

                    {/* More */}
                    <li
                      className={`nav-item dropdown ${MORE_SUBMENU_ITEMS.some((item) => isActive(item.to, false)) ? 'active' : ''}`}
                      onMouseEnter={() => openDropdownHover('more')}
                      onMouseLeave={closeDropdownHover}
                    >
                      <span
                        className={`nav-link dropdown-toggle ${MORE_SUBMENU_ITEMS.some((item) => isActive(item.to, false)) ? 'active' : ''}`}
                        role="button"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleDropdown('more')}
                      >
                        More
                      </span>
                      {renderSubmenu('more', MORE_SUBMENU_ITEMS, 'dropdown-menu--more')}
                    </li>

                    {/* Square */}
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${isActive('/user_profile/square') ? 'active' : ''}`}
                        to="/user_profile/square"
                        onClick={closeNavbar}
                      >
                        Square
                      </Link>
                    </li>

                    {/* Rewards */}
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${isActive('/rewards') ? 'active' : ''}`}
                        to="/rewards"
                        onClick={closeNavbar}
                      >
                        Rewards
                      </Link>
                    </li>

                    {/* Download (mobile only) */}
                    <li className="nav-item dropdown mbl">
                      <span
                        className="nav-link dropdown-toggle"
                        role="button"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleDropdown('download')}
                      >
                        <img src="/images/download_icon2.svg" alt="scan" width={12} /> Download
                      </span>
                      <ul className={`dropdown-menu ${openDropdown === 'download' ? 'show' : ''}`}>
                        <li>
                          <div className="qrcode">
                            <div className="scan_img">
                              <img src="/images/scan.png" alt="scan" />
                            </div>
                            <p>Scan to Download App iOS &amp; Android</p>
                            <button className="btn" type="button">Download</button>
                          </div>
                        </li>
                      </ul>
                    </li>

                    {/* Theme (mobile only) */}
                    <li className="nav-item mbl">
                      <Link
                        className="nav-link"
                        to="/"
                        onClick={(e) => { e.preventDefault(); toggleTheme(); closeNavbar() }}
                        role="button"
                        aria-label="Toggle theme"
                      >
                        Theme{' '}
                        <span>
                          <img src="/images/themeicon.svg" alt="theme" />
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="header_right">
              <div className="button_outer">
                <a
                  className="search_icon"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Search"
                >
                  <i className="ri-search-line" />
                </a>
                <button className="login_btn sign_btn" type="button" onClick={() => navigate('/login')}>
                  <Link to="/login">Log In</Link>
                </button>
                <button className="login_btn" type="button" onClick={() => navigate('/signup')}>
                  <Link to="/signup">Sign Up</Link>
                </button>
                <div
                  className="themecolor_icon"
                  onClick={toggleTheme}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleTheme() }}
                  aria-label="Toggle theme"
                >
                  {isLightTheme
                    ? <i className="ri-moon-line dark_img" />
                    : <i className="ri-sun-line light-text" />}
                </div>

                <div
                  className={`downloadtabs${downloadActive ? ' active' : ''}`}
                  onMouseEnter={openDownload}
                  onMouseLeave={closeDownload}
                >
                  <img src="/images/download_icon2.svg" alt="download" />
                  <div
                    className="scantophdr"
                    onMouseEnter={openDownload}
                    onMouseLeave={closeDownload}
                  >
                    <div className="qrcode">
                      <div className="scan_img">
                        <img src="/images/scan.png" alt="scan" />
                      </div>
                      <p>Scan to Download App iOS &amp; Android</p>
                      <button className="btn" type="button">Download</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
