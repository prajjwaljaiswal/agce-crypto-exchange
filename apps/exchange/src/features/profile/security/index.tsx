import { Mail, Smartphone, Key, Fingerprint, CheckCircle2, Circle } from 'lucide-react'

type MethodStatus = 'enabled' | 'setup'

interface SecurityMethod {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  status: MethodStatus
}

const SECURITY_METHODS: SecurityMethod[] = [
  {
    id: 'email',
    icon: <Mail size={22} />,
    title: 'Email Verification',
    description: 'Receive a verification code to your registered email address for each login.',
    status: 'enabled',
  },
  {
    id: 'google',
    icon: <Key size={22} />,
    title: 'Google Authenticator',
    description: 'Use the Google Authenticator app to generate time-based one-time passwords (TOTP).',
    status: 'setup',
  },
  {
    id: 'sms',
    icon: <Smartphone size={22} />,
    title: 'SMS Verification',
    description: 'Receive a one-time code via SMS to your registered mobile number.',
    status: 'setup',
  },
  {
    id: 'passkey',
    icon: <Fingerprint size={22} />,
    title: 'Passkey / Biometric',
    description: 'Use device biometrics (Face ID, fingerprint) or a hardware security key.',
    status: 'setup',
  },
]

function StatusBadge({ status }: { status: MethodStatus }) {
  if (status === 'enabled') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
        style={{ backgroundColor: '#16a34a22', color: 'var(--color-green)' }}>
        <CheckCircle2 size={12} />
        Enabled
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border border-[var(--color-border)]"
      style={{ color: 'var(--color-text-muted)' }}>
      <Circle size={12} />
      Not Set Up
    </span>
  )
}

export function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Security</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Manage your two-factor authentication methods to keep your account secure.
        </p>
      </div>

      {/* Security Score */}
      <div
        className="rounded-xl p-5 border border-[var(--color-border)]"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">Security Score</p>
            <p className="text-3xl font-bold mt-1" style={{ color: 'var(--color-primary)' }}>40%</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Enable more methods to improve your score</p>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--color-surface-2)' }}>
              <div
                className="h-2 rounded-full"
                style={{ width: '40%', backgroundColor: 'var(--color-primary)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Method Cards */}
      <div className="space-y-4">
        {SECURITY_METHODS.map((method) => (
          <div
            key={method.id}
            className="rounded-xl p-5 border border-[var(--color-border)] flex items-start justify-between gap-4 flex-wrap"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-primary)' }}
              >
                {method.icon}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-base font-medium text-[var(--color-text)]">{method.title}</h3>
                  <StatusBadge status={method.status} />
                </div>
                <p className="mt-1 text-sm text-[var(--color-text-muted)] max-w-md">{method.description}</p>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              {method.status === 'enabled' ? (
                <button
                  className="rounded-lg px-4 py-2 text-sm font-medium border border-[var(--color-red)] transition-colors"
                  style={{ color: 'var(--color-red)' }}
                >
                  Disable
                </button>
              ) : (
                <button
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Enable
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Login Activity Notice */}
      <div
        className="rounded-xl p-4 border border-[var(--color-border)] flex items-start gap-3"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <Smartphone size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
        <p className="text-sm text-[var(--color-text-muted)]">
          We recommend enabling at least two verification methods. If you lose access to one, you can use the other
          to recover your account.
        </p>
      </div>
    </div>
  )
}
