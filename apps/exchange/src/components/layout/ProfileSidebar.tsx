import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  Users,
  KeyRound,
  Ticket,
  Gift,
  Settings,
  ChevronLeft,
  Menu,
  ChevronDown,
} from 'lucide-react'

interface SidebarLink {
  label: string
  Icon: LucideIcon
  href: string
}

const SIDEBAR_LINKS: SidebarLink[] = [
  { label: 'Overview', Icon: LayoutDashboard, href: '/user_profile/dashboard' },
  { label: 'Security', Icon: ShieldCheck, href: '/user_profile/two_factor_autentication' },
  { label: 'Identification', Icon: UserCheck, href: '/user_profile/kyc' },
  { label: 'Subaccounts', Icon: Users, href: '/user_profile/profile_setting' },
  { label: 'API Key Management', Icon: KeyRound, href: '/coming-soon' },
  { label: 'Vouchers', Icon: Gift, href: '/coming-soon' },
  { label: 'My Tickets', Icon: Ticket, href: '/user_profile/support' },
  { label: 'Settings', Icon: Settings, href: '/user_profile/profile_setting' },
]

export function ProfileSidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => location.pathname === href

  const currentPageLabel = SIDEBAR_LINKS.find((l) => isActive(l.href))?.label ?? 'Overview'

  const iconSize = collapsed ? 24 : 18

  const sidebar = (
    <nav className="flex flex-col gap-0.5 py-3">
      {SIDEBAR_LINKS.map((link) => (
        <Link
          key={link.label}
          to={link.href}
          className={`flex items-center gap-3 py-2.5 text-sm no-underline transition-colors ${
            isActive(link.href) ? 'font-medium' : ''
          } ${collapsed ? 'justify-center px-0' : 'px-4'}`}
          style={{
            color: isActive(link.href) ? 'var(--color-primary)' : 'var(--color-text-muted)',
            backgroundColor: isActive(link.href) ? 'rgba(209,170,103,0.08)' : 'transparent',
            borderRadius: '8px',
            margin: '0 8px',
          }}
          title={collapsed ? link.label : undefined}
        >
          <link.Icon size={iconSize} />
          {!collapsed && link.label}
        </Link>
      ))}
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        className="lg:hidden flex items-center gap-2 mb-4 px-4 py-2 rounded-lg text-sm"
        style={{ color: 'var(--color-text)', backgroundColor: 'var(--color-surface-2)' }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu size={18} />
        {currentPageLabel}
        <ChevronDown size={14} className={`ml-auto transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Desktop sidebar + divider */}
      <div className="hidden lg:flex shrink-0">
        <aside
          className="transition-all duration-200"
          style={{ width: collapsed ? '64px' : '200px' }}
        >
          {sidebar}
        </aside>
        {/* Vertical divider + collapse button */}
        <div className="relative flex items-start">
          <div
            className="w-px self-stretch"
            style={{ backgroundColor: 'var(--color-border)' }}
          />
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="absolute top-4 -translate-x-1/2 left-0 w-6 h-6 rounded-full flex items-center justify-center z-10"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
            }}
          >
            <ChevronLeft
              size={14}
              style={{
                color: 'var(--color-text-muted)',
                transform: collapsed ? 'rotate(180deg)' : 'none',
                transition: 'transform 200ms',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <aside
          className="lg:hidden rounded-2xl mb-4"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          {sidebar}
        </aside>
      )}
    </>
  )
}
