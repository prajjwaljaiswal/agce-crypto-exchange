import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Copy,
  ChevronRight,
  Pencil,
  CircleMinus,
  ArrowUpFromDot,
  TrendingUp,
} from 'lucide-react'
import type { MarketRow } from './types/index.js'
import { MARKET_ROWS, ANNOUNCEMENTS, MARKET_TABS } from './data/index.js'

// ─── User Profile Header ─────────────────────────────────────────────────────

function UserProfileHeader() {
  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text)
  }

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        {/* Avatar + Name + Badges */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), #a88040)',
                color: '#0d0d0d',
              }}
            >
              A
            </div>
            <button
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                border: '2px solid var(--color-surface)',
              }}
            >
              <Pencil size={10} style={{ color: 'var(--color-text-muted)' }} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                AGCEUser-0c52...
              </span>
              <Pencil size={14} style={{ color: 'var(--color-text-muted)' }} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{ backgroundColor: 'var(--color-primary)', color: '#0d0d0d' }}
              >
                VIP0
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Unverified
              </span>
              <span className="flex items-center gap-1 text-xs">
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: 'var(--color-red)' }}
                />
                <span style={{ color: 'var(--color-red)' }}>Low</span>
              </span>
            </div>
          </div>
        </div>

        {/* Info columns */}
        <div className="flex flex-wrap items-start gap-x-10 gap-y-3">
          <InfoColumn label="UID" value="51600983" copyable onCopy={copyToClipboard} />
          <InfoColumn label="Fees" value="Detail" hasArrow linkTo="/fees" />
          <InfoColumn label="Phone Number" value="--" />
          <InfoColumn label="Email (Username)" value="j***9@gmail.com" />
          <InfoColumn label="Third Party Login" value="Manage" hasArrow linkTo="/user_profile/profile_setting" />
        </div>
      </div>
    </div>
  )
}

function InfoColumn({
  label,
  value,
  copyable,
  onCopy,
  hasArrow,
  linkTo,
}: {
  label: string
  value: string
  copyable?: boolean
  onCopy?: (text: string) => void
  hasArrow?: boolean
  linkTo?: string
}) {
  const valueContent = (
    <div className="flex items-center gap-1.5 mt-1">
      <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
        {value}
      </span>
      {copyable && (
        <button onClick={() => onCopy?.(value)} className="transition-opacity hover:opacity-70">
          <Copy size={13} style={{ color: 'var(--color-text-muted)' }} />
        </button>
      )}
      {hasArrow && <ChevronRight size={13} style={{ color: 'var(--color-text-muted)' }} />}
    </div>
  )

  return (
    <div>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </p>
      {linkTo ? <Link to={linkTo} className="no-underline">{valueContent}</Link> : valueContent}
    </div>
  )
}

// ─── Newcomer Perks ──────────────────────────────────────────────────────────

function NewcomerPerks() {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
      }}
    >
      <h2 className="text-xl font-bold mb-5" style={{ color: '#111' }}>
        Newcomer Perks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Step 1 — active, gold border */}
        <div
          className="rounded-xl p-5 relative overflow-hidden"
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid var(--color-primary)',
          }}
        >
          <p className="text-xs mb-2" style={{ color: '#999' }}>
            Step 1
          </p>
          <p className="text-sm font-bold leading-snug mb-3" style={{ color: '#111' }}>
            Verify identity and claim{' '}
            <span style={{ color: 'var(--color-primary)' }}>15 USDT</span> in...
          </p>
          <div className="flex items-center gap-1 mb-4">
            <CountdownUnit value="13D" />
            <span className="text-sm font-bold" style={{ color: '#333' }}>:</span>
            <CountdownUnit value="10" />
            <span className="text-sm font-bold" style={{ color: '#333' }}>:</span>
            <CountdownUnit value="12" />
            <span className="text-sm font-bold" style={{ color: '#333' }}>:</span>
            <CountdownUnit value="23" />
          </div>
          <Link
            to="/user_profile/kyc"
            className="inline-block text-xs font-semibold px-5 py-2 rounded-full no-underline"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
          >
            Verify Now
          </Link>
          {/* Illustration placeholder */}
          <img
            src="/images/newcomer_step1.png"
            alt=""
            className="absolute right-2 top-4 w-28 h-28 object-contain pointer-events-none opacity-90"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>

        {/* Step 2 */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb',
          }}
        >
          <p className="text-xs mb-2" style={{ color: '#999' }}>
            Step 2
          </p>
          <p className="text-base font-bold mb-2" style={{ color: '#111' }}>
            First Deposit
          </p>
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#6b7280' }}
            >
              <span className="text-[8px] font-bold text-white">$</span>
            </span>
            <span className="text-xs" style={{ color: '#666' }}>
              20 USDT Credits Claimable
            </span>
          </div>
        </div>

        {/* Step 3 */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb',
          }}
        >
          <p className="text-xs mb-2" style={{ color: '#999' }}>
            Step 3
          </p>
          <p className="text-base font-bold" style={{ color: '#111' }}>
            Transaction
          </p>
        </div>
      </div>
    </div>
  )
}

function CountdownUnit({ value }: { value: string }) {
  return (
    <span
      className="text-xs font-bold px-2 py-1 rounded"
      style={{
        backgroundColor: '#f3f4f6',
        color: '#111',
        border: '1px solid #e5e7eb',
      }}
    >
      {value}
    </span>
  )
}

// ─── Markets Section ─────────────────────────────────────────────────────────

function MarketsSection() {
  const [activeTab, setActiveTab] = useState('hot')

  return (
    <div
      className="rounded-xl"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-0">
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
          Markets
        </h2>
        <Link to="/market">
          <ChevronRight size={20} style={{ color: 'var(--color-text-muted)' }} />
        </Link>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-0 px-6 mt-3"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        {MARKET_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-3 py-2.5 text-sm font-medium whitespace-nowrap relative transition-colors"
            style={{
              color: activeTab === tab.key ? 'var(--color-text)' : 'var(--color-text-muted)',
              borderBottom:
                activeTab === tab.key ? '2px solid var(--color-text)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th
                className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Coin
              </th>
              <th
                className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Price
              </th>
              <th
                className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell"
                style={{ color: 'var(--color-text-muted)' }}
              >
                24H Trading Volume
              </th>
              <th
                className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                24H Change
              </th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {/* Repeat data to fill the table as shown in the design */}
            {[...MARKET_ROWS, ...MARKET_ROWS, ...MARKET_ROWS].map((row, idx) => (
              <MarketTableRow key={`${row.symbol}-${idx}`} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MarketTableRow({ row }: { row: MarketRow }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
      <td className="py-3.5 px-6">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shrink-0"
            style={{ backgroundColor: 'var(--color-surface-3)' }}
          >
            <img
              src={row.icon}
              alt={row.symbol}
              className="w-7 h-7 object-contain"
              onError={(e) => {
                const t = e.currentTarget
                t.style.display = 'none'
                if (t.parentElement) {
                  t.parentElement.textContent = row.symbol[0]
                  t.parentElement.style.fontSize = '11px'
                  t.parentElement.style.fontWeight = '700'
                  t.parentElement.style.color = 'var(--color-primary)'
                }
              }}
            />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            {row.symbol}
          </span>
        </div>
      </td>
      <td className="py-3.5 px-4 text-sm" style={{ color: 'var(--color-text)' }}>
        {row.price}
      </td>
      <td
        className="py-3.5 px-4 text-sm hidden md:table-cell"
        style={{ color: 'var(--color-text)' }}
      >
        {row.volume24h}
      </td>
      <td className="py-3.5 px-4">
        <span
          className="text-sm font-medium"
          style={{ color: row.positive ? 'var(--color-green)' : 'var(--color-red)' }}
        >
          {row.change24h}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <Link
          to="/market"
          className="text-sm no-underline"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Trade
        </Link>
      </td>
    </tr>
  )
}

// ─── Right Sidebar Cards ─────────────────────────────────────────────────────

function VIPServicesCard() {
  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
    >
      <h3 className="text-xl font-bold mb-5" style={{ color: '#111' }}>
        AGCE VIP Services
      </h3>
      <div className="flex flex-col gap-4 mb-6">
        <VIPBullet
          icon={<CircleMinus size={18} style={{ color: 'var(--color-primary)' }} />}
          text="Up to 75% trading fee discounts"
        />
        <VIPBullet
          icon={<ArrowUpFromDot size={18} style={{ color: 'var(--color-primary)' }} />}
          text="Exclusive benefits and gifts"
        />
        <VIPBullet
          icon={<TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />}
          text="Exclusive high-yield products"
        />
      </div>
      <Link
        to="/coming-soon"
        className="block text-center text-sm font-medium py-3 rounded-lg no-underline transition-colors"
        style={{
          border: '1px solid #d1d5db',
          color: '#333',
          backgroundColor: '#ffffff',
        }}
      >
        How to Apply
      </Link>
    </div>
  )
}

function VIPBullet({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium" style={{ color: '#222' }}>
        {text}
      </span>
    </div>
  )
}

function AnnouncementsCard() {
  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold" style={{ color: '#111' }}>
          Announcements
        </h3>
        <Link to="/announcement">
          <ChevronRight size={20} style={{ color: '#999' }} />
        </Link>
      </div>
      <div className="flex flex-col gap-0">
        {ANNOUNCEMENTS.map((item, idx) => (
          <div
            key={idx}
            className={idx > 0 ? 'pt-4 mt-4' : ''}
            style={idx > 0 ? { borderTop: '1px solid #e5e7eb' } : undefined}
          >
            <p className="text-xs mb-2" style={{ color: '#999' }}>
              {item.timeAgo}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#333' }}>
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function DownloadAppCard() {
  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold" style={{ color: '#111' }}>
          Download AGCE App
        </h3>
        <ChevronRight size={18} style={{ color: '#999' }} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: '#111' }}>
            AGCE
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#999' }}>
            Scan to download
          </p>
        </div>
        <div
          className="w-14 h-14 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}
        >
          <span className="text-xs" style={{ color: '#999' }}>QR</span>
        </div>
      </div>
    </div>
  )
}

function ReferralCard() {
  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text)
  }

  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold" style={{ color: '#111' }}>
          Referral Commission
        </h3>
        <Link to="/refer_earn">
          <ChevronRight size={18} style={{ color: '#999' }} />
        </Link>
      </div>
      <p className="text-sm mb-4" style={{ color: '#333' }}>
        Earn <span style={{ color: 'var(--color-primary)' }}>40%</span> commission or up to 500 USDT rewards!
      </p>
      <div
        className="flex items-center justify-between rounded-lg px-3 py-2.5"
        style={{ backgroundColor: '#f9fafb', border: '1px dashed #d1d5db' }}
      >
        <div>
          <p className="text-xs" style={{ color: '#999' }}>
            Referralcode
          </p>
          <p className="text-sm font-semibold tracking-wide" style={{ color: '#111' }}>
            VFBHUAXABW
          </p>
        </div>
        <button
          onClick={() => copyToClipboard('VFBHUAXABW')}
          className="transition-opacity hover:opacity-70"
        >
          <Copy size={14} style={{ color: '#999' }} />
        </button>
      </div>
    </div>
  )
}

function TwoFactorCard() {
  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold" style={{ color: '#111' }}>
          2.factor authentication
        </h3>
        <Link to="/user_profile/two_factor_autentication">
          <ChevronRight size={18} style={{ color: '#999' }} />
        </Link>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
        Enable 2-Factor Authentication to add an extra security layer and prevent unauthorized access to your account.
      </p>
    </div>
  )
}


// ─── DashboardPage ───────────────────────────────────────────────────────────

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* <SearchBar /> */}
      <UserProfileHeader />

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left Column */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <NewcomerPerks />
          <MarketsSection />
        </div>

        {/* Right Column */}
        <div className="lg:w-[340px] shrink-0 flex flex-col gap-5">
          <VIPServicesCard />
          <AnnouncementsCard />
          <DownloadAppCard />
          <ReferralCard />
          <TwoFactorCard />
        </div>
      </div>
    </div>
  )
}
