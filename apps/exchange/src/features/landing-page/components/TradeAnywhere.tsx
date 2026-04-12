import { PLATFORMS } from '../data/index.js'

export function TradeAnywhere() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — phone mockups */}
          <div className="flex justify-center">
            <img
              src="/images/trade_crypto_img.svg"
              alt="Trade crypto app screenshots"
              className="w-full max-w-[540px] object-contain"
              draggable={false}
            />
          </div>

          {/* Right — text content */}
          <div>
            <h2 className="text-[52px] font-bold leading-[1.15] mb-8" style={{ color: 'var(--color-text-dark)' }}>
              Trade Crypto<br />Anywhere, Anytime
            </h2>

            {/* QR code box */}
            <div
              className="flex items-center gap-5 rounded-2xl mb-8 max-w-[380px]"
              style={{
                border: '1px solid var(--color-border-light)',
                padding: '20px 24px',
              }}
            >
              <div className="shrink-0">
                <img src="/images/scan_img.svg" alt="QR Code" className="w-[90px] h-[90px]" />
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: 'var(--color-text-dark-muted)' }}>
                  Scan to Download App
                </p>
                <p className="font-semibold text-lg" style={{ color: 'var(--color-text-dark)' }}>
                  iOS &amp; Android
                </p>
                <a
                  href="#"
                  className="text-sm underline"
                  style={{ color: 'var(--color-text-dark-muted)' }}
                >
                  More Download Options
                </a>
              </div>
            </div>

            {/* Platform icons */}
            <div className="flex items-center gap-10">
              {PLATFORMS.map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <img src={icon} alt={label} className="w-8 h-8" />
                  <span className="text-sm" style={{ color: 'var(--color-text-dark-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
