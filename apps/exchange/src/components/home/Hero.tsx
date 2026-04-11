import { useState } from 'react'

export function Hero() {
  const [email, setEmail] = useState('')

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: '850px',
        backgroundColor: '#0E0E0E',
        backgroundImage: 'url(/images/baanerherobg.jpg)',
        backgroundSize: 'contain',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* World map silhouette — absolute bottom-right, behind phone mockup */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-[55%]" style={{ zIndex: 0 }}>
        <img
          src="/images/banner_bottom_vector.png"
          alt=""
          className="w-full"
          style={{ filter: 'invert(1)', opacity: 0.12 }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-[1400px] px-6 py-14 lg:py-20">
        <div className="flex items-center gap-10 flex-wrap lg:flex-nowrap">

          {/* ── Left: text + CTA ── */}
          <div style={{ width: '64%', maxWidth: '100%', marginTop: '-30px' }}>

            {/* Headline — badge is inline inside h1, wraps to next line */}
            <h1
              style={{
                color: '#ffffff',
                fontSize: '62px',
                fontWeight: 600,
                lineHeight: '130%',
                marginBottom: '20px',
              }}
            >
              Trade Crypto with Confidence{' '}
              <span
                style={{
                  color: '#D1AA67',
                  fontSize: '48px',
                  fontWeight: 400,
                  backgroundColor: '#ffffff20',
                  border: '1px solid #6A6A6A',
                  padding: '7px 24px 7px 7px',
                  borderRadius: '50px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    width: '62px',
                    height: '62px',
                    backgroundColor: '#ffffff10',
                    borderRadius: '50px',
                    border: '1px solid #6E6E6E',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px #ffffff29',
                    position: 'relative',
                    top: '-2px',
                    marginRight: '8px',
                  }}
                >
                  <img src="/images/grow-crypto.svg" alt="" style={{ width: '36px', height: '36px' }} />
                </span>
                Crypto Exchange
              </span>
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '18px',
                color: '#C0C0C0',
                lineHeight: '180%',
                width: '85%',
                marginBottom: '24px',
              }}
            >
              Buy, sell, and trade cryptocurrencies with lightning-fast execution and advanced tools.
              Experience a powerful trading environment built for both beginners and professional traders.
            </p>

            {/* Email + Sign Up — pill shape */}
            <div
              style={{
                border: '1px solid #707070',
                padding: '5px',
                borderRadius: '50px',
                display: 'flex',
                justifyContent: 'space-between',
                overflow: 'hidden',
                gap: '18px',
                maxWidth: '470px',
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  border: 'none',
                  padding: '0 15px',
                  width: '100%',
                  fontWeight: 300,
                  backgroundColor: 'transparent',
                  fontSize: '15px',
                  color: '#f7f7f7',
                  outline: 'none',
                }}
              />
              <button
                style={{
                  backgroundColor: '#D1AA67',
                  fontSize: '18px',
                  whiteSpace: 'nowrap',
                  fontWeight: 400,
                  padding: '14px 36px',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '50px',
                  cursor: 'pointer',
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Social login + Download — two groups in a flex row */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

              {/* Group 1: Or Continue With */}
              <div>
                <span style={{ fontSize: '15px', fontWeight: 300, color: '#84888C' }}>
                  Or Continue With
                </span>
                <ul style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '12px', listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
                  <li>
                    <a
                      href="#"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'transparent',
                        border: '1px solid #707070',
                      }}
                      aria-label="Continue with Google"
                    >
                      <img src="/images/googleicon.svg" alt="" style={{ width: '28px', height: '28px' }} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'transparent',
                        border: '1px solid #707070',
                      }}
                      aria-label="Continue with Apple"
                    >
                      <img src="/images/appleicon.svg" alt="" style={{ width: '24px', height: '24px' }} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'transparent',
                        border: '1px solid #707070',
                      }}
                      aria-label="Continue with Telegram"
                    >
                      <img src="/images/telegramicon.svg" alt="" style={{ width: '28px', height: '28px' }} />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Group 2: Download App */}
              <div>
                <span style={{ fontSize: '15px', fontWeight: 300, color: '#84888C' }}>
                  Download App
                </span>
                <ul style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '12px', listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
                  <li>
                    <a
                      href="#"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'transparent',
                        border: '1px solid #707070',
                      }}
                      aria-label="Download App"
                    >
                      <img src="/images/downloadicon.svg" alt="" style={{ width: '28px', height: '28px' }} />
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* ── Right: dual phone mockup ── */}
          <div style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
            <img
              src="/images/banner_img.png"
              alt="Arab Global Exchange mobile app — portfolio and trading chart"
              style={{
                width: '100%',
                maxWidth: '520px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 24px 64px rgba(0,0,0,0.6))',
                userSelect: 'none',
              }}
              draggable={false}
            />
          </div>

        </div>
      </div>
    </section>
  )
}
