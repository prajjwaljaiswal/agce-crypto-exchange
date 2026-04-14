import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type Tab = 'email' | 'phone'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const COUNTRY_OPTIONS = [
  { value: '+91', label: '🇮🇳 +91 India' },
  { value: '+971', label: '🇦🇪 +971 UAE' },
  { value: '+966', label: '🇸🇦 +966 Saudi Arabia' },
  { value: '+974', label: '🇶🇦 +974 Qatar' },
  { value: '+965', label: '🇰🇼 +965 Kuwait' },
  { value: '+973', label: '🇧🇭 +973 Bahrain' },
  { value: '+968', label: '🇴🇲 +968 Oman' },
  { value: '+1', label: '🇺🇸 +1 USA' },
  { value: '+44', label: '🇬🇧 +44 UK' },
]

export function ForgotPassword() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('email')
  const [countryCode, setCountryCode] = useState('+91')
  const [signId, setSignId] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const showError = (msg: string) => alert(msg)
  const showSuccess = (msg: string) => alert(msg)

  const handleGetOtp = () => {
    if (tab === 'email') {
      if (!signId || !EMAIL_RE.test(signId)) {
        showError('Please enter a valid email address')
        return
      }
    } else {
      if (!signId || signId.replace(/\D/g, '').length < 6) {
        showError('Please enter a valid phone number for the selected country')
        return
      }
    }
    showSuccess('OTP sent successfully!')
  }

  const handleForgetPass = () => {
    if (!otp) { showError('Please enter the verification code'); return }
    if (!newPassword || newPassword.length < 8) {
      showError('Password must be at least 8 characters')
      return
    }
    showSuccess('Password reset successful!')
    navigate('/login')
  }

  const switchTab = (t: Tab) => {
    setTab(t)
    setSignId('')
    setOtp('')
    setNewPassword('')
  }

  return (
    <div className="login_section m-auto mt-5 forgot_password">
      <div className="login_form_right">
        <div className="form_block_login">
          <h2>Forgot Password</h2>

          <ul className="nav nav-tabs login-pills" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${tab === 'email' ? 'active' : ''}`}
                type="button"
                onClick={() => switchTab('email')}
              >
                Email
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${tab === 'phone' ? 'active' : ''}`}
                type="button"
                onClick={() => switchTab('phone')}
              >
                Phone
              </button>
            </li>
          </ul>

          <div className="tab-content" id="pills-tabContent">
            {/* Email tab */}
            {tab === 'email' && (
              <div className="tab-pane show active" role="tabpanel">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="row">
                    <div className="col-sm-12 input_block">
                      <label>Email*</label>
                      <input
                        className="input_filed"
                        type="email"
                        placeholder="Email"
                        value={signId}
                        onChange={(e) => setSignId(e.target.value)}
                      />
                    </div>
                    <div className="col-sm-12 input_block">
                      <label>Email Verification Code*</label>
                      <div className="email_code">
                        <input
                          type="text"
                          className="input_filed"
                          placeholder="Enter Code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                        />
                        <div className="get_otp" role="button" tabIndex={0} onClick={handleGetOtp}>
                          <span>GET OTP</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 input_block">
                      <label>New Password*</label>
                      <input
                        type="password"
                        className="input_filed"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-10 col-12 mx-auto mt-4">
                    <button
                      type="button"
                      className="btn custom-btn w-100 btn-block btn-xl"
                      onClick={handleForgetPass}
                    >
                      Forgot Password
                    </button>
                  </div>
                  <div className="col-sm-12 registration__info mt-4">
                    <p>Back to <Link to="/login">Login</Link></p>
                  </div>
                </form>
              </div>
            )}

            {/* Phone tab */}
            {tab === 'phone' && (
              <div className="tab-pane show active" role="tabpanel">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="row">
                    <div className="col-sm-12 input_block">
                      <label>Mobile Number*</label>
                      <select
                        className="input_filed"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        style={{ padding: '12px 16px', marginBottom: 8 }}
                      >
                        {COUNTRY_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <input
                        className="input_filed"
                        type="text"
                        inputMode="numeric"
                        placeholder="Mobile Number"
                        value={signId}
                        onChange={(e) => setSignId(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    <div className="col-sm-12 input_block">
                      <label>Phone Verification Code*</label>
                      <div className="email_code">
                        <input
                          type="text"
                          className="input_filed"
                          placeholder="Enter Code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                        />
                        <div className="get_otp" role="button" tabIndex={0} onClick={handleGetOtp}>
                          <span>GET OTP</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 input_block">
                      <label>New Password</label>
                      <input
                        type="password"
                        className="input_filed"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-10 col-12 mx-auto mt-4">
                    <button
                      type="button"
                      className="btn custom-btn w-100 btn-block btn-xl"
                      onClick={handleForgetPass}
                    >
                      Forgot Password
                    </button>
                  </div>
                  <div className="col-sm-12 registration__info mt-4">
                    <p>Back to <Link to="/login">Login</Link></p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
