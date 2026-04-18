import { useMemo, useState } from 'react'
import { MOCK_TICKETS, type MockTicket } from './__mocks__/tickets.js'

type StatusFilter = 'all' | 'open' | 'progress' | 'closed'

const PRIORITY_CLASS: Record<MockTicket['priority'], string> = {
  High: 'support-pill--high',
  Medium: 'support-pill--medium',
  Low: 'support-pill--low',
}

const STATUS_CLASS: Record<MockTicket['status'], string> = {
  Open: 'support-pill--open',
  'In Progress': 'support-pill--progress',
  Closed: 'support-pill--closed',
}

const FILTER_LABEL: Record<StatusFilter, string> = {
  all: 'All',
  open: 'Open',
  progress: 'In Progress',
  closed: 'Closed',
}

const QUICK_HELP = [
  { icon: 'ri-wallet-3-line', title: 'Deposits & Withdrawals', desc: 'Common issues with funding and cashout' },
  { icon: 'ri-shield-user-line', title: 'KYC Verification', desc: 'Speed up identity checks' },
  { icon: 'ri-lock-2-line', title: 'Account Security', desc: '2FA, passwords and device access' },
]

export function Support() {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')

  const counts = useMemo(() => ({
    total: MOCK_TICKETS.length,
    open: MOCK_TICKETS.filter((t) => t.status === 'Open').length,
    progress: MOCK_TICKETS.filter((t) => t.status === 'In Progress').length,
    closed: MOCK_TICKETS.filter((t) => t.status === 'Closed').length,
  }), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MOCK_TICKETS.filter((t) => {
      if (filter === 'open' && t.status !== 'Open') return false
      if (filter === 'progress' && t.status !== 'In Progress') return false
      if (filter === 'closed' && t.status !== 'Closed') return false
      if (!q) return true
      return (
        t.ticketId.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      )
    })
  }, [filter, query])

  return (
    <div className="dashboard_right">
      <div className="support-page">
        <div className="support-stats">
          <div className="support-stat">
            <div className="support-stat-icon support-stat-icon--total">
              <i className="ri-customer-service-2-line" />
            </div>
            <div>
              <div className="support-stat-label">Total Tickets</div>
              <div className="support-stat-value">{counts.total}</div>
            </div>
          </div>
          <div className="support-stat">
            <div className="support-stat-icon support-stat-icon--open">
              <i className="ri-mail-open-line" />
            </div>
            <div>
              <div className="support-stat-label">Open</div>
              <div className="support-stat-value">{counts.open}</div>
            </div>
          </div>
          <div className="support-stat">
            <div className="support-stat-icon support-stat-icon--progress">
              <i className="ri-time-line" />
            </div>
            <div>
              <div className="support-stat-label">In Progress</div>
              <div className="support-stat-value">{counts.progress}</div>
            </div>
          </div>
          <div className="support-stat">
            <div className="support-stat-icon support-stat-icon--closed">
              <i className="ri-checkbox-circle-line" />
            </div>
            <div>
              <div className="support-stat-label">Closed</div>
              <div className="support-stat-value">{counts.closed}</div>
            </div>
          </div>
        </div>

        <div className="support-grid">
          <section className="support-card">
            <h4 className="support-card-title">Raise a Support Ticket</h4>
            <p className="support-card-subtitle">
              Our team usually responds within 24 hours.
            </p>

            <form className="support-form-stack" onSubmit={(e) => e.preventDefault()}>
              <div className="support-form-row">
                <div className="support-field">
                  <label htmlFor="support-subject">Subject</label>
                  <input id="support-subject" type="text" placeholder="Briefly describe your issue" />
                </div>
                <div className="support-field">
                  <label htmlFor="support-category">Category</label>
                  <select id="support-category" defaultValue="">
                    <option value="" disabled>Select</option>
                    <option>Deposit</option>
                    <option>Withdrawal</option>
                    <option>KYC</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="support-field">
                  <label htmlFor="support-priority">Priority</label>
                  <select id="support-priority" defaultValue="Low">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="support-field">
                <label htmlFor="support-description">Description</label>
                <textarea
                  id="support-description"
                  rows={5}
                  placeholder="Describe your issue in detail..."
                />
              </div>

              <div className="support-field">
                <label htmlFor="support-files">Supporting documents</label>
                <input id="support-files" type="file" multiple />
              </div>

              <div>
                <button type="submit" className="support-submit">
                  <i className="ri-send-plane-line" /> Submit Ticket
                </button>
              </div>
            </form>
          </section>

          <aside className="support-side">
            <section className="support-card">
              <h4 className="support-card-title">Quick Help</h4>
              <p className="support-card-subtitle">Common topics that may resolve your issue faster.</p>
              <ul className="support-help-list">
                {QUICK_HELP.map((h) => (
                  <li key={h.title}>
                    <div className="support-help-icon">
                      <i className={h.icon} />
                    </div>
                    <div className="support-help-text">
                      <strong>{h.title}</strong>
                      <span>{h.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="support-card">
              <h4 className="support-card-title">Contact Us</h4>
              <p className="support-card-subtitle">Prefer a different channel? Reach out directly.</p>
              <div className="support-contact">
                <a href="mailto:support@agce.com" className="support-contact-item">
                  <i className="ri-mail-line" /> support@agce.com
                </a>

                <a href="tel:+1234567890" className="support-contact-item">
                  <i className="ri-phone-line" /> +1 (234) 567-890
                </a>
              </div>
            </section>
          </aside>
        </div>

        <section className="support-card">
          <div className="support-toolbar">
            <div>
              <h4 className="support-card-title" style={{ marginBottom: 2 }}>Your Tickets</h4>
              <p className="support-card-subtitle" style={{ marginBottom: 0 }}>
                Track and manage your raised issues.
              </p>
            </div>
            <div className="support-search">
              <i className="ri-search-2-line" />
              <input
                type="search"
                placeholder="Search by subject, ID or category"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="support-filters" role="tablist" aria-label="Ticket status filter" style={{ marginBottom: 16 }}>
            {(Object.keys(FILTER_LABEL) as StatusFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                className={`support-filter-btn ${filter === key ? 'active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {FILTER_LABEL[key]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="support-empty">
              <i className="ri-inbox-line" />
              No tickets match your filters.
            </div>
          ) : (
            <>
              <div className="support-table-wrap">
                <table className="support-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Category</th>
                      <th>Subject</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t) => (
                      <tr key={t.id}>
                        <td className="support-ticket-id">{t.ticketId}</td>
                        <td>{t.category}</td>
                        <td>{t.subject}</td>
                        <td>
                          <span className={`support-pill ${PRIORITY_CLASS[t.priority]}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`support-pill ${STATUS_CLASS[t.status]}`}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button type="button" className="support-view-btn">
                            <i className="ri-eye-line" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="support-ticket-cards">
                {filtered.map((t) => (
                  <article key={t.id} className="support-ticket-card">
                    <div className="support-ticket-card-top">
                      <span className="support-ticket-id">{t.ticketId}</span>
                      <button type="button" className="support-view-btn">
                        <i className="ri-eye-line" /> View
                      </button>
                    </div>
                    <h5 className="support-ticket-subject">{t.subject}</h5>
                    <div className="support-ticket-meta">
                      <span>Category<strong>{t.category}</strong></span>
                    </div>
                    <div className="support-ticket-pills">
                      <span className={`support-pill ${PRIORITY_CLASS[t.priority]}`}>
                        {t.priority}
                      </span>
                      <span className={`support-pill ${STATUS_CLASS[t.status]}`}>
                        {t.status}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
