import { PRODUCTS } from '../data/index.js'

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
        <div className="mb-12">
          <h2 className="text-[42px] font-bold leading-[1.2]">
            <span className="text-lg font-medium block mb-1" style={{ color: 'var(--color-primary)' }}>World</span>
            <span className="text-white">Class Trading Platform</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTS.map(({ img, title, description }) => (
            <div
              key={title}
              className="rounded-2xl p-6 flex items-start gap-4 cursor-pointer transition-all group"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="shrink-0">
                <img src={img} alt={title} className="w-[72px] h-[72px] object-contain" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base mb-2 text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
