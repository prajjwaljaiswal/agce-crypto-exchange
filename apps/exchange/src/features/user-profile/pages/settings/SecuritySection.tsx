interface SecuritySectionProps {
  onChangePassword: () => void
  onSetAntiPhishing: () => void
}

export function SecuritySection({
  onChangePassword,
  onSetAntiPhishing,
}: SecuritySectionProps) {
  return (
    <div className="twofactor_outer_s">
      <h5>Security Settings</h5>
      <p>Manage your account security and password settings</p>

      <div className="two_factor_list">
        <div className="factor_bl active">
          <div className="lftcnt">
            <h6>
              <img src="/images/lock_icon.svg" alt="Login Password" /> Login
              Password
            </h6>
            <p>
              Change your account password. You will need to verify with OTP
              sent to your registered email.
            </p>
          </div>

          <button type="button" className="btn" onClick={onChangePassword}>
            Change Password
          </button>
        </div>

        <div className="factor_bl active">
          <div className="lftcnt">
            <h6>
              <i className="ri-shield-check-line anti-phishing-icon-spaced" />
              Anti-phishing Code
            </h6>
            <p>
              Set a unique 5-8 digit code that will appear in legitimate emails
              and notifications. This helps you identify real communications
              from phishing attempts.
            </p>
          </div>
          <button type="button" className="btn" onClick={onSetAntiPhishing}>
            <i className="ri-add-line anti-phishing-icon-tight" />
            Set Code
          </button>
        </div>
      </div>
    </div>
  )
}
