import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../../../providers/index.js'
import { useBinanceTicker, useDeepOrderBook } from './hooks.js'
import { fmtDepthQty, parseBase } from './format.js'
import { SymbolInfoPanel } from './SymbolInfoPanel.js'
import { TradingDataPanel } from './TradingDataPanel.js'
import type { MultiLayout } from './types.js'

// ─── TradingView Advanced Chart Widget ───────────────────────────────────────

// Map IANA zones that Intl may return (often deprecated aliases on Windows)
// to the names TradingView's widget actually recognizes.
const TZ_ALIASES: Record<string, string> = {
  'Asia/Calcutta': 'Asia/Kolkata',
  'Asia/Katmandu': 'Asia/Kathmandu',
  'Asia/Saigon': 'Asia/Ho_Chi_Minh',
  'Asia/Rangoon': 'Asia/Yangon',
  'America/Buenos_Aires': 'America/Argentina/Buenos_Aires',
  'Atlantic/Faeroe': 'Atlantic/Reykjavik',
  'Europe/Kiev': 'Europe/Kyiv',
}

function getLocalTZ(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Etc/UTC'
    return TZ_ALIASES[tz] ?? tz
  } catch {
    return 'Etc/UTC'
  }
}

function TVChartWidget({ symbol, theme }: { symbol: string; theme: 'light' | 'dark' }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timezone = getLocalTZ()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    // Fully clear previous iframe + script so the embed widget re-evaluates
    // config instead of reusing a cached iframe.
    while (container.firstChild) container.removeChild(container.firstChild)

    const wrapper = document.createElement('div')
    wrapper.className = 'tradingview-widget-container__widget'
    wrapper.style.height = '100%'
    wrapper.style.width = '100%'

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${symbol}`,
      interval: '60',
      timezone,
      theme,
      style: '1',
      locale: 'en',
      allow_symbol_change: false,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      hide_volume: false,
      withdateranges: false,
      backgroundColor: theme === 'dark' ? '#0d0d0d' : '#ffffff',
      gridColor: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)',
      studies: ['MASimple@tv-basicstudies', 'MASimple@tv-basicstudies'],
    })

    container.appendChild(wrapper)
    container.appendChild(script)

    return () => {
      while (container.firstChild) container.removeChild(container.firstChild)
    }
  }, [symbol, theme, timezone])

  return (
    <div
      key={`${symbol}|${theme}|${timezone}`}
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ height: '100%', width: '100%' }}
    />
  )
}

// ─── Depth Chart ─────────────────────────────────────────────────────────────

interface DepthHover {
  side: 'bid' | 'ask'
  price: number
  cum: number
  pxX: number
  pxY: number
}

function DepthChart({ symbol }: { symbol: string }) {
  const { bids, asks } = useDeepOrderBook(symbol, 5000)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<DepthHover | null>(null)

  if (bids.length === 0 || asks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Loading depth…
      </div>
    )
  }

  const sortedBids = [...bids].sort((a, b) => b[0] - a[0]) // high → low
  const sortedAsks = [...asks].sort((a, b) => a[0] - b[0]) // low → high

  let cumBid = 0
  const bidPoints = sortedBids.map(([p, q]) => {
    cumBid += q
    return { price: p, cum: cumBid }
  })
  let cumAsk = 0
  const askPoints = sortedAsks.map(([p, q]) => {
    cumAsk += q
    return { price: p, cum: cumAsk }
  })

  const midPrice = (sortedBids[0][0] + sortedAsks[0][0]) / 2
  const bidMin = sortedBids[sortedBids.length - 1][0]
  const askMax = sortedAsks[sortedAsks.length - 1][0]
  // Extend visible range ~25% beyond actual data so the dashed boundaries
  // sit inside the plot area, matching the reference layout.
  const dataRange = Math.max(midPrice - bidMin, askMax - midPrice)
  const range = dataRange * 1.25
  const xMin = midPrice - range
  const xMax = midPrice + range
  const maxCum = Math.max(cumBid, cumAsk)

  const width = 1000
  const height = 420
  const padLeft = 8
  const padRight = 80
  const padTop = 16
  const padBottom = 28
  const plotW = width - padLeft - padRight
  const plotH = height - padTop - padBottom

  const xScale = (p: number) => padLeft + ((p - xMin) / (xMax - xMin)) * plotW
  const yScale = (v: number) => padTop + ((maxCum - v) / maxCum) * plotH

  // Bid staircase
  const bidCmds: string[] = [`M ${xScale(midPrice)} ${yScale(0)}`]
  let prevY = yScale(0)
  for (const { price, cum } of bidPoints) {
    const x = xScale(price)
    const y = yScale(cum)
    bidCmds.push(`L ${x} ${prevY}`)
    bidCmds.push(`L ${x} ${y}`)
    prevY = y
  }
  bidCmds.push(`L ${xScale(xMin)} ${prevY}`)
  const bidLine = bidCmds.join(' ')
  const bidArea = `${bidLine} L ${xScale(xMin)} ${yScale(0)} L ${xScale(midPrice)} ${yScale(0)} Z`

  // Ask staircase
  const askCmds: string[] = [`M ${xScale(midPrice)} ${yScale(0)}`]
  prevY = yScale(0)
  for (const { price, cum } of askPoints) {
    const x = xScale(price)
    const y = yScale(cum)
    askCmds.push(`L ${x} ${prevY}`)
    askCmds.push(`L ${x} ${y}`)
    prevY = y
  }
  askCmds.push(`L ${xScale(xMax)} ${prevY}`)
  const askLine = askCmds.join(' ')
  const askArea = `${askLine} L ${xScale(xMax)} ${yScale(0)} L ${xScale(midPrice)} ${yScale(0)} Z`

  const yTickFractions = [0.2, 0.4, 0.6, 0.8, 1.0]
  const xTickFractions = [0.1, 0.3, 0.5, 0.7, 0.9]

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const fx = (e.clientX - rect.left) / rect.width
    const fy = (e.clientY - rect.top) / rect.height
    const vx = fx * width
    if (vx < padLeft || vx > width - padRight) { setHover(null); return }
    const hoverPrice = xMin + ((vx - padLeft) / plotW) * (xMax - xMin)

    if (hoverPrice <= midPrice) {
      // Bid side — find deepest bid whose price is still ≥ hoverPrice.
      let snap = bidPoints[0]
      for (const pt of bidPoints) {
        if (pt.price >= hoverPrice) snap = pt
        else break
      }
      if (!snap) { setHover(null); return }
      setHover({
        side: 'bid',
        price: snap.price,
        cum: snap.cum,
        pxX: fx * rect.width,
        pxY: fy * rect.height,
      })
    } else {
      let snap = askPoints[0]
      for (const pt of askPoints) {
        if (pt.price <= hoverPrice) snap = pt
        else break
      }
      if (!snap) { setHover(null); return }
      setHover({
        side: 'ask',
        price: snap.price,
        cum: snap.cum,
        pxX: fx * rect.width,
        pxY: fy * rect.height,
      })
    }
  }

  const handleLeave = () => setHover(null)

  // Compute marker coordinates in viewBox space for the active hover point.
  const markerVX = hover ? xScale(hover.price) : 0
  const markerVY = hover ? yScale(hover.cum) : 0
  const rangePct = hover ? ((hover.price - midPrice) / midPrice) * 100 : 0

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={{ background: 'var(--color-surface)' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Horizontal grid + Y labels (right side) */}
        {yTickFractions.map((f, i) => {
          const v = maxCum * f
          const y = yScale(v)
          return (
            <g key={`y${i}`}>
              <line x1={padLeft} x2={width - padRight} y1={y} y2={y} stroke="var(--color-border)" strokeWidth="0.5" />
              <text x={width - padRight + 6} y={y + 4} fontSize="11" fill="var(--color-text-muted)">
                - {fmtDepthQty(v)}
              </text>
            </g>
          )
        })}

        {/* Dashed boundaries at the edges of the actual order-book data */}
        <line
          x1={xScale(bidMin)}
          x2={xScale(bidMin)}
          y1={padTop}
          y2={height - padBottom}
          stroke="var(--color-text-muted)"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.6"
        />
        <line
          x1={xScale(askMax)}
          x2={xScale(askMax)}
          y1={padTop}
          y2={height - padBottom}
          stroke="var(--color-text-muted)"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.6"
        />
        {/* Mid vertical line */}
        <line
          x1={xScale(midPrice)}
          x2={xScale(midPrice)}
          y1={padTop}
          y2={height - padBottom}
          stroke="var(--color-border-strong)"
          strokeWidth="1"
        />

        {/* Bid area + line */}
        <path d={bidArea} fill="#0ecb81" fillOpacity="0.12" />
        <path d={bidLine} fill="none" stroke="#0ecb81" strokeWidth="1.5" strokeLinejoin="miter" strokeLinecap="butt" />

        {/* Ask area + line */}
        <path d={askArea} fill="#f6465d" fillOpacity="0.12" />
        <path d={askLine} fill="none" stroke="#f6465d" strokeWidth="1.5" strokeLinejoin="miter" strokeLinecap="butt" />

        {/* X-axis labels */}
        {xTickFractions.map((f, i) => {
          const price = xMin + (xMax - xMin) * f
          const x = padLeft + plotW * f
          return (
            <text key={`x${i}`} x={x} y={height - 8} fontSize="11" fill="var(--color-text-muted)" textAnchor="middle">
              {price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </text>
          )
        })}
        <text
          x={xScale(midPrice)}
          y={height - 8}
          fontSize="11"
          fill="var(--color-text)"
          textAnchor="middle"
          fontWeight="600"
        >
          {midPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </text>

        {/* Hover marker */}
        {hover && (
          <>
            <circle
              cx={markerVX}
              cy={markerVY}
              r={4}
              fill={hover.side === 'bid' ? '#0ecb81' : '#f6465d'}
              stroke="var(--color-surface)"
              strokeWidth="1"
            />
          </>
        )}
      </svg>

      {/* Hover tooltip — HTML overlay so fonts aren't stretched by preserveAspectRatio */}
      {hover && (
        <div
          className="absolute pointer-events-none rounded px-2.5 py-1.5 text-[11px] leading-tight shadow"
          style={{
            left: Math.min(Math.max(hover.pxX + 10, 8), (containerRef.current?.clientWidth ?? 1000) - 140),
            top: Math.max(hover.pxY - 48, 8),
            background: 'var(--color-surface-2)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            minWidth: 130,
          }}
        >
          <div className="flex justify-between gap-3">
            <span style={{ color: 'var(--color-text-muted)' }}>Range</span>
            <span style={{ color: hover.side === 'bid' ? '#0ecb81' : '#f6465d' }}>
              {rangePct >= 0 ? '+' : ''}{rangePct.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span style={{ color: 'var(--color-text-muted)' }}>Price</span>
            <span>{hover.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span style={{ color: 'var(--color-text-muted)' }}>Amount</span>
            <span>{fmtDepthQty(hover.cum)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Multi-chart layout helpers ──────────────────────────────────────────────

const LAYOUT_GRID: Record<MultiLayout, { cols: number; rows: number; count: number }> = {
  '1': { cols: 1, rows: 1, count: 1 },
  '2v': { cols: 2, rows: 1, count: 2 },
  '2h': { cols: 1, rows: 2, count: 2 },
  '3v': { cols: 3, rows: 1, count: 3 },
  '3h': { cols: 1, rows: 3, count: 3 },
  '4': { cols: 2, rows: 2, count: 4 },
}

function LayoutIcon({ layout, size = 22 }: { layout: MultiLayout; size?: number }) {
  const { cols, rows } = LAYOUT_GRID[layout]
  const cellGap = 2
  const cellW = (size - cellGap * (cols - 1)) / cols
  const cellH = (size - cellGap * (rows - 1)) / rows
  const cells: React.ReactNode[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c * (cellW + cellGap)}
          y={r * (cellH + cellGap)}
          width={cellW}
          height={cellH}
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />,
      )
    }
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{cells}</svg>
}

function PanelTab({ symbol, active, onSelect, onClose, closable }: {
  symbol: string
  active: boolean
  onSelect: () => void
  onClose: () => void
  closable: boolean
}) {
  const ticker = useBinanceTicker(symbol)
  const changePos = parseFloat(ticker.priceChangePercent) >= 0
  const base = parseBase(symbol)
  const quote = symbol.slice(base.length)
  return (
    <div
      className="flex items-center gap-2 px-3 h-full cursor-pointer relative shrink-0"
      onClick={onSelect}
      style={{ background: active ? 'var(--color-surface-2)' : 'transparent' }}
    >
      <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
        {base}/{quote}
      </span>
      <span className="text-xs tabular-nums" style={{ color: changePos ? '#0ecb81' : '#f6465d' }}>
        {ticker.lastPrice || '—'}
      </span>
      {closable && (
        <button
          className="text-sm leading-none"
          style={{ color: 'var(--color-text-muted)' }}
          onClick={(e) => { e.stopPropagation(); onClose() }}
          aria-label="Close panel"
        >
          ×
        </button>
      )}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--color-primary)' }} />}
    </div>
  )
}

export function ChartSection({ symbol }: { symbol: string }) {
  const { theme } = useTheme()
  const [chartTab, setChartTab] = useState('Chart')
  const [viewMode, setViewMode] = useState('TradingView')
  const [fullscreen, setFullscreen] = useState(false)
  const [layout, setLayout] = useState<MultiLayout>('1')
  const [multiOpen, setMultiOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 })
  const [panelSymbols, setPanelSymbols] = useState<string[]>([symbol])
  const [activePanel, setActivePanel] = useState(0)
  const multiBtnRef = useRef<HTMLButtonElement>(null)
  const multiMenuRef = useRef<HTMLDivElement>(null)
  const prevSymbolRef = useRef(symbol)

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [fullscreen])

  useEffect(() => {
    if (!multiOpen) return
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (multiBtnRef.current?.contains(target)) return
      if (multiMenuRef.current?.contains(target)) return
      setMultiOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMultiOpen(false) }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [multiOpen])

  const toggleMultiMenu = () => {
    if (!multiOpen && multiBtnRef.current) {
      const rect = multiBtnRef.current.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right })
    }
    setMultiOpen(o => !o)
  }

  const layoutCount = LAYOUT_GRID[layout].count

  useEffect(() => {
    setPanelSymbols(arr => {
      if (arr.length === layoutCount) return arr
      if (arr.length < layoutCount) return [...arr, ...Array(layoutCount - arr.length).fill(symbol)]
      return arr.slice(0, layoutCount)
    })
    setActivePanel(i => Math.min(i, layoutCount - 1))
  }, [layoutCount, symbol])

  useEffect(() => {
    if (prevSymbolRef.current === symbol) return
    setPanelSymbols(arr => arr.map((_, i) => (i === activePanel ? symbol : arr[i])))
    prevSymbolRef.current = symbol
  }, [symbol, activePanel])

  const SHRINK_LAYOUT: Record<number, MultiLayout> = { 1: '1', 2: '2v', 3: '3v' }

  const closePanel = (idx: number) => {
    setPanelSymbols(arr => {
      if (arr.length <= 1) return arr
      const next = arr.filter((_, i) => i !== idx)
      const shrunk = SHRINK_LAYOUT[next.length] ?? '1'
      setLayout(shrunk)
      setActivePanel(a => Math.min(a, next.length - 1))
      return next
    })
  }

  const containerClass = fullscreen
    ? 'fixed inset-0 z-50 flex flex-col h-screen w-screen'
    : 'flex flex-col h-full'

  const { cols, rows, count } = LAYOUT_GRID[layout]
  const showMulti = chartTab === 'Chart' && viewMode !== 'Depth'

  return (
    <div className={containerClass} style={{ background: 'var(--color-surface)' }}>
      {/* Top tabs: Chart | Info | Trading Data | Moments ... Original | TradingView | Depth */}
      <div className="flex items-center justify-between gap-2 px-4 h-10 shrink-0 overflow-x-auto" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex h-full shrink-0">
          {['Chart', 'Info', 'Trading Data', 'Moments'].map(t => (
            <button key={t} className="px-3 text-sm font-medium h-full relative shrink-0 whitespace-nowrap" style={{ color: chartTab === t ? 'var(--color-text)' : 'var(--color-text-muted)' }} onClick={() => setChartTab(t)}>
              {t}
              {chartTab === t && <div className="absolute bottom-0 left-3 right-3 h-0.5" style={{ background: 'var(--color-text)' }} />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {['Original', 'TradingView', 'Depth'].map(t => (
            <button key={t} className="px-2.5 py-1 text-sm font-medium rounded shrink-0" style={{ color: viewMode === t ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: viewMode === t ? 700 : 500 }} onClick={() => setViewMode(t)}>
              {t}
            </button>
          ))}
          <div className="hidden md:block w-px h-4 mx-1" style={{ background: 'var(--color-border)' }} />
          <button
            className="hidden md:inline-flex p-1 rounded hover:bg-[var(--color-surface-2)]"
            style={{ color: 'var(--color-text-muted)' }}
            onClick={() => setFullscreen(f => !f)}
            aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={fullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
          >
            {fullscreen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3v6H3M21 9h-6V3M3 15h6v6M15 21v-6h6"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            )}
          </button>
          <button
            ref={multiBtnRef}
            className="hidden md:inline-flex p-1 rounded hover:bg-[var(--color-surface-2)]"
            style={{ color: layout === '1' ? 'var(--color-text-muted)' : 'var(--color-text)' }}
            onClick={toggleMultiMenu}
            aria-label="Multi chart layout"
            title="Multi chart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
          </button>
        </div>
      </div>

      {/* Per-panel symbol tabs — shown only in multi-chart TradingView mode */}
      {showMulti && count > 1 && (
        <div
          className="flex items-stretch h-9 shrink-0 overflow-x-auto"
          style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
        >
          {panelSymbols.map((sym, i) => (
            <PanelTab
              key={`${sym}-${i}`}
              symbol={sym}
              active={activePanel === i}
              onSelect={() => setActivePanel(i)}
              onClose={() => closePanel(i)}
              closable={panelSymbols.length > 1}
            />
          ))}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 min-h-0">
        {chartTab === 'Info' ? (
          <SymbolInfoPanel symbol={symbol} />
        ) : chartTab === 'Trading Data' ? (
          <TradingDataPanel symbol={symbol} />
        ) : viewMode === 'Depth' ? (
          <DepthChart symbol={symbol} />
        ) : showMulti && count > 1 ? (
          <div
            className="grid h-full w-full gap-[2px]"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              background: 'var(--color-border)',
            }}
          >
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="min-h-0 min-w-0" style={{ background: 'var(--color-surface)' }}>
                <TVChartWidget symbol={panelSymbols[i] ?? symbol} theme={theme} />
              </div>
            ))}
          </div>
        ) : (
          <TVChartWidget symbol={symbol} theme={theme} />
        )}
      </div>

      {multiOpen && (
        <div
          ref={multiMenuRef}
          className="fixed rounded-lg p-3 shadow-xl"
          style={{
            top: menuPos.top,
            right: menuPos.right,
            zIndex: 9999,
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            minWidth: 200,
          }}
        >
          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Multi Chart</div>
          {([
            { label: '1', options: ['1'] as MultiLayout[] },
            { label: '2', options: ['2v', '2h'] as MultiLayout[] },
            { label: '3', options: ['3v', '3h'] as MultiLayout[] },
            { label: '4', options: ['4'] as MultiLayout[] },
          ]).map(row => (
            <div
              key={row.label}
              className="flex items-center gap-3 py-1.5"
              style={{ borderTop: row.label === '1' ? 'none' : '1px solid var(--color-border)' }}
            >
              <div className="w-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>{row.label}</div>
              {row.options.map(opt => {
                const active = layout === opt
                return (
                  <button
                    key={opt}
                    onClick={() => { setLayout(opt); setMultiOpen(false) }}
                    className="p-1.5 rounded"
                    style={{
                      background: active ? 'var(--color-surface-3)' : 'transparent',
                      border: active ? '1px solid var(--color-primary)' : '1px solid transparent',
                      color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    }}
                    aria-label={`Layout ${opt}`}
                  >
                    <LayoutIcon layout={opt} />
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
