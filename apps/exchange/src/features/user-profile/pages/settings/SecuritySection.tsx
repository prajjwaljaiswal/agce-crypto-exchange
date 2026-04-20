interface SecuritySectionProps {
  onChangePassword: () => void
  onSetAntiPhishing: () => void
  onAddPasskey: () => void
  onRemovePasskey: () => void
  onEnableGoogleAuth: () => void
  onDisableGoogleAuth: () => void
  isPasskeyEnabled?: boolean
  isRemovingPasskey?: boolean
  isGoogleAuthEnabled?: boolean
  isDisablingGoogleAuth?: boolean
}

const REMOVE_BTN_STYLE: React.CSSProperties = {
  border: '1px solid #ef4444',
  color: '#ef4444',
  background: 'transparent',
}

export function SecuritySection({
  onChangePassword,
  onSetAntiPhishing,
  onAddPasskey,
  onRemovePasskey,
  onEnableGoogleAuth,
  onDisableGoogleAuth,
  isPasskeyEnabled = false,
  isRemovingPasskey = false,
  isGoogleAuthEnabled = false,
  isDisablingGoogleAuth = false,
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

        <div className={`factor_bl${isPasskeyEnabled ? ' active' : ''}`}>
          <div className="lftcnt">
            <h6>
              <i className="ri-fingerprint-line anti-phishing-icon-spaced" />
              Passkey
            </h6>
            <p>
              Sign in with Face ID, Touch ID, Windows Hello, or a security key
              instead of your password. You can keep using your password too.
            </p>
          </div>
          {isPasskeyEnabled ? (
            <button
              type="button"
              className="btn"
              style={REMOVE_BTN_STYLE}
              onClick={onRemovePasskey}
              disabled={isRemovingPasskey}
            >
              {isRemovingPasskey ? 'Removing…' : 'Remove Passkey'}
            </button>
          ) : (
            <button type="button" className="btn" onClick={onAddPasskey}>
              <i className="ri-add-line anti-phishing-icon-tight" />
              Add Passkey
            </button>
          )}
        </div>

        <div className={`factor_bl${isGoogleAuthEnabled ? ' active' : ''}`}>
          <div className="lftcnt">
            <h6>
              <i className="ri-shield-keyhole-line anti-phishing-icon-spaced" />
              Google Authenticator
            </h6>
            <p>
              Use a time-based 6-digit code from Google Authenticator or a
              compatible app as your second factor when signing in.
            </p>
          </div>
          {isGoogleAuthEnabled ? (
            <button
              type="button"
              className="btn"
              style={REMOVE_BTN_STYLE}
              onClick={onDisableGoogleAuth}
              disabled={isDisablingGoogleAuth}
            >
              {isDisablingGoogleAuth ? 'Disabling…' : 'Disable'}
            </button>
          ) : (
            <button type="button" className="btn" onClick={onEnableGoogleAuth}>
              <i className="ri-add-line anti-phishing-icon-tight" />
              Enable
            </button>
          )}
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
