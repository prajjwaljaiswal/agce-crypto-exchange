import { useState, useEffect, useRef } from 'react'
import {
  useMoneyFlow,
  useKlineInflow,
  useFuturesStat,
  toGrowthSeries,
} from './hooks.js'
import { fmtFlowNum, fmtUsdCompact, parseBase } from './format.js'
import type { FlowTimeframe, PieSlice } from './types.js'

const FLOW_COLORS = {
  largeBuy: '#0F8F62',
  mediumBuy: '#2EBD85',
  smallBuy: '#78D6AC',
  largeSell: '#D9304E',
  mediumSell: '#F6465D',
  smallSell: '#FF99A0',
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 mb-2">
      <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{children}</div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-text-muted)' }}>
        <path d="M12 1.6c5.744 0 10.4 4.656 10.4 10.4 0 5.744-4.656 10.4-10.4 10.4-5.744 0-10.4-4.656-10.4-10.4C1.6 6.256 6.256 1.6 12 1.6zm0 1.8A8.6 8.6 0 003.4 12a8.6 8.6 0 008.6 8.6 8.6 8.6 0 008.6-8.6A8.6 8.6 0 0012 3.4zm0 6.3a.9.9 0 01.9.9v6a.9.9 0 01-1.8 0v-6a.9.9 0 01.9-.9zm0-3.1a1 1 0 110 2 1 1 0 010-2z"/>
      </svg>
    </div>
  )
}

function TimeframeTabs<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1">
      {options.map(o => (
        <button
          key={o}
          className="text-xs px-2 py-0.5 rounded"
          style={{
            color: value === o ? 'var(--color-text)' : 'var(--color-text-muted)',
            background: value === o ? 'var(--color-surface-2)' : 'transparent',
          }}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function AreaChart({ points, color, height = 130, showZero = true }: { points: number[]; color: string; height?: number; showZero?: boolean }) {
  if (points.length === 0) return <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>No data</div>
  const w = 360
  const pad = 4
  const max = Math.max(...points, 0)
  const min = Math.min(...points, 0)
  const range = max - min || 1
  const zeroY = pad + ((max - 0) / range) * (height - pad * 2)
  const coords = points.map((v, i) => {
    const x = pad + (i / Math.max(1, points.length - 1)) * (w - pad * 2)
    const y = pad + ((max - v) / range) * (height - pad * 2)
    return [x, y] as const
  })
  const linePath = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  const areaPath = `${linePath} L ${coords[coords.length - 1][0]} ${zeroY} L ${coords[0][0]} ${zeroY} Z`
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      {showZero && <line x1={pad} x2={w - pad} y1={zeroY} y2={zeroY} stroke="var(--color-border)" strokeDasharray="2 2" />}
      <path d={areaPath} fill={color} fillOpacity="0.15" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function DailyBars({ values }: { values: { label: string; value: number }[] }) {
  const maxAbs = Math.max(...values.map(v => Math.abs(v.value)), 1)
  return (
    <div className="flex items-end gap-3 h-[132px] w-full">
      {values.map((v, i) => {
        const h = (Math.abs(v.value) / maxAbs) * 60
        const pos = v.value >= 0
        return (
          <div key={i} className="flex flex-col items-center flex-1 h-full justify-center">
            {pos ? (
              <div className="flex flex-col items-center justify-end h-1/2 w-full">
                <div className="text-[10px] font-medium" style={{ color: '#2EBD85' }}>{fmtFlowNum(v.value)}</div>
                <div className="w-full max-w-[18px] rounded-t" style={{ background: '#2EBD85', height: h }} />
              </div>
            ) : <div className="h-1/2" />}
            {!pos ? (
              <div className="flex flex-col items-center justify-start h-1/2 w-full">
                <div className="w-full max-w-[18px] rounded-b" style={{ background: '#F6465D', height: h }} />
                <div className="text-[10px] font-medium" style={{ color: '#F6465D' }}>{fmtFlowNum(v.value)}</div>
              </div>
            ) : <div className="h-1/2" />}
          </div>
        )
      })}
    </div>
  )
}

function PieChart({ slices, size = 180, animationKey }: { slices: PieSlice[]; size?: number; animationKey?: string | number }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0)

  // Draw-in sweep progress: only resets when animationKey changes
  // (mount, symbol switch, timeframe switch) — NOT on live value updates.
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    setProgress(0)
    let raf = 0
    const start = performance.now()
    const duration = 800
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [animationKey])

  // Smooth value interpolation between live updates so slices morph rather
  // than snap on each recompute.
  const targetRef = useRef<number[]>(slices.map(s => s.value))
  const [display, setDisplay] = useState<number[]>(() => slices.map(s => s.value))
  useEffect(() => {
    targetRef.current = slices.map(s => s.value)
    if (display.length !== targetRef.current.length) {
      setDisplay(targetRef.current.slice())
      return
    }
    let raf = 0
    const tick = () => {
      let done = true
      const next = display.map((v, i) => {
        const t = targetRef.current[i] ?? 0
        const diff = t - v
        if (Math.abs(diff) > Math.max(0.0001, Math.abs(t) * 0.002)) {
          done = false
          return v + diff * 0.2
        }
        return t
      })
      setDisplay(next)
      if (!done) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slices])

  if (total <= 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size, color: 'var(--color-text-muted)' }}>
        <span className="text-xs">No flow data</span>
      </div>
    )
  }
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 4
  const rInner = r * 0.6
  const sweepMax = -Math.PI / 2 + progress * Math.PI * 2
  const displayTotal = display.reduce((s, v) => s + v, 0) || total
  let acc = 0
  const paths = slices.map((s, i) => {
    const value = display[i] ?? s.value
    if (value <= 0) return null
    const startAngle = (acc / displayTotal) * Math.PI * 2 - Math.PI / 2
    acc += value
    const fullEndAngle = (acc / displayTotal) * Math.PI * 2 - Math.PI / 2
    if (startAngle >= sweepMax) return null
    const endAngle = Math.min(fullEndAngle, sweepMax)
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
    const x0 = cx + r * Math.cos(startAngle)
    const y0 = cy + r * Math.sin(startAngle)
    const x1 = cx + r * Math.cos(endAngle)
    const y1 = cy + r * Math.sin(endAngle)
    const xi1 = cx + rInner * Math.cos(endAngle)
    const yi1 = cy + rInner * Math.sin(endAngle)
    const xi0 = cx + rInner * Math.cos(startAngle)
    const yi0 = cy + rInner * Math.sin(startAngle)
    const d = `M ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${rInner} ${rInner} 0 ${largeArc} 0 ${xi0} ${yi0} Z`
    const isComplete = fullEndAngle <= sweepMax
    const midAngle = (startAngle + fullEndAngle) / 2
    const labelR = r + 14
    const lx = cx + labelR * Math.cos(midAngle)
    const ly = cy + labelR * Math.sin(midAngle)
    const pct = ((value / displayTotal) * 100).toFixed(2)
    return (
      <g key={i}>
        <path d={d} fill={s.color} />
        {isComplete && (
          <text
            x={lx}
            y={ly}
            textAnchor={lx > cx ? 'start' : 'end'}
            dominantBaseline="middle"
            fontSize="10"
            fill="var(--color-text-muted)"
            style={{ opacity: Math.min(1, (progress - fullEndAngle / (Math.PI * 2) - 0.25) * 6 + 1) }}
          >
            {pct}%
          </text>
        )}
      </g>
    )
  })
  return (
    <svg width={size + 60} height={size} viewBox={`${-30} 0 ${size + 60} ${size}`}>
      {paths}
    </svg>
  )
}

function StatChart({
  title,
  points,
  available,
  valueFormat,
  color = '#F0B90B',
  showZero = false,
}: {
  title: string
  points: number[]
  available: boolean
  valueFormat: (n: number) => string
  color?: string
  showZero?: boolean
}) {
  const latest = points.length ? points[points.length - 1] : null
  const first = points.length ? points[0] : null
  const delta = latest != null && first != null && first !== 0 ? ((latest - first) / Math.abs(first)) * 100 : null
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      {available && points.length > 0 ? (
        <>
          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
              {latest != null ? valueFormat(latest) : '—'}
            </div>
            {delta != null && (
              <div className="text-xs" style={{ color: delta >= 0 ? '#2EBD85' : '#F6465D' }}>
                {delta >= 0 ? '+' : ''}{delta.toFixed(2)}% 24h
              </div>
            )}
          </div>
          <AreaChart points={points} color={color} height={140} showZero={showZero} />
        </>
      ) : (
        <div className="text-xs py-8 text-center rounded" style={{ color: 'var(--color-text-muted)', border: '1px dashed var(--color-border)' }}>
          No futures data for this symbol
        </div>
      )}
    </div>
  )
}

export function TradingDataPanel({ symbol }: { symbol: string }) {
  const base = parseBase(symbol)

  const [flowTf, setFlowTf] = useState<FlowTimeframe>('15m')
  const { flow, loading: flowLoading } = useMoneyFlow(symbol, flowTf)
  const hourly = useKlineInflow(symbol, '1h', 24)
  const daily = useKlineInflow(symbol, '1d', 5)

  // Futures-sourced proxies for Margin metrics + Platform Concentration
  const oi = useFuturesStat(symbol, 'openInterestHist', 'sumOpenInterestValue', '1h', 24)
  const longShort = useFuturesStat(symbol, 'globalLongShortAccountRatio', 'longShortRatio', '1h', 24)
  const topLongShort = useFuturesStat(symbol, 'topLongShortPositionRatio', 'longShortRatio', '1h', 24)

  const oiGrowthSeries = toGrowthSeries(oi.data)
  const longShortSeries = longShort.data.map(p => p.value)
  const topLongShortSeries = topLongShort.data.map(p => p.value)
  const oiValueSeries = oi.data.map(p => p.value)

  const slices: PieSlice[] = flow ? [
    { label: 'Large Sells', value: flow.large.sell, color: FLOW_COLORS.largeSell },
    { label: 'Medium Sells', value: flow.medium.sell, color: FLOW_COLORS.mediumSell },
    { label: 'Small Sells', value: flow.small.sell, color: FLOW_COLORS.smallSell },
    { label: 'Small Buys', value: flow.small.buy, color: FLOW_COLORS.smallBuy },
    { label: 'Medium Buys', value: flow.medium.buy, color: FLOW_COLORS.mediumBuy },
    { label: 'Large Buys', value: flow.large.buy, color: FLOW_COLORS.largeBuy },
  ] : []

  const totalBuy = flow ? flow.large.buy + flow.medium.buy + flow.small.buy : 0
  const totalSell = flow ? flow.large.sell + flow.medium.sell + flow.small.sell : 0

  const dailyValues = daily.map((d, i) => ({
    label: new Date(d.openTime).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
    value: d.inflow,
    key: i,
  }))
  const dailySum = daily.reduce((s, d) => s + d.inflow, 0)

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: 'var(--color-surface)' }}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column */}
        <div className="flex-1 md:w-1/2 overflow-hidden space-y-6">
          {/* Money Flow Analysis */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionTitle>Money Flow Analysis</SectionTitle>
              <TimeframeTabs
                options={['15m', '30m', '1h', '2h', '4h', '1d'] as FlowTimeframe[]}
                value={flowTf}
                onChange={setFlowTf}
              />
            </div>
            <div className="flex flex-col items-center justify-center mb-4">
              {flowLoading && !flow ? (
                <div className="text-xs py-8" style={{ color: 'var(--color-text-muted)' }}>Loading…</div>
              ) : (
                <PieChart slices={slices} size={180} animationKey={`${symbol}|${flowTf}`} />
              )}
            </div>
            <div className="rounded-xl p-3 text-xs" style={{ border: '1px solid var(--color-border)' }}>
              <div className="flex mb-3" style={{ color: 'var(--color-text-muted)' }}>
                <div className="w-[26%]">Orders</div>
                <div className="w-[26%]">Buy ({base})</div>
                <div className="w-[26%]">Sell ({base})</div>
                <div className="w-[22%] text-right">Inflow</div>
              </div>
              {(['large', 'medium', 'small'] as const).map(k => {
                const labelMap = { large: 'Large', medium: 'Medium', small: 'Small' }
                const buyColor = k === 'large' ? FLOW_COLORS.largeBuy : k === 'medium' ? FLOW_COLORS.mediumBuy : FLOW_COLORS.smallBuy
                const sellColor = k === 'large' ? FLOW_COLORS.largeSell : k === 'medium' ? FLOW_COLORS.mediumSell : FLOW_COLORS.smallSell
                const b = flow?.[k]?.buy ?? 0
                const s = flow?.[k]?.sell ?? 0
                return (
                  <div key={k} className="flex mb-2" style={{ color: 'var(--color-text)' }}>
                    <div className="w-[26%]">{labelMap[k]}</div>
                    <div className="w-[26%] flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-sm" style={{ background: buyColor }} />
                      {fmtFlowNum(b)}
                    </div>
                    <div className="w-[26%] flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-sm" style={{ background: sellColor }} />
                      {fmtFlowNum(s)}
                    </div>
                    <div className="w-[22%] text-right" style={{ color: b - s >= 0 ? '#2EBD85' : '#F6465D' }}>
                      {b - s >= 0 ? '+' : ''}{fmtFlowNum(b - s)}
                    </div>
                  </div>
                )
              })}
              <div className="flex pt-2" style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                <div className="w-[26%]">Total</div>
                <div className="w-[26%]">{fmtFlowNum(totalBuy)}</div>
                <div className="w-[26%]">{fmtFlowNum(totalSell)}</div>
                <div className="w-[22%] text-right" style={{ color: totalBuy - totalSell >= 0 ? '#2EBD85' : '#F6465D' }}>
                  {totalBuy - totalSell >= 0 ? '+' : ''}{fmtFlowNum(totalBuy - totalSell)}
                </div>
              </div>
            </div>
          </div>

          {/* 5-day large inflow bars */}
          <div>
            <SectionTitle>5 x 24hr Large Inflow ({base})</SectionTitle>
            <div className="flex gap-1 my-2 text-xs">
              <span style={{ color: 'var(--color-text-muted)' }}>5 days net inflow:</span>
              <span style={{ color: dailySum >= 0 ? '#2EBD85' : '#F6465D' }}>
                {dailySum >= 0 ? '+' : ''}{fmtFlowNum(dailySum)}
              </span>
            </div>
            <DailyBars values={dailyValues} />
          </div>

          {/* 24h inflow area chart */}
          <div>
            <SectionTitle>24hr Large Inflow ({base})</SectionTitle>
            <div className="mt-2">
              <AreaChart points={hourly.map(h => h.inflow)} color="#F0B90B" height={150} />
            </div>
          </div>

          <StatChart
            title={`Platform Concentration (${base})`}
            points={oiValueSeries}
            available={oi.available}
            valueFormat={v => fmtUsdCompact(v)}
            color="#2EBD85"
          />
        </div>

        {/* Right column */}
        <div className="flex-1 md:w-1/2 overflow-hidden space-y-6">
          <StatChart
            title="Margin Debt Growth"
            points={oiGrowthSeries}
            available={oi.available}
            valueFormat={v => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`}
            showZero
          />
          <StatChart
            title="Margin Long-short Positions Ratio"
            points={longShortSeries}
            available={longShort.available}
            valueFormat={v => v.toFixed(4)}
          />
          <StatChart
            title="Isolated Margin Borrow Amount Ratio"
            points={topLongShortSeries}
            available={topLongShort.available}
            valueFormat={v => v.toFixed(4)}
          />
        </div>
      </div>
    </div>
  )
}
