import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SOCIAL_LINKS, DOWNLOAD_LINK } from '../data/index.js'
import type { SocialLink } from '../types/index.js'

function IconCircle({ link }: { link: SocialLink }) {
  return (
    <li>
      <a
        href="#"
        className="flex items-center justify-center w-11 h-11 sm:w-[52px] sm:h-[52px] lg:w-[60px] lg:h-[60px] rounded-full border border-[#707070] bg-transparent"
        aria-label={link.label}
      >
        <img
          src={link.icon}
          alt=""
          style={{ width: `${link.iconSize}px`, height: `${link.iconSize}px` }}
        />
      </a>
    </li>
  )
}

export function Hero() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSignup = () => {
    navigate('/signup')
  }

  return (
    <section
      className="relative overflow-hidden flex items-center min-h-[600px] md:min-h-[720px] lg:min-h-[850px]"
      style={{
        backgroundColor: '#0E0E0E',
        backgroundImage: 'url(/images/baanerherobg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* World map silhouette — hidden on very small screens to reduce noise */}
      <div className="pointer-events-none absolute bottom-0 right-0 hidden sm:block w-[75%] md:w-[65%] lg:w-[55%] z-0">
        <img
          src="/images/banner_bottom_vector.png"
          alt=""
          className="w-full"
          style={{ filter: 'invert(1)', opacity: 0.12 }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 lg:pt-20 pb-32 sm:pb-36 md:pb-40 lg:pb-48">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-8">

          {/* Left: text + CTA */}
          <div className="w-full lg:w-[64%] lg:-mt-[30px] text-center lg:text-left">
            <h1 className="text-white text-[34px] sm:text-[44px] md:text-[52px] lg:text-[62px] font-semibold leading-[120%] lg:leading-[130%] mb-5">
              Trade Crypto with Confidence{' '}
              <span
                className="inline-flex items-center text-[22px] sm:text-[28px] md:text-[36px] lg:text-[48px] font-normal rounded-[50px] border border-[#6A6A6A] mt-3 sm:mt-2 lg:mt-0 align-middle"
                style={{
                  color: '#D1AA67',
                  backgroundColor: '#ffffff20',
                  padding: '5px 18px 5px 5px',
                }}
              >
                <span
                  className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[62px] lg:h-[62px] rounded-full border border-[#6E6E6E] mr-2 shrink-0"
                  style={{
                    backgroundColor: '#ffffff10',
                    boxShadow: '0 0 10px #ffffff29',
                  }}
                >
                  <img
                    src="/images/grow-crypto.svg"
                    alt=""
                    className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9"
                  />
                </span>
                Crypto Exchange
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#C0C0C0] leading-[180%] w-full lg:w-[85%] mx-auto lg:mx-0 mb-6">
              Buy, sell, and trade cryptocurrencies with lightning-fast execution and advanced tools.
              Experience a powerful trading environment built for both beginners and professional traders.
            </p>

            {/* Email + Sign Up */}
            <div className="flex justify-between gap-2 sm:gap-[18px] w-full max-w-[470px] mx-auto lg:mx-0 rounded-[50px] border border-[#707070] p-[5px] overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 border-none bg-transparent px-3 sm:px-[15px] text-[14px] sm:text-[15px] font-light text-[#f7f7f7] outline-none"
              />
              <button
                onClick={handleSignup}
                className="whitespace-nowrap rounded-[50px] border-none bg-[#D1AA67] px-5 sm:px-7 lg:px-9 py-2.5 sm:py-3.5 text-sm sm:text-base lg:text-lg font-normal text-white cursor-pointer shrink-0"
              >
                Sign Up
              </button>
            </div>

            {/* Social login + Download */}
            <div className="mt-6 flex flex-wrap gap-6 sm:gap-8 items-start justify-center lg:justify-start">
              <div>
                <span className="text-[14px] sm:text-[15px] font-light text-[#84888C]">Or Continue With</span>
                <ul className="flex gap-2 sm:gap-2.5 items-center mt-3 list-none p-0 m-0 justify-center lg:justify-start">
                  {SOCIAL_LINKS.map((link) => (
                    <IconCircle key={link.label} link={link} />
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[14px] sm:text-[15px] font-light text-[#84888C]">Download App</span>
                <ul className="flex gap-2 sm:gap-2.5 items-center mt-3 list-none p-0 m-0 justify-center lg:justify-start">
                  <IconCircle link={DOWNLOAD_LINK} />
                </ul>
              </div>
            </div>
          </div>

          {/* Right: phone mockup with animation */}
          <div className="w-full lg:flex-1 flex justify-center">
            <div className="banner-img-motion">
              <img
                src="/images/banner_img.svg"
                alt="Trading platform preview"
                className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[440px] lg:max-w-[520px] object-contain select-none"
                style={{ filter: 'drop-shadow(0 24px 64px rgba(0,0,0,0.6))' }}
                draggable={false}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
