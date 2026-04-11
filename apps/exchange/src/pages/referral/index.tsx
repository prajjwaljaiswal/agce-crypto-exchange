import { useState } from 'react'
import { Copy, Check, Users, DollarSign, Gift, ChevronRight } from 'lucide-react'

const referralList = [
  { user: 'j***@gmail.com', date: '2025-03-10', status: 'Active', commission: '$12.50' },
  { user: 'm***@hotmail.com', date: '2025-03-15', status: 'Active', commission: '$8.20' },
  { user: 'a***@yahoo.com', date: '2025-03-22', status: 'Pending', commission: '$0.00' },
  { user: 's***@gmail.com', date: '2025-04-01', status: 'Active', commission: '$21.00' },
  { user: 'k***@outlook.com', date: '2025-04-05', status: 'Inactive', commission: '$3.40' },
]

export function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const referralLink = 'https://agce.com/ref/USER12345'

  function handleCopy() {
    void navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stats = [
    { label: 'Total Referrals', value: '5', icon: <Users size={22} /> },
    { label: 'Total Earnings', value: '$45.10', icon: <DollarSign size={22} /> },
    { label: 'Pending Rewards', value: '$8.20', icon: <Gift size={22} /> },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1000 0%, #0d0d0d 60%, #120d00 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-16">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm mb-4">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="text-[var(--color-primary)]">Referral</span>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">
                Invite Friends &amp; Earn{' '}
                <span className="text-[var(--color-primary)]">Crypto Rewards</span>
              </h1>
              <p className="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-[500px]">
                Share your referral link and earn up to <span className="text-[var(--color-primary)] font-semibold">30% commission</span> on every trade your friends make.
              </p>
            </div>
            {/* Illustration placeholder */}
            <div
              className="w-52 h-52 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'radial-gradient(circle, #D1AA6720 0%, #D1AA6705 70%)' }}
            >
              <Users size={80} className="text-[var(--color-primary)] opacity-60" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-10">
        {/* Referral link */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-4">Your Referral Link</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text-muted)] font-mono truncate">
              {referralLink}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-[var(--color-primary)] text-black font-semibold px-5 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex items-center gap-4"
            >
              <span className="text-[var(--color-primary)]">{s.icon}</span>
              <div>
                <p className="text-[var(--color-text-muted)] text-sm">{s.label}</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Referral list */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Referral List</h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">User</th>
                  <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">Date Joined</th>
                  <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">Status</th>
                  <th className="text-left px-5 py-3.5 text-[var(--color-text-muted)] font-medium">Commission</th>
                </tr>
              </thead>
              <tbody>
                {referralList.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors"
                  >
                    <td className="px-5 py-4 text-[var(--color-text)]">{row.user}</td>
                    <td className="px-5 py-4 text-[var(--color-text-muted)]">{row.date}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          row.status === 'Active'
                            ? 'bg-green-400/10 text-green-400'
                            : row.status === 'Pending'
                            ? 'bg-yellow-400/10 text-yellow-400'
                            : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[var(--color-primary)] font-semibold">{row.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
