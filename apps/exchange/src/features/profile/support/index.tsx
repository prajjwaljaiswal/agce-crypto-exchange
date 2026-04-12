import { useState } from 'react'
import { TicketCheck, Plus, ChevronDown, Clock, CheckCircle2, MessageCircle } from 'lucide-react'

type TicketStatus = 'open' | 'in-progress' | 'resolved'

interface Ticket {
  id: string
  subject: string
  category: string
  date: string
  status: TicketStatus
  lastUpdate: string
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TKT-0042',
    subject: 'Withdrawal pending for more than 24 hours',
    category: 'Withdrawal',
    date: '2026-04-10',
    status: 'in-progress',
    lastUpdate: '3 hours ago',
  },
  {
    id: 'TKT-0038',
    subject: 'KYC document upload failing',
    category: 'KYC',
    date: '2026-04-08',
    status: 'resolved',
    lastUpdate: '2 days ago',
  },
  {
    id: 'TKT-0031',
    subject: 'Unable to enable Google Authenticator',
    category: '2FA / Security',
    date: '2026-04-03',
    status: 'resolved',
    lastUpdate: '5 days ago',
  },
]

const STATUS_CONFIG: Record<TicketStatus, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  open: { label: 'Open', bg: '#d1aa6722', color: 'var(--color-primary)', icon: <Clock size={11} /> },
  'in-progress': { label: 'In Progress', bg: '#3b82f622', color: '#3b82f6', icon: <MessageCircle size={11} /> },
  resolved: { label: 'Resolved', bg: '#16a34a22', color: 'var(--color-green)', icon: <CheckCircle2 size={11} /> },
}

const CATEGORIES = [
  'Deposit / Withdrawal',
  'KYC / Verification',
  '2FA / Security',
  'Trading',
  'Referral & Bonus',
  'Technical Issue',
  'Other',
]

export function SupportPage() {
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Support</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Manage your support tickets or open a new request.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus size={16} />
          New Ticket
        </button>
      </div>

      {/* Create Ticket Form */}
      {showForm && (
        <div
          className="rounded-xl p-6 border border-[var(--color-border)] space-y-4"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <h2 className="text-lg font-medium text-[var(--color-text)]">Create Support Ticket</h2>

          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Briefly describe your issue"
              className="w-full rounded-lg px-4 py-2.5 text-sm text-[var(--color-text)] border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 pr-9 text-sm border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)] appearance-none"
                style={{ color: category ? 'var(--color-text)' : 'var(--color-text-muted)' }}
              >
                <option value="" style={{ backgroundColor: 'var(--color-surface)' }}>Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ backgroundColor: 'var(--color-surface)' }}>{c}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Provide as much detail as possible — transaction IDs, screenshots, steps to reproduce..."
              className="w-full rounded-lg px-4 py-3 text-sm text-[var(--color-text)] border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)] resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              className="rounded-lg px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-primary)' }}
              disabled={!subject.trim() || !category || !description.trim()}
            >
              Submit Ticket
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg px-6 py-2.5 text-sm font-medium border border-[var(--color-border)] text-[var(--color-text)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Ticket List */}
      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
          <TicketCheck size={16} style={{ color: 'var(--color-primary)' }} />
          <h2 className="text-base font-medium text-[var(--color-text)]">Your Tickets</h2>
        </div>

        {MOCK_TICKETS.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">No tickets yet.</div>
        ) : (
          <ul className="divide-y divide-[var(--color-border)]">
            {MOCK_TICKETS.map((ticket) => {
              const cfg = STATUS_CONFIG[ticket.status]
              return (
                <li
                  key={ticket.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-[var(--color-text-muted)]">{ticket.id}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">•</span>
                      <span className="text-xs text-[var(--color-text-muted)]">{ticket.category}</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text)] mt-0.5 truncate">{ticket.subject}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Updated {ticket.lastUpdate}</p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shrink-0"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
