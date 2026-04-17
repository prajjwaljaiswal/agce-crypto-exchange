interface Log {
  id: number
  activity: string
  ip: string
  date: string
  severity: 'success' | 'warning' | 'danger'
}

const LOGS: Log[] = [
  {
    id: 1,
    activity: 'User Login Success',
    ip: '192.168.1.8',
    date: '2026-04-14 10:02:11',
    severity: 'success',
  },
  {
    id: 2,
    activity: 'User Logout',
    ip: '192.168.1.8',
    date: '2026-04-13 21:45:32',
    severity: 'success',
  },
  {
    id: 3,
    activity: 'Login Failed',
    ip: '45.87.21.1',
    date: '2026-04-13 11:30:19',
    severity: 'danger',
  },
  {
    id: 4,
    activity: 'Password Changed',
    ip: '192.168.1.8',
    date: '2026-04-12 17:22:44',
    severity: 'warning',
  },
  {
    id: 5,
    activity: 'Spot Order Placed',
    ip: '192.168.1.8',
    date: '2026-04-12 09:58:05',
    severity: 'success',
  },
  {
    id: 6,
    activity: 'KYC Submitted',
    ip: '192.168.1.8',
    date: '2026-04-10 14:12:36',
    severity: 'warning',
  },
]

const SEVERITY_LABEL: Record<Log['severity'], string> = {
  success: 'Success',
  warning: 'Notice',
  danger: 'Failed',
}

function SeverityBadge({ severity }: { severity: Log['severity'] }) {
  return (
    <span className={`activity-log-badge activity-log-badge--${severity}`}>
      <i className="ri-circle-fill" aria-hidden />
      {SEVERITY_LABEL[severity]}
    </span>
  )
}

export function ActivityLogs() {
  return (
    <div className="dashboard_right">
      <section className="activity-logs-page">
        <div className="activity-logs-card">
          <header className="activity-logs-header">
            <h1>Activity Logs</h1>
            <p>Review logins, password changes, and key account events.</p>
          </header>

          <div className="activity-logs-table-wrap">
            <table className="activity-logs-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th className="right_t">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody>
                {LOGS.map((log) => (
                  <tr key={log.id}>
                    <td className="activity-log-activity">{log.activity}</td>
                    <td><SeverityBadge severity={log.severity} /></td>
                    <td className="activity-log-ip">{log.ip}</td>
                    <td className="activity-log-date right_t">{log.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="activity-logs-mobile">
            {LOGS.map((log) => (
              <li key={log.id} className="activity-log-card">
                <div className="activity-log-card-top">
                  <span className="activity-log-activity">{log.activity}</span>
                  <SeverityBadge severity={log.severity} />
                </div>
                <div className="activity-log-card-meta">
                  <span>
                    <i className="ri-global-line" aria-hidden /> {log.ip}
                  </span>
                  <span>
                    <i className="ri-time-line" aria-hidden /> {log.date}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}