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

export function ActivityLogs() {
  return (
    <div className="dashboard_right">
      <div className="kyc_approval_s activity_logs">
        <div className="top_heading">
          <h4>Activity Logs</h4>
          <p>Review logins, password changes, and key account events.</p>
        </div>

        <div className="dashboard_summary desktop_view2">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>IP Address</th>
                  <th className="right_t">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody>
                {LOGS.map((log) => (
                  <tr key={log.id}>
                    <td className={`text-${log.severity}`}>{log.activity}</td>
                    <td>{log.ip}</td>
                    <td className="right_t">{log.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mobile_view">
          <ul className="order_datalist_2">
            {LOGS.map((log) => (
              <li key={log.id}>
                <div className="d-flex justify-content-between">
                  <strong className={`text-${log.severity}`}>
                    {log.activity}
                  </strong>
                  <span>{log.date}</span>
                </div>
                <p>IP: {log.ip}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
