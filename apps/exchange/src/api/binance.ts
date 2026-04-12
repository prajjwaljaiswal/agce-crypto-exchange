const BINANCE_REST = 'https://api.binance.com/api/v3'
const BINANCE_WS = 'wss://stream.binance.com:9443/ws'

export interface BinanceTicker {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
}

export interface BinanceMiniTicker {
  s: string
  c: string
  o: string
  h: string
  l: string
  v: string
  q: string
}

export async function fetchBinanceTickers(symbols: string[]): Promise<BinanceTicker[]> {
  const params = new URLSearchParams()
  params.set('symbols', JSON.stringify(symbols))
  const response = await fetch(`${BINANCE_REST}/ticker/24hr?${params}`)
  if (!response.ok) throw new Error(`Binance API error: ${response.status}`)
  return response.json() as Promise<BinanceTicker[]>
}

export function subscribeBinanceMiniTickers(
  symbols: string[],
  onMessage: (ticker: BinanceMiniTicker) => void,
): () => void {
  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let cancelled = false

  const connect = () => {
    if (cancelled) return
    const streams = symbols.map((s) => `${s.toLowerCase()}@miniTicker`).join('/')
    ws = new WebSocket(`${BINANCE_WS}/${streams}`)

    ws.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data) as BinanceMiniTicker)
      } catch {
        // ignore malformed frames
      }
    }

    ws.onclose = () => {
      if (cancelled) return
      reconnectTimer = setTimeout(connect, 3000)
    }

    ws.onerror = () => {
      ws?.close()
    }
  }

  connect()

  return () => {
    cancelled = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    ws?.close()
  }
}
