// Binance Spot WebSocket helpers.
// All streams are public — no auth needed.

import type { WsTicker, WsMiniTicker, WsDepth, WsTrade, WsKline, KlineInterval } from './types.ts'

const WS_BASE = 'wss://stream.binance.com:9443'

type Unsub = () => void

interface SubscribeOptions {
  /** Called when the socket opens. */
  onOpen?: () => void
  /** Called on close; auto-reconnect still runs unless you return from the unsub. */
  onClose?: (ev: CloseEvent) => void
  /** Called on error. */
  onError?: (ev: Event) => void
  /** Back-off base in ms for reconnect. Default 1500ms with exponential cap at 15s. */
  reconnectBaseMs?: number
}

/**
 * Low-level raw stream subscription. Handles auto-reconnect on close.
 * `path` is appended to the base ws URL — e.g. `/ws/btcusdt@ticker` or `/stream?streams=a/b/c`.
 */
function subscribeRaw<T>(
  path: string,
  onMessage: (data: T) => void,
  opts: SubscribeOptions = {},
): Unsub {
  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let attempt = 0
  let cancelled = false
  const baseMs = opts.reconnectBaseMs ?? 1500

  const connect = () => {
    if (cancelled) return
    ws = new WebSocket(`${WS_BASE}${path}`)
    ws.onopen = () => {
      attempt = 0
      opts.onOpen?.()
    }
    ws.onmessage = (ev) => {
      try {
        onMessage(JSON.parse(ev.data) as T)
      } catch { /* ignore malformed frames */ }
    }
    ws.onerror = (ev) => opts.onError?.(ev)
    ws.onclose = (ev) => {
      opts.onClose?.(ev)
      if (cancelled) return
      attempt += 1
      const delay = Math.min(baseMs * 2 ** (attempt - 1), 15000)
      reconnectTimer = setTimeout(connect, delay)
    }
  }
  connect()

  return () => {
    cancelled = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    if (ws && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
      ws.close()
    }
  }
}

// ─── Typed stream helpers ────────────────────────────────────────────────────

/** <symbol>@ticker — 24hr rolling window ticker updates every second */
export function subscribeTicker(symbol: string, onData: (t: WsTicker) => void, opts?: SubscribeOptions): Unsub {
  return subscribeRaw<WsTicker>(`/ws/${symbol.toLowerCase()}@ticker`, onData, opts)
}

/** <symbol>@depth<levels>@<speed> — partial book. levels: 5|10|20. speed: 100ms|1000ms */
export function subscribeDepth(
  symbol: string,
  onData: (d: WsDepth) => void,
  levels: 5 | 10 | 20 = 10,
  speed: '100ms' | '1000ms' = '1000ms',
  opts?: SubscribeOptions,
): Unsub {
  return subscribeRaw<WsDepth>(`/ws/${symbol.toLowerCase()}@depth${levels}@${speed}`, onData, opts)
}

/** <symbol>@trade — individual trade stream */
export function subscribeTrades(symbol: string, onData: (t: WsTrade) => void, opts?: SubscribeOptions): Unsub {
  return subscribeRaw<WsTrade>(`/ws/${symbol.toLowerCase()}@trade`, onData, opts)
}

/** <symbol>@kline_<interval> — candlestick stream */
export function subscribeKline(
  symbol: string,
  interval: KlineInterval,
  onData: (k: WsKline) => void,
  opts?: SubscribeOptions,
): Unsub {
  return subscribeRaw<WsKline>(`/ws/${symbol.toLowerCase()}@kline_${interval}`, onData, opts)
}

/** !ticker@arr — all-market 24hr ticker stream. Large payloads; use sparingly. */
export function subscribeAllTickers(onData: (tickers: WsTicker[]) => void, opts?: SubscribeOptions): Unsub {
  return subscribeRaw<WsTicker[]>(`/ws/!ticker@arr`, onData, opts)
}

/** <symbol>@miniTicker — lightweight 24hr rolling window (cheaper than @ticker). */
export function subscribeMiniTicker(symbol: string, onData: (t: WsMiniTicker) => void, opts?: SubscribeOptions): Unsub {
  return subscribeRaw<WsMiniTicker>(`/ws/${symbol.toLowerCase()}@miniTicker`, onData, opts)
}

/**
 * Combined miniTicker stream for a fixed symbol set. Opens a single WebSocket
 * and dispatches each per-symbol payload to the callback.
 */
export function subscribeMiniTickers(
  symbols: string[],
  onData: (t: WsMiniTicker) => void,
  opts?: SubscribeOptions,
): Unsub {
  const streams = symbols.map((s) => `${s.toLowerCase()}@miniTicker`)
  return subscribeCombined<WsMiniTicker>(streams, (_stream, data) => onData(data), opts)
}

/** !miniTicker@arr — all-market mini tickers (one frame covers everything). */
export function subscribeAllMiniTickers(onData: (tickers: WsMiniTicker[]) => void, opts?: SubscribeOptions): Unsub {
  return subscribeRaw<WsMiniTicker[]>(`/ws/!miniTicker@arr`, onData, opts)
}

/** Combined stream — subscribe to multiple streams over one socket. */
export function subscribeCombined<T>(
  streams: string[],
  onData: (stream: string, data: T) => void,
  opts?: SubscribeOptions,
): Unsub {
  const qs = streams.join('/')
  return subscribeRaw<{ stream: string; data: T }>(`/stream?streams=${qs}`, (msg) => {
    onData(msg.stream, msg.data)
  }, opts)
}
