const products = [
  {
    img: '/images/trading_icon.png',
    title: 'Spot',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
    accent: '#d1aa67',
    active: true,
  },
  {
    img: '/images/trading_icon2.png',
    title: 'Derivatives',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
    accent: '#627eea',
    active: false,
  },
  {
    img: '/images/trading_icon3.png',
    title: 'Launchpad',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
    accent: '#ff6b35',
    active: false,
  },
  {
    img: '/images/trading_icon4.png',
    title: 'Margin',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
    accent: '#22c55e',
    active: false,
  },
  {
    img: '/images/trading_icon5.png',
    title: 'Minimal Interface',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
    accent: '#f0b90b',
    active: false,
  },
  {
    img: '/images/trading_icon6.png',
    title: 'Futures & Options',
    description: 'Ready to trade? Login to your account and start buying and selling crypto currency today.',
    accent: '#9945ff',
    active: false,
  },
]

export function TradingProducts() {
  return (
    <section
      className="py-16 lg:py-24"
      style={{
        backgroundColor: '#0E0E0E',
        backgroundImage: 'url(/images/tradeworkbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header */}
        <div className="mb-12">
          <p
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: 'var(--color-primary)',
              marginBottom: '4px',
            }}
          >
            World
          </p>
          <h2
            style={{
              fontSize: '42px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: '1.2',
            }}
          >
            Class Trading Platform
          </h2>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(({ img, title, description, active }) => (
            <div
              key={title}
              className="rounded-2xl p-6 flex items-start gap-4 cursor-pointer transition-all group"
              style={{
                backgroundColor: active ? '#2a2218' : '#1a1a1a',
                border: active
                  ? '1px solid rgba(209,170,103,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Illustration */}
              <div className="shrink-0">
                <img
                  src={img}
                  alt={title}
                  style={{ width: '72px', height: '72px', objectFit: 'contain' }}
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-bold text-base mb-2"
                  style={{ color: '#ffffff' }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
