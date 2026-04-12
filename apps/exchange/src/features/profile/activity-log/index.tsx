import { Monitor, Smartphone, CheckCircle2, XCircle } from 'lucide-react'

interface ActivityEntry {
  id: string
  date: string
  activity: string
  ipAddress: string
  device: string
  deviceType: 'desktop' | 'mobile'
  status: 'success' | 'failed'
  location: string
}

const MOCK_ACTIVITY: ActivityEntry[] = [
  {
    id: '1',
    date: '2026-04-11 14:32:05',
    activity: 'Login',
    ipAddress: '192.168.1.105',
    device: 'Chrome 124 / Windows 11',
    deviceType: 'desktop',
    status: 'success',
    location: 'Dubai, UAE',
  },
  {
    id: '2',
    date: '2026-04-11 09:15:22',
    activity: 'Withdrawal Submitted',
    ipAddress: '192.168.1.105',
    device: 'Chrome 124 / Windows 11',
    deviceType: 'desktop',
    status: 'success',
    location: 'Dubai, UAE',
  },
  {
    id: '3',
    date: '2026-04-10 22:04:18',
    activity: 'Login',
    ipAddress: '10.0.0.88',
    device: 'Safari / iPhone 15',
    deviceType: 'mobile',
    status: 'success',
    location: 'Abu Dhabi, UAE',
  },
  {
    id: '4',
    date: '2026-04-10 18:47:33',
    activity: 'Password Change',
    ipAddress: '10.0.0.88',
    device: 'Safari / iPhone 15',
    deviceType: 'mobile',
    status: 'success',
    location: 'Abu Dhabi, UAE',
  },
  {
    id: '5',
    date: '2026-04-09 11:20:01',
    activity: 'Login',
    ipAddress: '203.0.113.45',
    device: 'Firefox 125 / macOS',
    deviceType: 'desktop',
    status: 'failed',
    location: 'London, UK',
  },
  {
    id: '6',
    date: '2026-04-08 07:55:44',
    activity: '2FA Disabled',
    ipAddress: '192.168.1.105',
    device: 'Chrome 124 / Windows 11',
    deviceType: 'desktop',
    status: 'success',
    location: 'Dubai, UAE',
  },
  {
    id: '7',
    date: '2026-04-07 16:12:09',
    activity: 'Login',
    ipAddress: '192.168.1.105',
    device: 'Chrome 124 / Windows 11',
    deviceType: 'desktop',
    status: 'success',
    location: 'Dubai, UAE',
  },
  {
    id: '8',
    date: '2026-04-05 09:00:00',
    activity: 'KYC Submitted',
    ipAddress: '192.168.1.105',
    device: 'Chrome 124 / Windows 11',
    deviceType: 'desktop',
    status: 'success',
    location: 'Dubai, UAE',
  },
]

export function ActivityLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Activity Log</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          A record of all recent actions and login attempts on your account.
        </p>
      </div>

      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Date & Time', 'Activity', 'IP Address', 'Location', 'Device', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-medium text-[var(--color-text-muted)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MOCK_ACTIVITY.map((entry) => (
                <tr key={entry.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                  <td className="px-5 py-4 text-[var(--color-text-muted)] whitespace-nowrap">{entry.date}</td>
                  <td className="px-5 py-4 font-medium text-[var(--color-text)]">{entry.activity}</td>
                  <td className="px-5 py-4 font-mono text-xs text-[var(--color-text-muted)]">{entry.ipAddress}</td>
                  <td className="px-5 py-4 text-[var(--color-text-muted)]">{entry.location}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                      {entry.deviceType === 'desktop' ? <Monitor size={14} /> : <Smartphone size={14} />}
                      <span>{entry.device}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {entry.status === 'success' ? (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ backgroundColor: '#16a34a22', color: 'var(--color-green)' }}
                      >
                        <CheckCircle2 size={11} />
                        Success
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ backgroundColor: '#dc262622', color: 'var(--color-red)' }}
                      >
                        <XCircle size={11} />
                        Failed
                      </span>
                    )}
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
