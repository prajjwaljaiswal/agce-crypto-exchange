import { useCallback, useEffect, useRef, useState } from 'react'
import { FEATURE_HUB_ENTRIES, FEATURE_HUB_STROKE, FEATURE_ORBIT_MS } from '../data.js'
import type { FeatureHubId } from '../types.js'

function featureIdFromArcSpinnerDeg(spinnerDeg: number): FeatureHubId {
  let c = (spinnerDeg + 45) % 360
  if (c < 0) c += 360
  if (c < 90) return 'demo'
  if (c < 180) return 'spot'
  if (c < 270) return 'simpleEarn'
  return 'instant'
}

interface ConnectorProps {
  active: boolean
}

function ConnectorTL({ active }: ConnectorProps) {
  const s = active ? FEATURE_HUB_STROKE.on : FEATURE_HUB_STROKE.off
  return (
    <span className="feature-connector-inner feature-connector-inner--tl">
      <svg
        className="feature-connector-lines"
        xmlns="http://www.w3.org/2000/svg"
        width="176"
        height="100"
        viewBox="0 0 176 100"
        fill="none"
        aria-hidden
      >
        <circle cx="10" cy="10" r="9.5" transform="matrix(-1 0 0 1 176 80)" stroke={s} strokeWidth="1" />
        <circle cx="6" cy="6" r="6" transform="matrix(-1 0 0 1 172 84)" fill={s} />
        <path d="M40 20H95.5L159 83.5" stroke={s} strokeWidth="1.5" />
      </svg>
      <img className="feature-connector-badge" src="/images/featuresicon.svg" width="43" height="43" alt="" />
    </span>
  )
}

function ConnectorTR({ active }: ConnectorProps) {
  const s = active ? FEATURE_HUB_STROKE.on : FEATURE_HUB_STROKE.off
  return (
    <span className="feature-connector-inner feature-connector-inner--tr">
      <svg
        className="feature-connector-lines"
        xmlns="http://www.w3.org/2000/svg"
        width="176"
        height="100"
        viewBox="0 0 176 100"
        fill="none"
        aria-hidden
      >
        <circle cx="10" cy="90" r="9.5" stroke={s} strokeWidth="1" />
        <circle cx="10" cy="90" r="6" fill={s} />
        <path d="M136 20H80.5L17 83.5" stroke={s} strokeWidth="1.5" />
      </svg>
      <img className="feature-connector-badge" src="/images/featuresicon2.svg" width="43" height="43" alt="" />
    </span>
  )
}

function ConnectorBL({ active }: ConnectorProps) {
  const s = active ? FEATURE_HUB_STROKE.on : FEATURE_HUB_STROKE.off
  return (
    <span className="feature-connector-inner feature-connector-inner--bl">
      <svg
        className="feature-connector-lines"
        xmlns="http://www.w3.org/2000/svg"
        width="176"
        height="100"
        viewBox="0 0 176 100"
        fill="none"
        aria-hidden
      >
        <circle cx="166" cy="10" r="9.5" stroke={s} strokeWidth="1" />
        <circle cx="166" cy="10" r="6" fill={s} />
        <path d="M40 80H95.5L159 16.5" stroke={s} strokeWidth="1.5" />
      </svg>
      <img className="feature-connector-badge" src="/images/featuresicon3.svg" width="43" height="43" alt="" />
    </span>
  )
}

function ConnectorBR({ active }: ConnectorProps) {
  const s = active ? FEATURE_HUB_STROKE.on : FEATURE_HUB_STROKE.off
  return (
    <span className="feature-connector-inner feature-connector-inner--br">
      <svg
        className="feature-connector-lines"
        xmlns="http://www.w3.org/2000/svg"
        width="176"
        height="100"
        viewBox="0 0 176 100"
        fill="none"
        aria-hidden
      >
        <circle cx="10" cy="10" r="9.5" stroke={s} strokeWidth="1" />
        <circle cx="6" cy="6" r="6" fill={s} />
        <path d="M136 80H80.5L17 16.5" stroke={s} strokeWidth="1.5" />
      </svg>
      <img className="feature-connector-badge" src="/images/featuresicon4.svg" width="43" height="43" alt="" />
    </span>
  )
}

function ArcRing({ arcSpinnerRef }: { arcSpinnerRef: React.RefObject<HTMLDivElement | null> }) {
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

const COPY_BY_ID = Object.fromEntries(FEATURE_HUB_ENTRIES.map((e) => [e.id, e])) as Record<
  FeatureHubId,
  (typeof FEATURE_HUB_ENTRIES)[number]
>

const INITIAL_ID: FeatureHubId = 'simpleEarn'

export function FeatureHub() {
  const [activeFeatureId, setActiveFeatureId] = useState<FeatureHubId>(INITIAL_ID)
  const arcSpinnerRef = useRef<HTMLDivElement>(null)
  const orbitEpochRef = useRef<number>(
    Date.now() - (COPY_BY_ID[INITIAL_ID].spinnerAngle / 360) * FEATURE_ORBIT_MS,
  )
  const lastIdRef = useRef<FeatureHubId>(INITIAL_ID)

  const alignOrbitToFeature = useCallback((id: FeatureHubId) => {
    const deg = COPY_BY_ID[id].spinnerAngle
    orbitEpochRef.current = Date.now() - (deg / 360) * FEATURE_ORBIT_MS
    setActiveFeatureId(id)
    lastIdRef.current = id
    if (arcSpinnerRef.current) {
      arcSpinnerRef.current.style.transform = `rotate(${deg}deg)`
    }
  }, [])

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      requestAnimationFrame(() => {
        if (arcSpinnerRef.current) {
          arcSpinnerRef.current.style.transform = `rotate(${COPY_BY_ID[INITIAL_ID].spinnerAngle}deg)`
        }
      })
      return
    }

    let raf = 0
    const loop = () => {
      const elapsed = (Date.now() - orbitEpochRef.current) % FEATURE_ORBIT_MS
      const deg = (elapsed / FEATURE_ORBIT_MS) * 360
      if (arcSpinnerRef.current) {
        arcSpinnerRef.current.style.transform = `rotate(${deg}deg)`
      }
      const id = featureIdFromArcSpinnerDeg(deg)
      if (id !== lastIdRef.current) {
        lastIdRef.current = id
        setActiveFeatureId(id)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="trade_earn_section">
      <div className="container">
        <div className="features_bage">Platform Features</div>
        <h2>Learn, Trade, Earn &amp; Withdraw</h2>

        <div className="features-card features-hub mb-5 pb-5">
          <div className="align-items-center row g-4">
            <div className="col-md-4 order-2 order-md-1">
              <div className="feature-left animate-fade-in ps-md-4 pe-md-4 pt-md-5">
                <button
                  type="button"
                  className={`feature-item${activeFeatureId === 'instant' ? ' is-active' : ''}`}
                  aria-pressed={activeFeatureId === 'instant'}
                  onClick={() => alignOrbitToFeature('instant')}
                >
                  <h3>{COPY_BY_ID.instant.title}</h3>
                  <p>{COPY_BY_ID.instant.text}</p>
                </button>
                <button
                  type="button"
                  className={`feature-item${activeFeatureId === 'simpleEarn' ? ' is-active' : ''}`}
                  aria-pressed={activeFeatureId === 'simpleEarn'}
                  onClick={() => alignOrbitToFeature('simpleEarn')}
                >
                  <h3>{COPY_BY_ID.simpleEarn.title}</h3>
                  <p>{COPY_BY_ID.simpleEarn.text}</p>
                </button>
              </div>
            </div>

            <div className="col-md-4 order-1 order-md-2">
              <div className="features-hub-center position-relative text-center animate-zoom-in d-flex align-items-center justify-content-center">
                <div className="center-image-wrapper">
                  <ArcRing arcSpinnerRef={arcSpinnerRef} />
                  <img
                    alt="Platform features"
                    className="center-image"
                    src="/images/cryoto_earn_cntr.png"
                  />
                </div>

                <button
                  type="button"
                  className={`feature-connector-hit top-left-pos${activeFeatureId === 'instant' ? ' is-active' : ''}`}
                  aria-label={COPY_BY_ID.instant.title}
                  aria-pressed={activeFeatureId === 'instant'}
                  onClick={() => alignOrbitToFeature('instant')}
                >
                  <ConnectorTL active={activeFeatureId === 'instant'} />
                </button>
                <button
                  type="button"
                  className={`feature-connector-hit top-right-pos${activeFeatureId === 'demo' ? ' is-active' : ''}`}
                  aria-label={COPY_BY_ID.demo.title}
                  aria-pressed={activeFeatureId === 'demo'}
                  onClick={() => alignOrbitToFeature('demo')}
                >
                  <ConnectorTR active={activeFeatureId === 'demo'} />
                </button>
                <button
                  type="button"
                  className={`feature-connector-hit bottom-left-pos${activeFeatureId === 'simpleEarn' ? ' is-active' : ''}`}
                  aria-label={COPY_BY_ID.simpleEarn.title}
                  aria-pressed={activeFeatureId === 'simpleEarn'}
                  onClick={() => alignOrbitToFeature('simpleEarn')}
                >
                  <ConnectorBL active={activeFeatureId === 'simpleEarn'} />
                </button>
                <button
                  type="button"
                  className={`feature-connector-hit bottom-right-pos${activeFeatureId === 'spot' ? ' is-active' : ''}`}
                  aria-label={COPY_BY_ID.spot.title}
                  aria-pressed={activeFeatureId === 'spot'}
                  onClick={() => alignOrbitToFeature('spot')}
                >
                  <ConnectorBR active={activeFeatureId === 'spot'} />
                </button>
              </div>
            </div>

            <div className="col-md-4 order-3">
              <div className="feature-right animate-fade-in ps-md-4 pe-md-4 pt-md-5">
                <button
                  type="button"
                  className={`feature-item${activeFeatureId === 'demo' ? ' is-active' : ''}`}
                  aria-pressed={activeFeatureId === 'demo'}
                  onClick={() => alignOrbitToFeature('demo')}
                >
                  <h3>{COPY_BY_ID.demo.title}</h3>
                  <p>{COPY_BY_ID.demo.text}</p>
                </button>
                <button
                  type="button"
                  className={`feature-item${activeFeatureId === 'spot' ? ' is-active' : ''}`}
                  aria-pressed={activeFeatureId === 'spot'}
                  onClick={() => alignOrbitToFeature('spot')}
                >
                  <h3>{COPY_BY_ID.spot.title}</h3>
                  <p>{COPY_BY_ID.spot.text}</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
