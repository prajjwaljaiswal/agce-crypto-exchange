interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Deposit confirmed',
    description: '1000 USDT deposit credited to your Main Wallet.',
    time: '10 min ago',
    read: false,
  },
  {
    id: '2',
    title: 'Login from new device',
    description: 'A new login was detected from Chrome on Windows.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    title: 'KYC reminder',
    description: 'Complete KYC to unlock higher withdrawal limits.',
    time: '1 day ago',
    read: true,
  },
]

export function Notifications() {
  return (
    <div className="dashboard_right">
      <div className="kyc_approval_s activity_logs">
        <div className="top_heading">
          <h4>Notifications</h4>
          <button type="button" className="btn btn-link">
            Mark all as read
          </button>
        </div>

        <div className="notification_table">
          <h5 className="mt-3">Today</h5>
          <table>
            <tbody>
              {NOTIFICATIONS.map((n) => (
                <tr key={n.id} className={!n.read ? 'tb_background' : ''}>
                  <td>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6>{n.title}</h6>
                        <p>{n.description}</p>
                        <small>{n.time}</small>
                      </div>
                      <div className="d-flex gap-2">
                        {!n.read && (
                          <button type="button" className="btn btn-link">
                            Mark as Read
                          </button>
                        )}
                        <button type="button" className="btn btn-link">
                          Learn more
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
