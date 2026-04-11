import { useState, useRef, useCallback, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X, Search, Sun, Moon, Smartphone } from 'lucide-react'
import { useInstanceConfig, useFeatureFlag } from '@agce/hooks'
import { useTheme } from '../../providers/index.js'
import type { DropdownKey, DropdownItem } from './types/index.js'
import { TRADE_ITEMS, FUTURES_ITEMS, EARN_ITEMS, DEMO_PAIRS } from './data/index.js'

// ─── DropdownMenu sub-component ──────────────────────────────────────────────

function DropdownMenu({
  items,
  isOpen,
  onEnter,
  onLeave,
  onItemClick,
}: {
  items: DropdownItem[]
  isOpen: boolean
  onEnter: () => void
  onLeave: () => void
  onItemClick: () => void
}) {
  if (!isOpen) return null

  return (
    <div
      className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden shadow-2xl min-w-[240px] z-50"
      style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {items.map(({ icon: Icon, label, desc, href }) => (
        <Link
          key={label}
          to={href}
          onClick={onItemClick}
          className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--color-surface-3)] no-underline"
        >
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ backgroundColor: 'var(--color-primary)22' }}
          >
            <Icon size={15} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <p className="text-sm font-medium leading-none mb-1" style={{ color: 'var(--color-text)' }}>
              {label}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {desc}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

// ─── SearchModal sub-component ───────────────────────────────────────────────

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const filtered = query.trim()
    ? DEMO_PAIRS.filter(
        (p) =>
          p.base.toLowerCase().includes(query.toLowerCase()) ||
          p.name.toLowerCase().includes(query.toLowerCase()),
      )
    : DEMO_PAIRS

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <h5 className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>
            Hot Trading Pairs
          </h5>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-2)]"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Close search"
          >
            <X size={15} />
          </button>
        </div>

        {/* Search input */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2.5">
            <Search size={15} style={{ color: 'var(--color-text-muted)' }} />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search here..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--color-text)' }}
            />
          </div>
        </div>

        {/* Sub-header */}
        <div className="px-5 pt-3 pb-1 flex justify-between">
          <span className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>Pair</span>
          <span className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>Price / 24h</span>
        </div>

        {/* Pair rows */}
        <div className="px-3 pb-3 max-h-72 overflow-y-auto">
          {filtered.length > 0 ? filtered.map(({ base, quote, name, price, change, up, color }) => (
            <div
              key={base}
              className="flex items-center justify-between px-2 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-surface-2)]"
              onClick={onClose}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: color + '33', color }}
                >
                  {base[0]}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none mb-0.5" style={{ color: 'var(--color-text)' }}>
                    {base}/{quote}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{price}</p>
                <p className="text-xs font-medium" style={{ color: up ? 'var(--color-green)' : 'var(--color-red)' }}>
                  {change}%
                </p>
              </div>
            </div>
          )) : (
            <p className="text-center py-8 text-sm" style={{ color: 'var(--color-text-subtle)' }}>
              No pairs found
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Navbar component ────────────────────────────────────────────────────

export function Navbar() {
  useInstanceConfig() // reserved for instance-specific nav customisation
  const hasLaunchpad = useFeatureFlag('tokenLaunchpad')
  const hasP2P       = useFeatureFlag('p2p')
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [openDropdown,  setOpenDropdown]  = useState<DropdownKey | null>(null)
  const [mobileExpanded,setMobileExpanded]= useState<DropdownKey | null>(null)
  const [searchOpen,    setSearchOpen]    = useState(false)

  const navRef    = useRef<HTMLDivElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Check if current page is an auth page (no nav should be active)
  const isAuthPage = ['/login', '/signup', '/forgot_password', '/account-verification'].some(
    path => location.pathname.startsWith(path)
  )

  const isActive = (path: string, exact = true) => {
    if (isAuthPage) return false
    return exact ? location.pathname === path : location.pathname.includes(path)
  }

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [])

  useEffect(() => () => { if (hoverTimer.current) clearTimeout(hoverTimer.current) }, [])

  const openHover = useCallback((key: DropdownKey) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    if (window.innerWidth >= 1024) setOpenDropdown(key)
  }, [])

  const closeHover = useCallback(() => {
    if (window.innerWidth < 1024) return
    hoverTimer.current = setTimeout(() => setOpenDropdown(null), 200)
  }, [])

  const toggleDesktopDropdown = (key: DropdownKey) => {
    setOpenDropdown((prev) => (prev === key ? null : key))
  }

  const toggleMobileExpanded = (key: DropdownKey) => {
    setMobileExpanded((prev) => (prev === key ? null : key))
  }

  const closeNavbar = () => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }

  const tradeItems = hasP2P ? TRADE_ITEMS : TRADE_ITEMS.filter((i) => i.label !== 'P2P')

  const activeNavStyle = { color: 'var(--color-primary)' }
  const inactiveNavStyle = { color: 'var(--color-text-muted)' }

  return (
    <>
      <header
        ref={navRef}
        className="sticky top-0 z-50"
        style={{ backgroundColor: '#070808', borderBottom: 'none' }}
      >
        <div className="flex h-[60px] items-center justify-between px-6 lg:px-[100px]">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 no-underline" onClick={closeNavbar}>
            <img
              src="/images/logo_light.svg"
              alt="Arab Global Crypto Exchange"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-6">

            {/* Buy Crypto */}
            <div
              className="relative"
              onMouseEnter={() => openHover('trade')}
              onMouseLeave={closeHover}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-md text-[13px] font-medium transition-colors hover:text-white"
                style={isActive('/trade', false) ? { color: 'white' } : { color: '#ccc' }}
                onClick={() => toggleDesktopDropdown('trade')}
              >
                Buy Crypto
                <ChevronDown size={12} className={`transition-transform duration-200 ${openDropdown === 'trade' ? 'rotate-180' : ''}`} />
              </button>
              <DropdownMenu
                items={tradeItems}
                isOpen={openDropdown === 'trade'}
                onEnter={() => openHover('trade')}
                onLeave={closeHover}
                onItemClick={closeNavbar}
              />
            </div>

            {/* Markets */}
            <Link
              to="/market"
              className="px-3 py-2 rounded-md text-[13px] font-medium transition-colors hover:text-white no-underline"
              style={isActive('/market') ? { color: 'white' } : { color: '#ccc' }}
            >
              Markets
            </Link>

            {/* Trade */}
            <div
              className="relative"
              onMouseEnter={() => openHover('futures')}
              onMouseLeave={closeHover}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-md text-[13px] font-medium transition-colors hover:text-white"
                style={isActive('/trade', false) || isActive('/p2p', false) ? { color: 'white' } : { color: '#ccc' }}
                onClick={() => toggleDesktopDropdown('futures')}
              >
                Trade
                <ChevronDown size={12} className={`transition-transform duration-200 ${openDropdown === 'futures' ? 'rotate-180' : ''}`} />
              </button>
              <DropdownMenu
                items={tradeItems}
                isOpen={openDropdown === 'futures'}
                onEnter={() => openHover('futures')}
                onLeave={closeHover}
                onItemClick={closeNavbar}
              />
            </div>

            {/* Futures */}
            <div
              className="relative"
              onMouseEnter={() => openHover('earn')}
              onMouseLeave={closeHover}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-md text-[13px] font-medium transition-colors hover:text-white"
                style={isActive('/usd_futures', false) ? { color: 'white' } : { color: '#ccc' }}
                onClick={() => toggleDesktopDropdown('earn')}
              >
                Futures
                <ChevronDown size={12} className={`transition-transform duration-200 ${openDropdown === 'earn' ? 'rotate-180' : ''}`} />
              </button>
              <DropdownMenu
                items={FUTURES_ITEMS}
                isOpen={openDropdown === 'earn'}
                onEnter={() => openHover('earn')}
                onLeave={closeHover}
                onItemClick={closeNavbar}
              />
            </div>

            {/* Earn */}
            <div
              className="relative"
              onMouseEnter={() => openHover('download')}
              onMouseLeave={closeHover}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-md text-[13px] font-medium transition-colors hover:text-white"
                style={isActive('/earning') || isActive('/refer_earn') ? { color: 'white' } : { color: '#ccc' }}
                onClick={() => toggleDesktopDropdown('download')}
              >
                Earn
                <ChevronDown size={12} className={`transition-transform duration-200 ${openDropdown === 'download' ? 'rotate-180' : ''}`} />
              </button>
              <DropdownMenu
                items={EARN_ITEMS}
                isOpen={openDropdown === 'download'}
                onEnter={() => openHover('download')}
                onLeave={closeHover}
                onItemClick={closeNavbar}
              />
            </div>

            {/* More */}
            <Link
              to="/coming-soon"
              className="flex items-center gap-1 px-3 py-2 rounded-md text-[13px] font-medium transition-colors hover:text-white no-underline"
              style={{ color: '#ccc' }}
            >
              More
              <ChevronDown size={12} />
            </Link>

            {/* Square */}
            <Link
              to="/coming-soon"
              className="px-3 py-2 rounded-md text-[13px] font-medium transition-colors hover:text-white no-underline"
              style={{ color: '#ccc' }}
            >
              Square
            </Link>

            {/* Rewards */}
            <Link
              to="/coming-soon"
              className="px-3 py-2 rounded-md text-[13px] font-medium transition-colors hover:text-white no-underline"
              style={{ color: '#ccc' }}
            >
              Rewards
            </Link>
          </nav>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-1.5">

            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg transition-colors hover:opacity-80"
              style={{ color: 'white' }}
              aria-label="Search pairs"
            >
              <Search size={16} />
            </button>

            <Link
              to="/login"
              className="px-3 py-1.5 text-[13px] font-semibold transition-colors hover:opacity-80 no-underline"
              style={{ color: 'white' }}
            >
              Log In
            </Link>

            <Link
              to="/signup"
              className="px-4 py-1 rounded-full text-[11px] font-semibold transition-opacity hover:opacity-90 no-underline"
              style={{ backgroundColor: 'white', color: '#070808' }}
            >
              Sign Up
            </Link>

            <div className="w-px h-4 mx-1.5" style={{ backgroundColor: '#484b51' }} />

            <button
              className="p-1.5 rounded-lg transition-colors hover:opacity-80"
              style={{ color: 'white' }}
              aria-label="Download app"
            >
              <Smartphone size={16} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg transition-colors hover:opacity-80"
              style={{ color: 'white' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* <button
              className="p-1.5 rounded-lg transition-colors hover:opacity-80"
              style={{ color: 'white' }}
              aria-label="Settings"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </button> */}
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 rounded-lg"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav
            className="lg:hidden border-t"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-0.5">

              {/* Home */}
              <Link
                to="/"
                onClick={closeNavbar}
                className="px-3 py-2.5 rounded-md text-sm no-underline"
                style={isActive('/') ? activeNavStyle : inactiveNavStyle}
              >
                Home
              </Link>

              {/* Market */}
              <Link
                to="/market"
                onClick={closeNavbar}
                className="px-3 py-2.5 rounded-md text-sm no-underline"
                style={isActive('/market') ? activeNavStyle : inactiveNavStyle}
              >
                Market
              </Link>

              {/* Trade accordion */}
              <div>
                <button
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm"
                  style={isActive('/trade', false) || isActive('/p2p', false) ? activeNavStyle : inactiveNavStyle}
                  onClick={() => toggleMobileExpanded('trade')}
                >
                  Trade
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${mobileExpanded === 'trade' ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileExpanded === 'trade' && (
                  <div className="ml-3 mt-0.5 mb-1.5 flex flex-col gap-0.5">
                    {tradeItems.map(({ icon: Icon, label, href }) => (
                      <Link
                        key={label}
                        to={href}
                        onClick={closeNavbar}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm no-underline"
                        style={{ color: 'var(--color-text-subtle)' }}
                      >
                        <Icon size={13} /> {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Futures accordion */}
              <div>
                <button
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm"
                  style={isActive('/usd_futures', false) || isActive('/coin_futures', false) ? activeNavStyle : inactiveNavStyle}
                  onClick={() => toggleMobileExpanded('futures')}
                >
                  Futures
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${mobileExpanded === 'futures' ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileExpanded === 'futures' && (
                  <div className="ml-3 mt-0.5 mb-1.5 flex flex-col gap-0.5">
                    {FUTURES_ITEMS.map(({ icon: Icon, label, href }) => (
                      <Link
                        key={label}
                        to={href}
                        onClick={closeNavbar}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm no-underline"
                        style={{ color: 'var(--color-text-subtle)' }}
                      >
                        <Icon size={13} /> {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Earning accordion */}
              <div>
                <button
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm"
                  style={isActive('/earning') || isActive('/refer_earn') ? activeNavStyle : inactiveNavStyle}
                  onClick={() => toggleMobileExpanded('earn')}
                >
                  Earning
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${mobileExpanded === 'earn' ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileExpanded === 'earn' && (
                  <div className="ml-3 mt-0.5 mb-1.5 flex flex-col gap-0.5">
                    {EARN_ITEMS.map(({ icon: Icon, label, href }) => (
                      <Link
                        key={label}
                        to={href}
                        onClick={closeNavbar}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm no-underline"
                        style={{ color: 'var(--color-text-subtle)' }}
                      >
                        <Icon size={13} /> {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Swap */}
              <Link
                to="/user_profile/swap"
                onClick={closeNavbar}
                className="px-3 py-2.5 rounded-md text-sm no-underline"
                style={isActive('/user_profile/swap') ? activeNavStyle : inactiveNavStyle}
              >
                Quick Swap
              </Link>

              {hasLaunchpad && (
                <Link
                  to="/launchpad"
                  onClick={closeNavbar}
                  className="px-3 py-2.5 rounded-md text-sm no-underline"
                  style={isActive('/launchpad') ? activeNavStyle : inactiveNavStyle}
                >
                  Launchpad 🚀
                </Link>
              )}

              {/* Meme+ */}
              <Link
                to="/meme"
                onClick={closeNavbar}
                className="px-3 py-2.5 rounded-md text-sm no-underline"
                style={isActive('/meme') ? activeNavStyle : inactiveNavStyle}
              >
                Meme+
              </Link>

              {/* Blogs & News */}
              <Link
                to="/blogs"
                onClick={closeNavbar}
                className="px-3 py-2.5 rounded-md text-sm no-underline"
                style={isActive('/blogs') ? activeNavStyle : inactiveNavStyle}
              >
                Blogs &amp; News
              </Link>

              {/* Mobile auth */}
              <div className="mt-3 flex flex-col gap-2 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                <Link
                  to="/login"
                  onClick={closeNavbar}
                  className="py-2.5 rounded-lg text-sm font-medium border text-center no-underline"
                  style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-text-muted)' }}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={closeNavbar}
                  className="py-2.5 rounded-lg text-sm font-semibold text-center no-underline"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#222017' }}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  )
}
