import { Users, Globe, BarChart2, Shield, ChevronRight } from 'lucide-react'

const stats = [
  { label: 'Registered Users', value: '500K+', icon: <Users size={24} /> },
  { label: 'Countries Supported', value: '80+', icon: <Globe size={24} /> },
  { label: '24h Trading Volume', value: '$1.2B+', icon: <BarChart2 size={24} /> },
  { label: 'Uptime', value: '99.9%', icon: <Shield size={24} /> },
]

const team = [
  { name: 'Khalid Al-Rashid', role: 'Chief Executive Officer', initials: 'KR', color: '#D1AA67' },
  { name: 'Priya Nair', role: 'Chief Technology Officer', initials: 'PN', color: '#627EEA' },
  { name: 'Omar Benali', role: 'Chief Compliance Officer', initials: 'OB', color: '#26A17B' },
  { name: 'Sofia Marchetti', role: 'Chief Marketing Officer', initials: 'SM', color: '#9945FF' },
  { name: 'Wei Zhang', role: 'Head of Trading', initials: 'WZ', color: '#F7931A' },
  { name: 'Aisha Al-Farsi', role: 'Head of Product', initials: 'AF', color: '#FF6B6B' },
]

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero */}
      <div
        className="relative overflow-hidden py-20 px-6"
        style={{
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1000 50%, #0d0d0d 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm mb-4">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="text-[var(--color-primary)]">About</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 max-w-[600px]">
            About{' '}
            <span className="text-[var(--color-primary)]">Arab Global Crypto Exchange</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-[620px]">
            AGCE is a regulated, multi-jurisdictional cryptocurrency exchange designed for investors across the Arab world and beyond. We bridge traditional finance and blockchain through a platform that is secure, transparent, and built for the future.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-14 space-y-16">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex flex-col items-center text-center gap-3"
            >
              <span className="text-[var(--color-primary)]">{stat.icon}</span>
              <p className="text-3xl font-bold text-[var(--color-text)]">{stat.value}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3 block">
              Our Mission
            </span>
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
              Democratising Crypto for the Arab World
            </h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
              AGCE was founded with a singular mission: to give every individual and institution in the Arab world and beyond access to the global crypto economy — safely, legally, and simply. We believe financial freedom should not depend on where you were born or how much capital you start with.
            </p>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Our platform is engineered to meet the highest standards of regulatory compliance across multiple jurisdictions while delivering the speed, depth, and product diversity demanded by professional traders.
            </p>
          </div>
          <div
            className="h-64 rounded-2xl flex items-center justify-center text-6xl"
            style={{
              background: 'linear-gradient(135deg, #D1AA6715, #D1AA6705)',
              border: '1px solid var(--color-border)',
            }}
          >
            🌍
          </div>
        </div>

        {/* Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div
            className="h-64 rounded-2xl flex items-center justify-center text-6xl order-2 lg:order-1"
            style={{
              background: 'linear-gradient(135deg, #627EEA15, #627EEA05)',
              border: '1px solid var(--color-border)',
            }}
          >
            🔭
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3 block">
              Our Vision
            </span>
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
              The Most Trusted Exchange in the MENA Region
            </h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
              By 2030, AGCE aims to be the most trusted and widely used digital asset exchange across the Middle East and North Africa, serving retail investors, institutional clients, and governments alike.
            </p>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              We are investing heavily in regulatory partnerships, institutional-grade infrastructure, and educational programmes to accelerate adoption of blockchain technology in the region.
            </p>
          </div>
        </div>

        {/* Team */}
        <div>
          <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3 block">
            Our Team
          </span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-8">
            Leadership Team
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col items-center text-center gap-3"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-black"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initials}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text)] text-sm">{member.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3 block">
            Our Values
          </span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-8">What Drives Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'Transparency', desc: 'We publish proof-of-reserves audits, fee schedules, and regulatory licences openly. Our users deserve to know exactly how their assets are held and protected.', icon: '🔍' },
              { title: 'Security', desc: 'Cold storage, multi-signature protocols, and SOC 2-compliant infrastructure ensure your assets are protected against both external attacks and internal misuse.', icon: '🛡️' },
              { title: 'Innovation', desc: "From AI-powered analytics to cross-chain swap infrastructure, AGCE is constantly evolving to give our users tomorrow's tools today.", icon: '⚡' },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <span className="text-3xl mb-4 block">{v.icon}</span>
                <h3 className="font-bold text-[var(--color-text)] mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
