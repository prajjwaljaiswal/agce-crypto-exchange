import { Link } from 'react-router-dom'
import { useInstanceConfig } from '@agce/hooks'

const footerLinks = {
  Platform: [
    { label: 'Features', to: '/features' },
    { label: 'Fee Schedule', to: '/fees' },
    { label: 'Security', to: '/security' },
    { label: 'API Documentation', href: '#' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Compliance', to: '/compliance' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Risk Disclosure', href: '#' },
  ],
}

export function Footer() {
  const config = useInstanceConfig()

  return (
    <footer
      className="border-t"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                AG
              </div>
              <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                {config.name}
              </span>
            </div>
            <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
              Regulated crypto exchange for retail and institutional traders.
              Operated by Arab Global Virtual Assets Services LLC SPC.
            </p>
            <p className="mt-4 text-xs" style={{ color: 'var(--color-text-subtle)' }}>
              Regulated by {config.compliance.regulator}
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {'to' in link && link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm transition-colors hover:text-[var(--color-text)]"
                        style={{ color: 'var(--color-text-subtle)' }}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={'href' in link ? link.href : '#'}
                        className="text-sm transition-colors hover:text-[var(--color-text)]"
                        style={{ color: 'var(--color-text-subtle)' }}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
            © {new Date().getFullYear()} Arab Global Virtual Assets Services LLC SPC. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
            Trading cryptocurrencies involves significant risk. Please read our Risk Disclosure.
          </p>
        </div>
      </div>
    </footer>
  )
}
