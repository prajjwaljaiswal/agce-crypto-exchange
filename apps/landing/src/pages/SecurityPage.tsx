import { ShieldCheck, Lock, Eye, Server, Key, AlertTriangle } from 'lucide-react'
import { SectionHeader } from '../components/shared/SectionHeader.js'

const items = [
  {
    icon: Lock,
    title: '2FA — TOTP + SMS OTP',
    description: 'Two-factor authentication is mandatory for withdrawals. Supports Google Authenticator and SMS OTP.',
  },
  {
    icon: ShieldCheck,
    title: 'Withdrawal whitelist',
    description: 'Addresses require whitelisting with a 24-hour waiting period before first use.',
  },
  {
    icon: Eye,
    title: 'Chainalysis KYT',
    description: 'Every deposit and withdrawal is screened in real-time. OFAC, UN, and EU consolidated sanctions lists enforced.',
  },
  {
    icon: Server,
    title: 'AES-256 + TLS 1.3',
    description: 'All data encrypted at rest with AES-256. All traffic encrypted in transit with TLS 1.3.',
  },
  {
    icon: AlertTriangle,
    title: 'DDoS protection',
    description: 'Cloudflare Enterprise with rate limiting at CDN and application layer. VPN/proxy detection at login and registration.',
  },
  {
    icon: Key,
    title: 'Penetration testing',
    description: 'Mandatory third-party VAPT before go-live and annually thereafter. Responsible disclosure bug bounty at launch.',
  },
]

export function SecurityPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Security"
        title="Secured at every layer"
        description="From custody to network edge, every component is hardened to institutional standards."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border p-5"
            style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
          >
            <div
              className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'var(--color-surface-3)' }}
            >
              <Icon size={18} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 className="mb-1.5 font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{description}</p>
          </div>
        ))}
      </div>

      {/* Fireblocks detail */}
      <div
        className="mt-12 rounded-2xl border p-8"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <h2 className="mb-4 text-xl font-bold" style={{ color: 'var(--color-text)' }}>Fireblocks Custody</h2>
        <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          Each exchange instance operates under a separate Fireblocks workspace. Funds are fully segregated across jurisdictions — AGCE India balances cannot be accessed via AGCE Dubai admin controls.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {[
            'Hot/cold wallet rebalancing (max 5% in hot)',
            'Multi-signature for large withdrawals',
            'Automated deposit detection',
            'Fireblocks policy engine approval workflow',
            'Webhook-based real-time tx status',
            '10+ supported chains',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
