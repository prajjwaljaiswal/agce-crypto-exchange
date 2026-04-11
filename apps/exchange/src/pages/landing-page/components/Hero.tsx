import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SOCIAL_LINKS, DOWNLOAD_LINK } from '../data/index.js'
import type { SocialLink } from '../types/index.js'

function IconCircle({ link }: { link: SocialLink }) {
  return (
    <li>
      <a
        href="#"
        className="flex items-center justify-center w-[60px] h-[60px] rounded-full border border-[#707070] bg-transparent"
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
      className="relative overflow-hidden flex items-center"
      style={{
        minHeight: '850px',
        backgroundColor: '#0E0E0E',
        backgroundImage: 'url(/images/baanerherobg.jpg)',
        backgroundSize: 'contain',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* World map silhouette */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-[55%] z-0">
        <img
          src="/images/banner_bottom_vector.png"
          alt=""
          className="w-full"
          style={{ filter: 'invert(1)', opacity: 0.12 }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-[1400px] px-6 py-14 lg:py-20">
        <div className="flex items-center gap-10 flex-wrap lg:flex-nowrap">

          {/* Left: text + CTA */}
          <div className="w-[64%] max-w-full -mt-[30px]">
            <h1 className="text-white text-[62px] font-semibold leading-[130%] mb-5">
              Trade Crypto with Confidence{' '}
              <span
                className="text-[48px] font-normal whitespace-nowrap rounded-[50px] border border-[#6A6A6A]"
                style={{
                  color: '#D1AA67',
                  backgroundColor: '#ffffff20',
                  padding: '7px 24px 7px 7px',
                }}
              >
                <span
                  className="inline-flex items-center justify-center w-[62px] h-[62px] rounded-full border border-[#6E6E6E] relative -top-0.5 mr-2"
                  style={{
                    backgroundColor: '#ffffff10',
                    boxShadow: '0 0 10px #ffffff29',
                  }}
                >
                  <img src="/images/grow-crypto.svg" alt="" className="w-9 h-9" />
                </span>
                Crypto Exchange
              </span>
            </h1>

            <p className="text-lg text-[#C0C0C0] leading-[180%] w-[85%] mb-6">
              Buy, sell, and trade cryptocurrencies with lightning-fast execution and advanced tools.
              Experience a powerful trading environment built for both beginners and professional traders.
            </p>

            {/* Email + Sign Up */}
            <div className="flex justify-between gap-[18px] max-w-[470px] rounded-[50px] border border-[#707070] p-[5px] overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-none bg-transparent px-[15px] text-[15px] font-light text-[#f7f7f7] outline-none"
              />
              <button
                onClick={handleSignup}
                className="whitespace-nowrap rounded-[50px] border-none bg-[#D1AA67] px-9 py-3.5 text-lg font-normal text-white cursor-pointer"
              >
                Sign Up
              </button>
            </div>

            {/* Social login + Download */}
            <div className="mt-6 flex gap-8 items-start">
              <div>
                <span className="text-[15px] font-light text-[#84888C]">Or Continue With</span>
                <ul className="flex gap-2.5 items-center mt-3 list-none p-0 m-0">
                  {SOCIAL_LINKS.map((link) => (
                    <IconCircle key={link.label} link={link} />
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[15px] font-light text-[#84888C]">Download App</span>
                <ul className="flex gap-2.5 items-center mt-3 list-none p-0 m-0">
                  <IconCircle link={DOWNLOAD_LINK} />
                </ul>
              </div>
            </div>
          </div>

          {/* Right: phone mockup with animation */}
          <div className="flex-1 flex justify-center">
            <div className="banner-img-motion">
              <img
                src="/images/banner_img.svg"
                alt="Trading platform preview"
                className="w-full max-w-[520px] object-contain select-none"
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
