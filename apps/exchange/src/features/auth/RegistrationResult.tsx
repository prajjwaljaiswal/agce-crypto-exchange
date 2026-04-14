import { Link } from 'react-router-dom'

/** /account-activate/:token — shown after email/OTP verification completes */
export function RegistrationResult() {
  // Stub: always show "Active" state (real impl would verify the token via API)
  const verification = 'Active'

  return (
    <div className="container">
      {(verification === 'Active' || verification === 'Blocked') && (
        <div className="register_verified_form account_activate">
          <div className="register_verified_vector">
            <img src="/images/veify4.png" alt="register" />
          </div>

          {verification === 'Active' && (
            <>
              <h1>Welcome to AGCE</h1>
              <p>Thank you for choosing us!</p>
            </>
          )}

          {verification === 'Active' ? (
            <>
              <p>Your account has been successfully activated.</p>
              <p>Please login with your credentials to access your account.</p>
              <p className="yellow">Happy Trading!!!</p>
            </>
          ) : (
            <>
              <p className="dark_yellow">
                Your account has been blocked due to suspicious activity.
              </p>
              <p className="light_red">
                For security reasons, we have temporarily restricted access.
              </p>
              <p className="yellow">
                If you believe this was done by mistake, please contact us at{' '}
                <a href="mailto:support@agce.com">support@agce.com</a>.
              </p>
            </>
          )}

          {verification === 'Active' && (
            <button>
              <Link to="/login">Log In with Us</Link>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
