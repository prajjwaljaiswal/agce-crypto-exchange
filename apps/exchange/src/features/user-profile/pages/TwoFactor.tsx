import { MOCK_FACTORS, SECURITY_TIPS } from './__mocks__/twoFactorData.js'

export function TwoFactor() {
  const activeCount = MOCK_FACTORS.filter((f) => f.active).length
  return (
    <div className="dashboard_right">
      <div className="twofactor_outer_s">
        <div className="security_level mb-3">
          <h4>Security Settings</h4>
          <p>
            Current security level:{' '}
            <strong className="text-success">
              High ({activeCount}/{MOCK_FACTORS.length} methods active)
            </strong>
          </p>
        </div>

        <div className="two_factor_list">
          {MOCK_FACTORS.map((f) => (
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
            {SECURITY_TIPS.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
