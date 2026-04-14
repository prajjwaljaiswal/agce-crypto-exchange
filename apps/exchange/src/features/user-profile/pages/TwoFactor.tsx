interface Factor {
  id: string
  icon: string
  title: string
  description: string
  active: boolean
}

const FACTORS: Factor[] = [
  {
    id: 'email',
    icon: 'ri-mail-line',
    title: 'Email Verification',
    description: 'Receive verification codes via email.',
    active: true,
  },
  {
    id: 'mobile',
    icon: 'ri-phone-line',
    title: 'Mobile Verification',
    description: 'Receive OTP codes on your registered mobile.',
    active: true,
  },
  {
    id: 'google',
    icon: 'ri-shield-keyhole-line',
    title: 'Google Authenticator',
    description: 'Use Google Authenticator app for time-based codes.',
    active: true,
  },
  {
    id: 'passkey',
    icon: 'ri-fingerprint-line',
    title: 'Passkey',
    description: 'Biometric or hardware-key authentication.',
    active: false,
  },
]

const TIPS = [
  'Never share your verification codes with anyone.',
  'Enable at least two different authentication methods.',
  'Review your active sessions regularly in Activity Logs.',
  'Update your password every 90 days.',
]

export function TwoFactor() {
  const activeCount = FACTORS.filter((f) => f.active).length
  return (
    <div className="dashboard_right">
      <div className="twofactor_outer_s">
        <div className="security_level mb-3">
          <h4>Security Settings</h4>
          <p>
            Current security level:{' '}
            <strong className="text-success">
              High ({activeCount}/{FACTORS.length} methods active)
            </strong>
          </p>
        </div>

        <div className="two_factor_list">
          {FACTORS.map((f) => (
            <div
              key={f.id}
              className={`factor_bl${f.active ? ' active' : ''}`}
            >
              <div className="lftcnt">
                <div className="enable">
                  <i className={f.icon} />
                </div>
                <div>
                  <h5>{f.title}</h5>
                  <p>{f.description}</p>
                </div>
              </div>
              <button type="button" className="btn btn-outline-custom">
                {f.active ? 'Change' : 'Enable'}
              </button>
            </div>
          ))}
        </div>

        <div className="security-tips mt-4">
          <h5>Security tips</h5>
          <ul className="security-tips-list">
            {TIPS.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
