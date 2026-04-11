const banners = [
  { id: 1, src: '/images/add_banner_img.jpg', alt: 'Promotion 1' },
  { id: 2, src: '/images/add_banner_img2.jpg', alt: 'Promotion 2' },
  { id: 3, src: '/images/add_banner_img3.jpg', alt: 'Promotion 3' },
  { id: 4, src: '/images/add_banner_img4.jpg', alt: 'Promotion 4' },
]

export function PromoBanners() {
  return (
    <section style={{ backgroundColor: '#0E0E0E', paddingTop: '16px', paddingBottom: '24px' }}>
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {banners.map(({ id, src, alt }) => (
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
                draggable={false}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
