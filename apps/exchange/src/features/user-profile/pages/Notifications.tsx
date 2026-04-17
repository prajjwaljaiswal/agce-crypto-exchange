import { useMemo, useState } from 'react'

type NotificationCategory = 'deposit' | 'security' | 'kyc' | 'info'

interface NotificationItem {
  id: string
  category: NotificationCategory
  title: string
  description: string
  // ISO-8601 timestamp
  createdAt: string
  read: boolean
}

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    category: 'deposit',
    title: 'Deposit confirmed',
    description: '1000 USDT deposit credited to your Main Wallet.',
    createdAt: new Date(Date.now() - 10 * 60_000).toISOString(),
    read: false,
  },
  {
    id: '2',
    category: 'security',
    title: 'Login from new device',
    description: 'A new login was detected from Chrome on Windows.',
    createdAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
    read: false,
  },
  {
    id: '3',
    category: 'kyc',
    title: 'KYC reminder',
    description: 'Complete KYC to unlock higher withdrawal limits.',
    createdAt: new Date(Date.now() - 26 * 60 * 60_000).toISOString(),
    read: true,
  },
]

type Filter = 'all' | 'unread' | 'read'

const CATEGORY_META: Record<
  NotificationCategory,
  { icon: string; color: string; bg: string; border: string }
> = {
  deposit: {
    icon: 'ri-arrow-down-circle-line',
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.32)',
  },
  security: {
    icon: 'ri-shield-keyhole-line',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.32)',
  },
  kyc: {
    icon: 'ri-file-user-line',
    color: 'var(--color-primary, #D1AA67)',
    bg: 'color-mix(in srgb, var(--color-primary, #D1AA67) 14%, transparent)',
    border: 'color-mix(in srgb, var(--color-primary, #D1AA67) 32%, transparent)',
  },
  info: {
    icon: 'ri-notification-3-line',
    color: 'var(--color-primary, #D1AA67)',
    bg: 'color-mix(in srgb, var(--color-primary, #D1AA67) 14%, transparent)',
    border: 'color-mix(in srgb, var(--color-primary, #D1AA67) 32%, transparent)',
  },
}

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

function groupKey(iso: string): 'today' | 'yesterday' | 'earlier' {
  const now = new Date()
  const d = new Date(iso)
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  if (sameDay(now, d)) return 'today'
  const yest = new Date(now)
  yest.setDate(yest.getDate() - 1)
  if (sameDay(yest, d)) return 'yesterday'
  return 'earlier'
}

const GROUP_LABEL: Record<ReturnType<typeof groupKey>, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  earlier: 'Earlier',
}

export function Notifications() {
  const [items, setItems] = useState<NotificationItem[]>(SEED_NOTIFICATIONS)
  const [filter, setFilter] = useState<Filter>('all')

  const unreadCount = items.filter((n) => !n.read).length

  const filtered = useMemo(() => {
    if (filter === 'unread') return items.filter((n) => !n.read)
    if (filter === 'read') return items.filter((n) => n.read)
    return items
  }, [items, filter])

  const grouped = useMemo(() => {
    const g: Record<'today' | 'yesterday' | 'earlier', NotificationItem[]> = {
      today: [],
      yesterday: [],
      earlier: [],
    }
    for (const n of filtered) g[groupKey(n.createdAt)].push(n)
    return g
  }, [filtered])

  const markAsRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))

  const markAllAsRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))

  return (
    <div className="dashboard_right">
      <div className="notifications-shell">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h4 className="notifications-title">
              Notifications
              {unreadCount > 0 && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 10,
                    minWidth: 22,
                    height: 22,
                    padding: '0 8px',
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 999,
                    backgroundColor: 'var(--color-primary, #D1AA67)',
                    color: '#000',
                    verticalAlign: 'middle',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </h4>
            <p className="notifications-subtitle">
              Stay on top of deposits, security alerts, and account updates.
            </p>
          </div>

          <button
            type="button"
            className="notif-link-btn"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              padding: '6px 10px',
              cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
              opacity: unreadCount === 0 ? 0.45 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <i className="ri-check-double-line" />
            Mark all as read
          </button>
        </div>

        {/* Filter tabs */}
        <div
          role="tablist"
          aria-label="Notification filters"
          style={{
            display: 'inline-flex',
            marginTop: 16,
            padding: 4,
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {(['all', 'unread', 'read'] as const).map((key) => {
            const active = filter === key
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(key)}
                style={{
                  background: active
                    ? 'var(--color-primary, #D1AA67)'
                    : 'transparent',
                  color: active ? '#000' : 'rgba(255,255,255,0.75)',
                  border: 'none',
                  borderRadius: 7,
                  padding: '6px 14px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
              >
                {key}
                {key === 'unread' && unreadCount > 0 && ` · ${unreadCount}`}
              </button>
            )
          })}
        </div>

        {/* Lists */}
        {filtered.length === 0 ? (
          <div className="notifications-empty">
            <i
              className="ri-notification-off-line"
              style={{ fontSize: 28, display: 'block', marginBottom: 8, opacity: 0.6 }}
            />
            No notifications to show.
          </div>
        ) : (
          (['today', 'yesterday', 'earlier'] as const).map((key) => {
            const list = grouped[key]
            if (list.length === 0) return null
            return (
              <section key={key}>
                <h5 className="notifications-group-label">{GROUP_LABEL[key]}</h5>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {list.map((n) => {
                    const cat = CATEGORY_META[n.category]
                    return (
                      <li
                        key={n.id}
                        className={`notif-card ${n.read ? '' : 'notif-card-unread'}`}
                        style={{
                          position: 'relative',
                          display: 'flex',
                          gap: 14,
                          padding: '14px 16px',
                          borderRadius: 10,
                          overflow: 'hidden',
                        }}
                      >
                        {/* Unread accent stripe */}
                        {!n.read && (
                          <span
                            aria-hidden
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 3,
                              background: 'var(--color-primary, #D1AA67)',
                            }}
                          />
                        )}

                        {/* Category icon */}
                        <div
                          aria-hidden
                          style={{
                            flex: '0 0 auto',
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: cat.bg,
                            border: `1px solid ${cat.border}`,
                            color: cat.color,
                            fontSize: 18,
                          }}
                        >
                          <i className={cat.icon} />
                        </div>

                        {/* Body */}
                        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              flexWrap: 'wrap',
                            }}
                          >
                            <h6
                              className="notif-title"
                              style={{
                                margin: 0,
                                fontSize: 14,
                                fontWeight: 600,
                                lineHeight: 1.3,
                              }}
                            >
                              {n.title}
                            </h6>
                            {!n.read && (
                              <span
                                aria-label="Unread"
                                style={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: '50%',
                                  background: 'var(--color-primary, #D1AA67)',
                                }}
                              />
                            )}
                          </div>
                          <p
                            className="notif-desc"
                            style={{
                              margin: '4px 0 0',
                              fontSize: 12.5,
                              lineHeight: 1.5,
                            }}
                          >
                            {n.description}
                          </p>
                          <small
                            className="notif-time"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              marginTop: 6,
                              fontSize: 11.5,
                            }}
                          >
                            <i className="ri-time-line" />
                            {formatRelative(n.createdAt)}
                          </small>
                        </div>

                        {/* Actions */}
                        <div
                          style={{
                            flex: '0 0 auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: 4,
                          }}
                        >
                          {!n.read && (
                            <button
                              type="button"
                              className="notif-link-btn"
                              onClick={() => markAsRead(n.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                padding: '2px 4px',
                              }}
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            type="button"
                            className="notif-link-btn"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              padding: '2px 4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            Learn more
                            <i className="ri-arrow-right-s-line" />
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })
        )}
      </div>
    </div>
  )
}
