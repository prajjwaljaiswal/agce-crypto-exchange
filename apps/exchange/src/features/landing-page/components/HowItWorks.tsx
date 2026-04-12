import { STEPS } from '../data/index.js'

export function HowItWorks() {
  return (
    <section style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="pb-20" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="text-center pt-16 pb-12">
            <h2
              className="text-[52px] font-semibold leading-[1.05] mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              How it works
            </h2>
            <p
              className="text-lg leading-6"
              style={{ color: 'var(--color-text-muted)' }}
            >
              A powerful crypto platform designed for speed, security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ number, icon, title, description }) => (
              <div
                key={number}
                className="flex flex-col items-center text-center rounded-[20px] pt-10 pb-10 px-6"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div className="flex items-center justify-center mb-5 w-[200px] h-[200px]">
                  <img src={icon} alt={title} className="w-[180px] h-[180px] object-contain" />
                </div>

                <p
                  className="text-sm mb-2 leading-[1.25]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {number}
                </p>
                <h3
                  className="text-2xl font-bold mb-3 leading-[1.25]"
                  style={{ color: 'var(--color-text)' }}
                >
                  {title}
                </h3>
                <p
                  className="text-base leading-[1.5] max-w-[335px]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
