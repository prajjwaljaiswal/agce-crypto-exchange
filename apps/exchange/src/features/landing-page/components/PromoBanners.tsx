import { useEffect, useRef, useState } from 'react'
import { PROMO_SLIDES } from '../data.js'

const AUTOPLAY_MS = 5500

export function PromoBanners() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const total = PROMO_SLIDES.length
  const perView = useSlidesPerView()
  const pageCount = Math.max(1, total - perView + 1)

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % pageCount)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [pageCount])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const slideWidth = track.clientWidth / perView
    track.style.transform = `translateX(-${activeIndex * slideWidth}px)`
  }, [activeIndex, perView])

  return (
    <section className="cardbnr_crypto_section" aria-label="Promotional banners">
      <div className="container">
        <div className="cardbnr_crypto_slide">
          <div className="cardbnr_crypto_slick" style={{ overflow: 'hidden' }}>
            <div
              ref={trackRef}
              style={{
                display: 'flex',
                transition: 'transform 450ms ease',
                willChange: 'transform',
              }}
            >
              {PROMO_SLIDES.map((slide) => (
                <div
                  key={slide.id}
                  style={{ flex: `0 0 ${100 / perView}%`, padding: '0 8px' }}
                >
                  <div className="cardbnr_slide_inner">
                    <img src={slide.src} alt={slide.alt} loading="lazy" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ul className="slick-dots cardbnr_slick_dots">
            {Array.from({ length: pageCount }).map((_, i) => (
              <li key={i} className={i === activeIndex ? 'slick-active' : ''}>
                <button
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setActiveIndex(i)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function useSlidesPerView(): number {
  const [perView, setPerView] = useState(() => computePerView())
  useEffect(() => {
    const onResize = () => setPerView(computePerView())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return perView
}

function computePerView(): number {
  if (typeof window === 'undefined') return 4
  const w = window.innerWidth
  if (w < 576) return 1
  if (w < 992) return 2
  if (w < 1399) return 3
  return 4
}
