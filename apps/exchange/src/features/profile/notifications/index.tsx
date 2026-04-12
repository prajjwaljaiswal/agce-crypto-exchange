import { Bell, CheckCheck, ArrowUpFromLine, ArrowDownToLine, Shield, Gift, AlertTriangle, TrendingUp } from 'lucide-react'

interface Notification {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  timestamp: string
  read: boolean
  category: 'security' | 'transaction' | 'promo' | 'market'
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    icon: <ArrowDownToLine size={16} />,
    title: 'Deposit Confirmed',
    description: '0.05 BTC has been credited to your Spot wallet.',
    timestamp: '2 minutes ago',
    read: false,
    category: 'transaction',
  },
  {
    id: '2',
    icon: <Shield size={16} />,
    title: 'New Login Detected',
    description: 'A new login to your account was detected from Chrome on Windows.',
    timestamp: '1 hour ago',
    read: false,
    category: 'security',
  },
  {
    id: '3',
    icon: <ArrowUpFromLine size={16} />,
    title: 'Withdrawal Processed',
    description: '500 USDT withdrawal has been submitted and is awaiting network confirmation.',
    timestamp: '3 hours ago',
    read: false,
    category: 'transaction',
  },
  {
    id: '4',
    icon: <TrendingUp size={16} />,
    title: 'Price Alert Triggered',
    description: 'BTC/USDT crossed your alert threshold of $65,000.',
    timestamp: '5 hours ago',
    read: true,
    category: 'market',
  },
  {
    id: '5',
    icon: <Gift size={16} />,
    title: 'Bonus Credited',
    description: 'Your referral bonus of 10 USDT has been credited to your account.',
    timestamp: 'Yesterday',
    read: true,
    category: 'promo',
  },
  {
    id: '6',
    icon: <AlertTriangle size={16} />,
    title: 'KYC Reminder',
    description: 'Complete your identity verification to unlock unlimited withdrawals.',
    timestamp: '2 days ago',
    read: true,
    category: 'security',
  },
  {
    id: '7',
    icon: <Gift size={16} />,
    title: 'Earn Up to 12% APY',
    description: 'New flexible staking products are available. Start earning today.',
    timestamp: '3 days ago',
    read: true,
    category: 'promo',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  security: '#dc262622',
  transaction: '#16a34a22',
  promo: '#d1aa6722',
  market: '#3b82f622',
}

const CATEGORY_ICON_COLORS: Record<string, string> = {
  security: 'var(--color-red)',
  transaction: 'var(--color-green)',
  promo: 'var(--color-primary)',
  market: '#3b82f6',
}

export function NotificationPage() {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Notifications</h1>
          {unreadCount > 0 && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            >
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <CheckCheck size={16} />
          Mark All Read
        </button>
      </div>

      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {MOCK_NOTIFICATIONS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Bell size={40} className="text-[var(--color-text-muted)]" />
            <p className="text-sm text-[var(--color-text-muted)]">No notifications yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-border)]">
            {MOCK_NOTIFICATIONS.map((n) => (
              <li
                key={n.id}
                className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-[var(--color-surface-2)] transition-colors"
                style={{ backgroundColor: n.read ? undefined : 'var(--color-surface-2)' }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: CATEGORY_COLORS[n.category],
                    color: CATEGORY_ICON_COLORS[n.category],
                  }}
                >
                  {n.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-[var(--color-text)]">{n.title}</p>
                    <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5 leading-relaxed">{n.description}</p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div
                    className="w-2 h-2 rounded-full shrink-0 mt-2"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
