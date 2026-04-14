import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

export function RegistrationVerification() {
  const { authenticationToken } = useParams<{ authenticationToken: string }>()
  const navigate = useNavigate()

  const [otp, setOtp] = useState('')
  const [disableBtn, setDisableBtn] = useState(false)
  const [timer, setTimer] = useState(0)
  const [attemptLeft, setAttemptLeft] = useState('')
  const [signId] = useState('user@example.com')
  const [registeredBy] = useState('Email')

  useEffect(() => {
    document.body.classList.add('loginbg')
    return () => document.body.classList.remove('loginbg')
  }, [])

  useEffect(() => {
    let interval: number
    if (timer > 0) {
      interval = window.setInterval(() => setTimer((p) => p - 1), 1000)
    } else {
      setDisableBtn(false)
    }
    return () => window.clearInterval(interval)
  }, [timer])

  const handleGetOtp = () => {
    alert('OTP sent!')
    setDisableBtn(true)
    setTimer(60)
    setAttemptLeft('3')
  }

  const handleVerify = () => {
    if (otp.length < 5) { alert('Invalid OTP'); return }
    alert('Account verified!')
    navigate(`/account-activate/${authenticationToken ?? 'demo'}`)
  }

  return (
    <div className="login_fullhieght verificationregister">
      <div className="login_section">
        <div className="login_form_right">
          <div className="form_block_login">
            <img className="lightlogo" src="/images/logo_light.svg" alt="logo" />

            <div className="security_shield_vector">
              <img src="/images/security_shield.svg" alt="security" />
            </div>

            <h2>Verify Your Account</h2>
            <p className="text-center mb-3">
              Make your account 100% secure against unauthorized logins.
            </p>
            <p className="text-center mb-4">
              Registered {registeredBy || '---'}:{' '}
              <span className="text-primary">{signId || '---'}</span>
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row">
                <div className="col-sm-12 input_block">
                  <label>{registeredBy === 'Email' ? 'Email' : 'Mobile'} Verification Code</label>
                  <div className="email_code">
                    <input
                      className="input_filed"
                      type="text"
                      placeholder="Enter verification code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                    />
                    <button
                      className="get_otp otpcode"
                      type="button"
                      disabled={disableBtn}
                      onClick={handleGetOtp}
                    >
                      {disableBtn ? `Resend (${timer}s)` : 'GET OTP'}
                    </button>
                  </div>
                  {attemptLeft && (
                    <small className="text-warning d-block mt-2">
                      Verification attempts left: {Number(attemptLeft) - 1}
                    </small>
                  )}
                </div>

                <div className="col-sm-12 login_btn">
                  <input
                    type="button"
                    value="Verify Account"
                    onClick={handleVerify}
                    disabled={otp.length < 5}
                  />
                </div>

                <div className="col-sm-12 registration__info bottom">
                  <p>
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
