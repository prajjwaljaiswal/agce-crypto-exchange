import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useInstanceConfig } from '@agce/hooks'
import { ButtonLink } from '@agce/ui'

const navLinks = [
  { to: '/features', label: 'Features' },
  { to: '/fees', label: 'Fees' },
  { to: '/security', label: 'Security' },
  { to: '/compliance', label: 'Compliance' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const config = useInstanceConfig()
  const [open, setOpen] = useState(false)
  const exchangeUrl = `https://${config.domain}`

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            AG
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
            {config.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'text-[var(--color-text)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`${exchangeUrl}/login`}
            className="text-sm px-3 py-2 rounded-md transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Log in
          </a>
          <ButtonLink size="sm" href={`${exchangeUrl}/register`}>
            Get started
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md"
          style={{ color: 'var(--color-text-muted)' }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="md:hidden border-t px-4 pb-4 pt-2 flex flex-col gap-1"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [
                  'px-3 py-2.5 rounded-md text-sm',
                  isActive ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <a href={`${exchangeUrl}/login`} className="text-sm px-3 py-2.5 rounded-md text-center" style={{ color: 'var(--color-text-muted)' }}>
              Log in
            </a>
            <ButtonLink size="sm" href={`${exchangeUrl}/register`}>
              Get started
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  )
}
