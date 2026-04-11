import { useState, useRef, useCallback, useEffect } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ChevronDown, Menu, X, Search, Sun, Moon,
  BarChart2, Users, LineChart, Coins, Gift, Smartphone,
} from 'lucide-react'
import { useInstanceConfig, useFeatureFlag } from '@agce/hooks'
import { useTheme } from '../../providers/index.js'

// ─── Types ───────────────────────────────────────────────────────────────────

type DropdownKey = 'trade' | 'futures' | 'earn' | 'download'

interface DropdownItem {
  icon: LucideIcon
  label: string
  desc: string
  href: string
}

// ─── Static nav data ─────────────────────────────────────────────────────────

const TRADE_ITEMS: DropdownItem[] = [
  { icon: BarChart2, label: 'Spot Trading',  desc: 'Trade spot pairs with instant execution',   href: '#' },
  { icon: Users,    label: 'P2P',           desc: 'Buy and sell crypto with other users',       href: '#' },
]

const FUTURES_ITEMS: DropdownItem[] = [
  { icon: LineChart, label: 'USDⓈ-M Futures', desc: 'Trade perpetual futures with leverage', href: '#' },
]

const EARN_ITEMS: DropdownItem[] = [
  { icon: Coins, label: 'Earning',     desc: 'Staking, savings and earn rewards',       href: '#' },
  { icon: Gift,  label: 'Refer & Earn', desc: 'Invite friends and earn commission',     href: '#' },
]

// ─── DropdownMenu sub-component ──────────────────────────────────────────────

function DropdownMenu({
  items,
  isOpen,
  onEnter,
  onLeave,
}: {
  items: DropdownItem[]
  isOpen: boolean
  onEnter: () => void
  onLeave: () => void
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
        <a
          key={label}
          href={href}
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
        </a>
      ))}
    </div>
  )
}

// ─── Download dropdown sub-component ─────────────────────────────────────────

function DownloadDropdown({ isOpen, onEnter, onLeave }: {
  isOpen: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  if (!isOpen) return null

  return (
    <div
      className="absolute right-0 top-full mt-1 rounded-xl p-4 shadow-2xl w-52 z-50"
      style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* QR placeholder */}
      <div
        className="w-28 h-28 mx-auto rounded-xl mb-3 flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}
      >
        {/* 5×5 dot grid — QR placeholder */}
        <div className="grid grid-cols-5 gap-1 p-2">
          {Array.from({ length: 25 }, (_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: [0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24,7,12,17].includes(i) ? 'var(--color-text-muted)' : 'transparent' }}
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-center mb-3 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        Scan to Download App<br />iOS &amp; Android
      </p>
      <button
        className="w-full py-2 rounded-lg text-xs font-semibold"
        style={{ backgroundColor: 'var(--color-primary)', color: '#222017' }}
      >
        Download
      </button>
    </div>
  )
}

// ─── SearchModal sub-component ───────────────────────────────────────────────

const DEMO_PAIRS = [
  { base: 'BTC',  quote: 'USDT', name: 'Bitcoin',   price: '$43,234', change: '-1.07', up: false, color: '#f7931a' },
  { base: 'ETH',  quote: 'USDT', name: 'Ethereum',  price: '$2,123',  change: '+5.67', up: true,  color: '#627eea' },
  { base: 'BNB',  quote: 'USDT', name: 'BNB',       price: '$318',    change: '-2.43', up: false, color: '#f0b90b' },
  { base: 'SOL',  quote: 'USDT', name: 'Solana',    price: '$96.59',  change: '+3.45', up: true,  color: '#9945ff' },
  { base: 'ADA',  quote: 'USDT', name: 'Cardano',   price: '$0.52',   change: '+1.23', up: true,  color: '#0033ad' },
  { base: 'DOGE', quote: 'USDT', name: 'Dogecoin',  price: '$0.082',  change: '-8.23', up: false, color: '#c2a633' },
  { base: 'XRP',  quote: 'USDT', name: 'Ripple',    price: '$0.594',  change: '-3.21', up: false, color: '#00aae4' },
  { base: 'MATIC',quote: 'USDT', name: 'Polygon',   price: '$0.89',   change: '+12.7', up: true,  color: '#8247e5' },
]

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
              placeholder="Search pairs..."
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

  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [openDropdown,  setOpenDropdown]  = useState<DropdownKey | null>(null)
  const [mobileExpanded,setMobileExpanded]= useState<DropdownKey | null>(null)
  const [searchOpen,    setSearchOpen]    = useState(false)

  const navRef    = useRef<HTMLDivElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close all menus on outside click
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

  // Cleanup hover timer on unmount
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

  // Filter P2P from trade if feature is disabled for this instance
  const tradeItems = hasP2P ? TRADE_ITEMS : TRADE_ITEMS.filter((i) => i.label !== 'P2P')

  return (
    <>
      <header
        ref={navRef}
        className="sticky top-0 z-50"
        style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">

          {/* ── Logo ── */}
          <a href="/" className="flex items-center shrink-0 no-underline">
            <img
              src="/images/logo_light111.svg"
              alt="Arab Global Crypto Exchange"
              className="h-8 w-auto"
              style={{ objectFit: 'contain' }}
            />
          </a>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-1">

            {/* Trade */}
            <div
              className="relative"
              onMouseEnter={() => openHover('trade')}
              onMouseLeave={closeHover}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm transition-colors hover:text-[var(--color-text)]"
                style={{ color: 'var(--color-text-muted)' }}
                onClick={() => toggleDesktopDropdown('trade')}
              >
                Trade
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${openDropdown === 'trade' ? 'rotate-180' : ''}`}
                />
              </button>
              <DropdownMenu
                items={tradeItems}
                isOpen={openDropdown === 'trade'}
                onEnter={() => openHover('trade')}
                onLeave={closeHover}
              />
            </div>

            {/* Futures */}
            <div
              className="relative"
              onMouseEnter={() => openHover('futures')}
              onMouseLeave={closeHover}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm transition-colors hover:text-[var(--color-text)]"
                style={{ color: 'var(--color-text-muted)' }}
                onClick={() => toggleDesktopDropdown('futures')}
              >
                Futures
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${openDropdown === 'futures' ? 'rotate-180' : ''}`}
                />
              </button>
              <DropdownMenu
                items={FUTURES_ITEMS}
                isOpen={openDropdown === 'futures'}
                onEnter={() => openHover('futures')}
                onLeave={closeHover}
              />
            </div>

            {/* Earn */}
            <div
              className="relative"
              onMouseEnter={() => openHover('earn')}
              onMouseLeave={closeHover}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm transition-colors hover:text-[var(--color-text)]"
                style={{ color: 'var(--color-text-muted)' }}
                onClick={() => toggleDesktopDropdown('earn')}
              >
                Earn
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${openDropdown === 'earn' ? 'rotate-180' : ''}`}
                />
              </button>
              <DropdownMenu
                items={EARN_ITEMS}
                isOpen={openDropdown === 'earn'}
                onEnter={() => openHover('earn')}
                onLeave={closeHover}
              />
            </div>

            {/* Feature-gated: Launchpad */}
            {hasLaunchpad && (
              <a
                href="#"
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm transition-colors hover:text-[var(--color-text)] no-underline"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Launchpad
                <span style={{ color: '#f3bb2c' }}>🚀</span>
              </a>
            )}

            <a
              href="#"
              className="px-3 py-2 rounded-md text-sm transition-colors hover:text-[var(--color-text)] no-underline"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Market
            </a>

            <a
              href="#"
              className="px-3 py-2 rounded-md text-sm transition-colors hover:text-[var(--color-text)] no-underline"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Blogs &amp; News
            </a>
          </nav>

          {/* ── Desktop right actions ── */}
          <div className="hidden lg:flex items-center gap-2">

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--color-surface-2)]"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Search pairs"
            >
              <Search size={16} />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--color-surface-2)]"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Download app */}
            <div
              className="relative"
              onMouseEnter={() => openHover('download')}
              onMouseLeave={closeHover}
            >
              <button
                className="p-2 rounded-lg transition-colors hover:bg-[var(--color-surface-2)]"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label="Download app"
                onClick={() => toggleDesktopDropdown('download')}
              >
                <Smartphone size={16} />
              </button>
              <DownloadDropdown
                isOpen={openDropdown === 'download'}
                onEnter={() => openHover('download')}
                onLeave={closeHover}
              />
            </div>

            {/* Divider */}
            <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--color-border)' }} />

            {/* Auth */}
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-text-muted)' }}
            >
              Log In
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)', color: '#222017' }}
            >
              Register
            </button>
          </div>

          {/* ── Mobile actions ── */}
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

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <nav
            className="lg:hidden border-t"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-0.5">

              {/* Trade accordion */}
              <div>
                <button
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
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
                      <a
                        key={label}
                        href={href}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm no-underline"
                        style={{ color: 'var(--color-text-subtle)' }}
                      >
                        <Icon size={13} /> {label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Futures accordion */}
              <div>
                <button
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
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
                      <a
                        key={label}
                        href={href}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm no-underline"
                        style={{ color: 'var(--color-text-subtle)' }}
                      >
                        <Icon size={13} /> {label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Earn accordion */}
              <div>
                <button
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                  onClick={() => toggleMobileExpanded('earn')}
                >
                  Earn
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${mobileExpanded === 'earn' ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileExpanded === 'earn' && (
                  <div className="ml-3 mt-0.5 mb-1.5 flex flex-col gap-0.5">
                    {EARN_ITEMS.map(({ icon: Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm no-underline"
                        style={{ color: 'var(--color-text-subtle)' }}
                      >
                        <Icon size={13} /> {label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {hasLaunchpad && (
                <a
                  href="#"
                  className="px-3 py-2.5 rounded-md text-sm no-underline"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Launchpad 🚀
                </a>
              )}

              <a href="#" className="px-3 py-2.5 rounded-md text-sm no-underline" style={{ color: 'var(--color-text-muted)' }}>
                Market
              </a>
              <a href="#" className="px-3 py-2.5 rounded-md text-sm no-underline" style={{ color: 'var(--color-text-muted)' }}>
                Blogs &amp; News
              </a>

              {/* Mobile auth */}
              <div className="mt-3 flex flex-col gap-2 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button
                  className="py-2.5 rounded-lg text-sm font-medium border"
                  style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-text-muted)' }}
                >
                  Log In
                </button>
                <button
                  className="py-2.5 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#222017' }}
                >
                  Register
                </button>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Search modal — portal-style overlay */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  )
}
