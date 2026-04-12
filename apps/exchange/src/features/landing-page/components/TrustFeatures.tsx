import { TRUST_ITEMS } from '../data/index.js'

export function TrustFeatures() {
  return (
    <section
      className="py-16 lg:py-24"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-12">
          <p
            className="text-[40px] font-bold leading-[54.6px] mb-0"
            style={{ color: 'var(--color-text)' }}
          >
            <span className="block">ARAB GLOBAL Trade</span>
          </p>
          <p
            className="text-[40px] font-semibold leading-[54.6px]"
            style={{ color: 'var(--color-text)' }}
          >
            Tour Safe and Trusted Crypto Exchange
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRUST_ITEMS.map(({ img, title, description }) => (
            <div
              key={title}
              className="rounded-3xl overflow-hidden flex flex-col"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.05)',
              }}
            >
              <div
                className="flex items-center justify-center overflow-hidden"
                style={{ height: '280px', padding: '24px 24px 0' }}
              >
                <img
                  src={img}
                  alt={title}
                  className="w-full max-h-[260px] object-contain"
                  style={{ objectPosition: 'center bottom' }}
                />
              </div>

              <div className="px-8 pb-8 pt-4 text-center">
                <h3
                  className="text-[30px] font-semibold mb-3 leading-[48px]"
                  style={{ color: 'var(--color-text)' }}
                >
                  {title}
                </h3>
                <p
                  className="text-base leading-6"
                  style={{ color: 'var(--color-text-muted)' }}
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
