import { useState, useRef, useEffect, useCallback } from 'react'

type FeatureId = 'instant' | 'simpleEarn' | 'demo' | 'spot'

const FEATURE_HUB_COPY: Record<FeatureId, { title: string; text: string }> = {
  instant: {
    title: 'Instant Withdrawals',
    text: 'Get your funds instantly, anytime you need them.',
  },
  simpleEarn: {
    title: 'Simple Earn',
    text: 'Grow your idle assets with up to 42% APR returns.',
  },
  demo: {
    title: 'Demo Trading',
    text: 'Learn crypto trading at 0% cost before investing real money.',
  },
  spot: {
    title: 'Spot Trading',
    text: 'Buy and sell crypto instantly with live market prices.',
  },
}

const FEATURE_HUB_STROKE = { on: '#D1AA67', off: '#C5CAD3' }

/** One full orbit duration (ms). */
const FEATURE_ORBIT_MS = 14000

/** Spinner rotation (deg) where the 90° arc midpoint sits on each connector side. */
const FEATURE_SPINNER_ANGLE: Record<FeatureId, number> = {
  demo: 0,
  spot: 90,
  simpleEarn: 180,
  instant: 270,
}

function featureIdFromArcSpinnerDeg(spinnerDeg: number): FeatureId {
  let c = (spinnerDeg + 45) % 360
  if (c < 0) c += 360
  if (c < 90) return 'demo'
  if (c < 180) return 'spot'
  if (c < 270) return 'simpleEarn'
  return 'instant'
}

function FeatureConnectorTL({ active }: { active: boolean }) {
  const s = active ? FEATURE_HUB_STROKE.on : FEATURE_HUB_STROKE.off
  return (
    <span className="feature-connector-inner feature-connector-inner--tl">
      <svg className="feature-connector-lines" xmlns="http://www.w3.org/2000/svg" width="176" height="100" viewBox="0 0 176 100" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="9.5" transform="matrix(-1 0 0 1 176 80)" stroke={s} strokeWidth="1" />
        <circle cx="6" cy="6" r="6" transform="matrix(-1 0 0 1 172 84)" fill={s} />
        <path d="M40 20H95.5L159 83.5" stroke={s} strokeWidth="1.5" />
      </svg>
      <img className="feature-connector-badge" src="/images/featuresicon.svg" width="43" height="43" alt="" />
    </span>
  )
}

function FeatureConnectorTR({ active }: { active: boolean }) {
  const s = active ? FEATURE_HUB_STROKE.on : FEATURE_HUB_STROKE.off
  return (
    <span className="feature-connector-inner feature-connector-inner--tr">
      <svg className="feature-connector-lines" xmlns="http://www.w3.org/2000/svg" width="176" height="100" viewBox="0 0 176 100" fill="none" aria-hidden>
        <circle cx="10" cy="90" r="9.5" stroke={s} strokeWidth="1" />
        <circle cx="10" cy="90" r="6" fill={s} />
        <path d="M136 20H80.5L17 83.5" stroke={s} strokeWidth="1.5" />
      </svg>
      <img className="feature-connector-badge" src="/images/featuresicon2.svg" width="43" height="43" alt="" />
    </span>
  )
}

function FeatureConnectorBL({ active }: { active: boolean }) {
  const s = active ? FEATURE_HUB_STROKE.on : FEATURE_HUB_STROKE.off
  return (
    <span className="feature-connector-inner feature-connector-inner--bl">
      <svg className="feature-connector-lines" xmlns="http://www.w3.org/2000/svg" width="176" height="100" viewBox="0 0 176 100" fill="none" aria-hidden>
        <circle cx="166" cy="10" r="9.5" stroke={s} strokeWidth="1" />
        <circle cx="166" cy="10" r="6" fill={s} />
        <path d="M40 80H95.5L159 16.5" stroke={s} strokeWidth="1.5" />
      </svg>
      <img className="feature-connector-badge" src="/images/featuresicon3.svg" width="43" height="43" alt="" />
    </span>
  )
}

function FeatureConnectorBR({ active }: { active: boolean }) {
  const s = active ? FEATURE_HUB_STROKE.on : FEATURE_HUB_STROKE.off
  return (
    <span className="feature-connector-inner feature-connector-inner--br">
      <svg className="feature-connector-lines" xmlns="http://www.w3.org/2000/svg" width="176" height="100" viewBox="0 0 176 100" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="9.5" stroke={s} strokeWidth="1" />
        <circle cx="6" cy="6" r="6" fill={s} />
        <path d="M136 80H80.5L17 16.5" stroke={s} strokeWidth="1.5" />
      </svg>
      <img className="feature-connector-badge" src="/images/featuresicon4.svg" width="43" height="43" alt="" />
    </span>
  )
}

/** Rounded 90° gold arc; rotated via ref + rAF in parent to track the active feature. */
function FeatureHubArcRing({ arcSpinnerRef }: { arcSpinnerRef: React.RefObject<HTMLDivElement | null> }) {
  const r = 96
  const circumference = 2 * Math.PI * r
  const arcLen = (circumference * 90) / 360

  return (
    <div ref={arcSpinnerRef} className="feature-hub-arc-spinner">
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="#D1AA67"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${arcLen} ${circumference}`}
          transform="rotate(-90 100 100)"
        />
      </svg>
    </div>
  )
}

export function PlatformFeatures() {
  const [activeFeatureId, setActiveFeatureId] = useState<FeatureId>('simpleEarn')
  const featureOrbitEpochRef = useRef<number>(
    Date.now() - (FEATURE_SPINNER_ANGLE.simpleEarn / 360) * FEATURE_ORBIT_MS,
  )
  const arcSpinnerRef = useRef<HTMLDivElement>(null)
  const featureOrbitLastIdRef = useRef<FeatureId>('simpleEarn')

  const alignOrbitToFeature = useCallback((id: FeatureId) => {
    const deg = FEATURE_SPINNER_ANGLE[id]
    featureOrbitEpochRef.current = Date.now() - (deg / 360) * FEATURE_ORBIT_MS
    setActiveFeatureId(id)
    featureOrbitLastIdRef.current = id
    if (arcSpinnerRef.current) {
      arcSpinnerRef.current.style.transform = `rotate(${deg}deg)`
    }
  }, [])

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      requestAnimationFrame(() => {
        if (arcSpinnerRef.current) {
          arcSpinnerRef.current.style.transform = `rotate(${FEATURE_SPINNER_ANGLE.simpleEarn}deg)`
        }
      })
      return
    }

    let raf: number
    const loop = () => {
      const elapsed = (Date.now() - featureOrbitEpochRef.current) % FEATURE_ORBIT_MS
      const deg = (elapsed / FEATURE_ORBIT_MS) * 360
      if (arcSpinnerRef.current) {
        arcSpinnerRef.current.style.transform = `rotate(${deg}deg)`
      }
      const id = featureIdFromArcSpinnerDeg(deg)
      if (id !== featureOrbitLastIdRef.current) {
        featureOrbitLastIdRef.current = id
        setActiveFeatureId(id)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="trade_earn_section">
      <div className="fhub-container">
        <div className="features_bage">Platform Features</div>
        <h2 className="text-3xl lg:text-4xl font-semibold">
          Learn, Trade, Earn &amp; Withdraw
        </h2>

        <div className="features-card features-hub">
          <div className="fhub-row">

            {/* LEFT */}
            <div className="fhub-col order-2 md-order-1">
              <div className="feature-left fhub-fade-in">
                <button
                  type="button"
                  className={`feature-item${activeFeatureId === 'instant' ? ' is-active' : ''}`}
                  aria-pressed={activeFeatureId === 'instant'}
                  onClick={() => alignOrbitToFeature('instant')}
                >
                  <h3>{FEATURE_HUB_COPY.instant.title}</h3>
                  <p>{FEATURE_HUB_COPY.instant.text}</p>
                </button>
                <button
                  type="button"
                  className={`feature-item${activeFeatureId === 'simpleEarn' ? ' is-active' : ''}`}
                  aria-pressed={activeFeatureId === 'simpleEarn'}
                  onClick={() => alignOrbitToFeature('simpleEarn')}
                >
                  <h3>{FEATURE_HUB_COPY.simpleEarn.title}</h3>
                  <p>{FEATURE_HUB_COPY.simpleEarn.text}</p>
                </button>
              </div>
            </div>

            {/* CENTER HUB */}
            <div className="fhub-col order-1 md-order-2">
              <div className="features-hub-center fhub-zoom-in">
                <div className="center-image-wrapper">
                  <FeatureHubArcRing arcSpinnerRef={arcSpinnerRef} />
                  <img
                    alt="Platform features"
                    className="center-image"
                    src="/images/cryoto_earn_cntr.png"
                  />
                </div>

                <button
                  type="button"
                  className={`feature-connector-hit top-left-pos${activeFeatureId === 'instant' ? ' is-active' : ''}`}
                  aria-label={FEATURE_HUB_COPY.instant.title}
                  aria-pressed={activeFeatureId === 'instant'}
                  onClick={() => alignOrbitToFeature('instant')}
                >
                  <FeatureConnectorTL active={activeFeatureId === 'instant'} />
                </button>
                <button
                  type="button"
                  className={`feature-connector-hit top-right-pos${activeFeatureId === 'demo' ? ' is-active' : ''}`}
                  aria-label={FEATURE_HUB_COPY.demo.title}
                  aria-pressed={activeFeatureId === 'demo'}
                  onClick={() => alignOrbitToFeature('demo')}
                >
                  <FeatureConnectorTR active={activeFeatureId === 'demo'} />
                </button>
                <button
                  type="button"
                  className={`feature-connector-hit bottom-left-pos${activeFeatureId === 'simpleEarn' ? ' is-active' : ''}`}
                  aria-label={FEATURE_HUB_COPY.simpleEarn.title}
                  aria-pressed={activeFeatureId === 'simpleEarn'}
                  onClick={() => alignOrbitToFeature('simpleEarn')}
                >
                  <FeatureConnectorBL active={activeFeatureId === 'simpleEarn'} />
                </button>
                <button
                  type="button"
                  className={`feature-connector-hit bottom-right-pos${activeFeatureId === 'spot' ? ' is-active' : ''}`}
                  aria-label={FEATURE_HUB_COPY.spot.title}
                  aria-pressed={activeFeatureId === 'spot'}
                  onClick={() => alignOrbitToFeature('spot')}
                >
                  <FeatureConnectorBR active={activeFeatureId === 'spot'} />
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="fhub-col order-3">
              <div className="feature-right fhub-fade-in">
                <button
                  type="button"
                  className={`feature-item${activeFeatureId === 'demo' ? ' is-active' : ''}`}
                  aria-pressed={activeFeatureId === 'demo'}
                  onClick={() => alignOrbitToFeature('demo')}
                >
                  <h3>{FEATURE_HUB_COPY.demo.title}</h3>
                  <p>{FEATURE_HUB_COPY.demo.text}</p>
                </button>
                <button
                  type="button"
                  className={`feature-item${activeFeatureId === 'spot' ? ' is-active' : ''}`}
                  aria-pressed={activeFeatureId === 'spot'}
                  onClick={() => alignOrbitToFeature('spot')}
                >
                  <h3>{FEATURE_HUB_COPY.spot.title}</h3>
                  <p>{FEATURE_HUB_COPY.spot.text}</p>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
