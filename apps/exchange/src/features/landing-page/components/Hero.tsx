import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Hero() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const handleSignup = () => {
    const trimmed = email.trim()
    if (!trimmed) {
      navigate('/signup')
      return
    }
    navigate(`/signup?email=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="hero_section_main">

      <div className="banner_bottom_vector">
        <img src="/images/banner_bottom_vector.png" alt="banner" />
      </div>

      <div className="container">
        <div className="row">
          <div className="banner_content">
            <h1>Trade Crypto with Confidence <span className="sub_heading"><span className="sub_heading_img"><img src="/images/grow-crypto.svg" alt="Crypto Exchange" /></span> Crypto Exchange </span></h1>
            <p>Buy, sell, and trade cryptocurrencies with lightning-fast execution and advanced tools.
              Experience a powerful trading environment built for both beginners and professional traders.</p>

            <div className="signup_email">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSignup()
                  }
                }}
              />
              <button type="button" onClick={handleSignup}>Sign Up</button>
            </div>

            <div className="social_withus_outer d-flex justify-content-start  gap-3">

              <div className="social_withus">
                <span>Or Continue With</span>
                <ul>
                  <li><a href="#"><img src="/images/googleicon.svg" alt="Apple" /></a></li>
                  <li><a href="#"><img src="/images/appleicon.svg" alt="Facebook" /></a></li>
                  <li><a href="#"><img src="/images/telegramicon.svg" alt="Twitter" /></a></li>
                </ul>
              </div>

              <div className="social_withus">
                <span>Download App</span>
                <ul>
                  <li><a href="#"><img src="/images/downloadicon.svg" alt="Apple" /></a></li>
                </ul>
              </div>

            </div>


          </div>
          <div className="banner_img">
            <div className="banner_img_main">
              <div className="banner_img_motion">
                <img src="/images/banner_img.svg" alt="Trading platform preview" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
