import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldAlert, BookOpen, Percent, Wallet } from 'lucide-react'

/**
 * Loan management is intentionally a themed placeholder — margin trading
 * requires Binance signed endpoints (/sapi/v1/margin/*) which can't run in
 * the browser without a backend proxy.
 */
export function WalletLoansPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/wallet/overview" className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <ArrowLeft size={16} />
          Back to assets
        </Link>
        <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
          Paper
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Loan Management</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Borrow against crypto collateral to trade with leverage.
        </p>
      </div>

      {/* Hero */}
      <div className="rounded-xl border border-[var(--color-border)] p-6 md:p-8" style={{ background: 'linear-gradient(135deg, var(--color-surface), var(--color-surface-2))' }}>
        <div className="flex items-start gap-3">
          <ShieldAlert size={24} style={{ color: 'var(--color-primary)' }} />
          <div>
            <p className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Loans require a live backend</p>
            <p className="text-sm mt-2 max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
              Creating, managing, and repaying loans hits Binance's authenticated margin endpoints
              (<code>/sapi/v1/margin/loan</code>, <code>/sapi/v1/margin/account</code>). These require an
              API key + HMAC secret that must stay behind a server — we don't simulate them in paper mode
              because loan mechanics (interest accrual, liquidation, tiered LTVs) are too easy to get
              subtly wrong.
            </p>
            <p className="text-sm mt-3" style={{ color: 'var(--color-text-muted)' }}>
              Once a backend proxy is in place, this page will show open loans, collateral ratios,
              interest rates, and a borrow/repay flow that mirrors the spot trade page.
            </p>
          </div>
        </div>
      </div>

      {/* What you'd see */}
      <div>
        <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-text)' }}>What this page will show</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<Wallet size={18} />}
            title="Open Loans"
            body="Asset borrowed, collateral posted, outstanding principal + interest, liquidation price."
          />
          <FeatureCard
            icon={<Percent size={18} />}
            title="Interest Rates"
            body="Hourly rate per borrowable asset from /sapi/v1/margin/interestRateHistory."
          />
          <FeatureCard
            icon={<BookOpen size={18} />}
            title="Borrow / Repay"
            body="Signed POST /sapi/v1/margin/loan + /sapi/v1/margin/repay flows with LTV safeguards."
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          to="/wallet/overview"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        >
          Back to Assets
        </Link>
        <Link
          to="/trade/BTC_USDT"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          Trade Spot instead
        </Link>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl p-5 border border-[var(--color-border)]" style={{ background: 'var(--color-surface)' }}>
      <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--color-primary)' }}>
        {icon}
        <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{title}</span>
      </div>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{body}</p>
    </div>
  )
}
