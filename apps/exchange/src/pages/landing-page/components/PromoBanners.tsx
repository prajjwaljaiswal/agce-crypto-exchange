import { BANNERS } from '../data/index.js'

export function PromoBanners() {
  return (
    <section className="bg-[#0E0E0E] pt-4 pb-6">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {BANNERS.map(({ id, src, alt }) => (
            <a
              key={id}
              href="#"
              className="block rounded-2xl overflow-hidden"
              style={{ aspectRatio: '358/150' }}
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform hover:scale-105"
                loading="lazy"
                draggable={false}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
