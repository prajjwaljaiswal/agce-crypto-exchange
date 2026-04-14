const CURRENCIES = ['USDT', 'BTC', 'BNB']

export function Settings() {
  return (
    <div className="dashboard_right">
      <div className="twofactor_outer_s">
        <div className="factor_bl active">
          <div className="lftcnt">
            <div className="enable">
              <img src="/images/user.png" alt="Profile" />
            </div>
            <div>
              <h5>Demo User</h5>
              <p>demo@example.com</p>
            </div>
          </div>
          <button type="button" className="btn btn-outline-custom">
            Edit
          </button>
        </div>

        <div className="factor_bl active">
          <div className="lftcnt">
            <h5>Currency Preference</h5>
            <p>Choose your preferred display currency</p>
            <ul className="currency_list_b">
              {CURRENCIES.map((c, i) => (
                <li key={c} className="currency_list_b_li">
                  <label className="d-flex gap-2 align-items-center">
                    <input type="radio" name="currency" defaultChecked={i === 0} />
                    {c}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="factor_bl active">
          <div className="lftcnt">
            <h5>Login Password</h5>
            <p>Regular password updates increase your account security.</p>
          </div>
          <button type="button" className="btn btn-outline-custom">
            Change
          </button>
        </div>

        <div className="factor_bl active">
          <div className="lftcnt">
            <h5>Anti-phishing Code</h5>
            <p>
              Protect against phishing by setting a short personal code shown
              in official emails.
            </p>
          </div>
          <button type="button" className="btn btn-outline-custom">
            Setup
          </button>
        </div>
      </div>
    </div>
  )
}
