export function TradeAnywhere() {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: '#ffffff' }}>
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — phone mockups */}
          <div className="flex justify-center">
            <img
              src="/images/trade_crypto_img.png"
              alt="Trade crypto app screenshots"
              style={{
                width: '100%',
                maxWidth: '540px',
                objectFit: 'contain',
              }}
              draggable={false}
            />
          </div>

          {/* Right — text content */}
          <div>
            <h2
              style={{
                fontSize: '52px',
                fontWeight: 700,
                lineHeight: '1.15',
                color: 'var(--color-text-dark)',
                marginBottom: '32px',
              }}
            >
              Trade Crypto<br />Anywhere, Anytime
            </h2>

            {/* QR code box */}
            <div
              className="flex items-center gap-5 rounded-2xl mb-8"
              style={{
                border: '1px solid var(--color-border-light)',
                padding: '20px 24px',
                maxWidth: '380px',
              }}
            >
              <div className="shrink-0">
                <img
                  src="/images/scanqr_code.svg"
                  alt="QR Code"
                  style={{ width: '90px', height: '90px' }}
                />
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
                  className="text-sm"
                  style={{ color: 'var(--color-text-dark-muted)', textDecoration: 'underline' }}
                >
                  More Download Options
                </a>
              </div>
            </div>

            {/* Platform icons */}
            <div className="flex items-center gap-10">
              <div className="flex flex-col items-center gap-2">
                <img src="/images/apple_icon.svg" alt="Mac OS" style={{ width: '32px', height: '32px' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-dark-muted)' }}>Mac OS</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img src="/images/windows_icon.svg" alt="Windows" style={{ width: '32px', height: '32px' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-dark-muted)' }}>Windows</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img src="/images/api_icon.svg" alt="API" style={{ width: '32px', height: '32px' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-dark-muted)' }}>API</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
