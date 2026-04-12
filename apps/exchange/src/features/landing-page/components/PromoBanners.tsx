import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BANNERS } from '../data/index.js'

const AUTOPLAY_MS = 4000

export function PromoBanners() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // Auto-advance
  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNERS.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused])

  // Scroll to current slide when index changes
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const slide = track.children[index] as HTMLElement | undefined
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' })
    }
  }, [index])

  const go = (delta: number) => {
    setIndex((prev) => (prev + delta + BANNERS.length) % BANNERS.length)
  }

  return (
    <section
      className="relative z-20 -mt-20 sm:-mt-24 md:-mt-28 lg:-mt-32 pt-10 sm:pt-14 lg:pt-16 pb-12"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* Track — scroll-snap + responsive slide widths */}
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
            style={{ scrollbarWidth: 'none' }}
          >
            {BANNERS.map(({ id, src, alt }) => (
              <a
                key={id}
                href="#"
                className="snap-start shrink-0 block rounded-2xl overflow-hidden w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
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

          {/* Prev / Next arrows — hidden on very small screens */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous banner"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 lg:-translate-x-4 items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next banner"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 lg:translate-x-4 items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {BANNERS.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to banner ${i + 1}`}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: index === i ? 24 : 8,
                backgroundColor: index === i ? '#D1AA67' : '#4a4a4a',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
