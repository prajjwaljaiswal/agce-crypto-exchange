import { useState, useEffect, useRef } from 'react'
import { subscribeTrades, subscribeKline } from '@agce/binance'
import type { WsTrade, WsKline } from '@agce/binance'
import { fmtPrice, fmtVol } from './format.js'
import { COIN_NAMES, COIN_COLORS, COINGECKO_IDS } from './coins.js'
import type {
  TickerData,
  RawBookEntry,
  CoinTicker,
  RecentTrade,
  CoinInfo,
  TradingParams,
  FlowTimeframe,
  MoneyFlow,
  BufferedTrade,
  KlineInflow,
  FuturesStatPoint,
  FuturesEndpoint,
} from './types.js'

// ─── Binance ticker ──────────────────────────────────────────────────────────

export function useBinanceTicker(symbol: string) {
  const [ticker, setTicker] = useState<TickerData>({
    lastPrice: '0', priceChange: '0', priceChangePercent: '0',
    highPrice: '0', lowPrice: '0', volume: '0', quoteVolume: '0', prevClose: '0',
  })
  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`)
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data)
      setTicker({
        lastPrice: fmtPrice(d.c),
        priceChange: fmtPrice(d.p),
        priceChangePercent: parseFloat(d.P).toFixed(2),
        highPrice: fmtPrice(d.h),
        lowPrice: fmtPrice(d.l),
        volume: fmtVol(parseFloat(d.v)),
        quoteVolume: fmtVol(parseFloat(d.q)),
        prevClose: fmtPrice(d.x),
      })
    }
    return () => ws.close()
  }, [symbol])
  return ticker
}

// ─── Order book (L20, 100ms) ─────────────────────────────────────────────────

export function useBinanceOrderBook(symbol: string) {
  const [bids, setBids] = useState<RawBookEntry[]>([])
  const [asks, setAsks] = useState<RawBookEntry[]>([])
  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`)
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data)
      const map = (arr: (string | number)[][]): RawBookEntry[] =>
        arr.map((entry) => ({
          price: parseFloat(String(entry[0])),
          amount: parseFloat(String(entry[1])),
        }))
      // Binance: asks ascending (lowest first), bids descending (highest first)
      setAsks(map(d.asks))
      setBids(map(d.bids))
    }
    return () => ws.close()
  }, [symbol])
  return { bids, asks }
}

// ─── All 24h tickers (for the pair dropdown) ─────────────────────────────────

export function useBinanceAllTickers() {
  const [tickers, setTickers] = useState<CoinTicker[]>([])

  useEffect(() => {
    fetch('https://api.binance.com/api/v3/ticker/24hr')
      .then(r => r.json())
      .then((data: { symbol: string; lastPrice: string; priceChangePercent: string; volume: string }[]) => {
        const usdt = data
          .filter(d => d.symbol.endsWith('USDT') && !d.symbol.includes('UP') && !d.symbol.includes('DOWN'))
          .sort((a, b) => parseFloat(b.volume) * parseFloat(b.lastPrice) - parseFloat(a.volume) * parseFloat(a.lastPrice))
          .slice(0, 50)
          .map(d => {
            const base = d.symbol.replace('USDT', '')
            return {
              symbol: d.symbol,
              base,
              quote: 'USDT',
              name: COIN_NAMES[base] ?? base,
              price: parseFloat(d.lastPrice).toString(),
              change: parseFloat(d.priceChangePercent).toFixed(2),
              volume: d.volume,
              color: COIN_COLORS[base] ?? '#888',
            }
          })
        setTickers(usdt)
      })
      .catch(() => {})
  }, [])

  return tickers
}

// ─── Recent trades (REST snapshot + live websocket) ──────────────────────────

export function useRecentTrades(symbol: string, limit = 40): RecentTrade[] {
  const [trades, setTrades] = useState<RecentTrade[]>([])
  const bufferRef = useRef<RecentTrade[]>([])

  useEffect(() => {
    let cancelled = false
    bufferRef.current = []
    setTrades([])

    fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=${limit}`)
      .then(r => (r.ok ? r.json() : []))
      .then((arr: Array<{ price: string; qty: string; time: number; isBuyerMaker: boolean }>) => {
        if (cancelled) return
        const mapped = arr
          .map(t => ({
            price: parseFloat(t.price),
            qty: parseFloat(t.qty),
            time: t.time,
            buyerIsMaker: t.isBuyerMaker,
          }))
          .sort((a, b) => b.time - a.time)
        bufferRef.current = mapped
        setTrades(mapped)
      })
      .catch(() => {})

    const unsubscribe = subscribeTrades(symbol, (msg: WsTrade) => {
      const t: RecentTrade = {
        price: parseFloat(msg.p),
        qty: parseFloat(msg.q),
        time: msg.T,
        buyerIsMaker: msg.m,
      }
      bufferRef.current = [t, ...bufferRef.current].slice(0, limit)
      setTrades(bufferRef.current)
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [symbol, limit])

  return trades
}

// ─── Deep order book (for the Depth chart) ───────────────────────────────────

export interface DeepBook {
  bids: [number, number][]
  asks: [number, number][]
}

export function useDeepOrderBook(symbol: string, limit = 5000): DeepBook {
  const [book, setBook] = useState<DeepBook>({ bids: [], asks: [] })

  useEffect(() => {
    let cancelled = false
    const load = () => {
      fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`)
        .then(r => r.ok ? r.json() : null)
        .then((d: { bids: [string, string][]; asks: [string, string][] } | null) => {
          if (cancelled || !d) return
          setBook({
            bids: d.bids.map(([p, q]) => [parseFloat(p), parseFloat(q)]),
            asks: d.asks.map(([p, q]) => [parseFloat(p), parseFloat(q)]),
          })
        })
        .catch(() => {})
    }
    load()
    const interval = setInterval(load, 2000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [symbol, limit])

  return book
}

// ─── CoinGecko metadata ──────────────────────────────────────────────────────

export function useCoinInfo(base: string) {
  const [info, setInfo] = useState<CoinInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = COINGECKO_IDS[base]
    if (!id) {
      setInfo(null)
      setError(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d: Record<string, unknown>) => {
        if (cancelled) return
        const md = (d.market_data ?? {}) as Record<string, unknown>
        const links = (d.links ?? {}) as Record<string, unknown>
        const desc = (d.description ?? {}) as Record<string, string>
        const img = (d.image ?? {}) as Record<string, string>
        const pick = (o: Record<string, unknown> | undefined, k: string): number | null => {
          if (!o) return null
          const v = o[k]
          if (v == null) return null
          if (typeof v === 'number') return v
          if (typeof v === 'object' && 'usd' in (v as object)) {
            const u = (v as Record<string, unknown>).usd
            return typeof u === 'number' ? u : null
          }
          return null
        }
        const homepages = (links.homepage as string[] | undefined) ?? []
        const whitepaper = typeof links.whitepaper === 'string' ? links.whitepaper : null
        const explorers = (links.blockchain_site as string[] | undefined) ?? []
        const athObj = md.ath as Record<string, number> | undefined
        const atlObj = md.atl as Record<string, number> | undefined
        const athDateObj = md.ath_date as Record<string, string> | undefined
        const atlDateObj = md.atl_date as Record<string, string> | undefined
        setInfo({
          name: (d.name as string) ?? base,
          symbol: (d.symbol as string)?.toUpperCase() ?? base,
          image: img.large ?? img.small ?? img.thumb ?? '',
          rank: (d.market_cap_rank as number | null) ?? null,
          marketCap: pick(md, 'market_cap'),
          fdv: pick(md, 'fully_diluted_valuation'),
          dominance: pick(md, 'market_cap_change_percentage_24h'),
          volume24h: pick(md, 'total_volume'),
          circulating: (md.circulating_supply as number | null) ?? null,
          maxSupply: (md.max_supply as number | null) ?? null,
          totalSupply: (md.total_supply as number | null) ?? null,
          ath: athObj?.usd ?? null,
          athDate: athDateObj?.usd ?? null,
          atl: atlObj?.usd ?? null,
          atlDate: atlDateObj?.usd ?? null,
          genesisDate: (d.genesis_date as string | null) ?? null,
          description: desc.en ?? '',
          homepage: homepages.find(h => h) ?? null,
          whitepaper,
          explorer: explorers.find(h => h) ?? null,
        })
      })
      .catch(e => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [base])

  return { info, loading, error }
}

// ─── Binance exchangeInfo (trading params) ───────────────────────────────────

export function useTradingParams(symbol: string) {
  const [params, setParams] = useState<TradingParams | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`https://api.binance.com/api/v3/exchangeInfo?symbol=${symbol}`)
      .then(r => r.ok ? r.json() : null)
      .then((d: { symbols?: Array<Record<string, unknown>> } | null) => {
        if (cancelled || !d?.symbols?.length) return
        const s = d.symbols[0]
        const filters = (s.filters as Array<Record<string, string>>) ?? []
        const priceFilter = filters.find(f => f.filterType === 'PRICE_FILTER')
        const lotFilter = filters.find(f => f.filterType === 'LOT_SIZE')
        const notionalFilter = filters.find(f => f.filterType === 'NOTIONAL' || f.filterType === 'MIN_NOTIONAL')
        setParams({
          symbol: s.symbol as string,
          baseAsset: s.baseAsset as string,
          quoteAsset: s.quoteAsset as string,
          tickSize: priceFilter?.tickSize ?? '—',
          stepSize: lotFilter?.stepSize ?? '—',
          minQty: lotFilter?.minQty ?? '—',
          maxQty: lotFilter?.maxQty ?? '—',
          minNotional: notionalFilter?.minNotional ?? notionalFilter?.notional ?? '—',
          status: s.status as string,
        })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [symbol])

  return params
}

// ─── Money flow (aggregated trades bucketed by size) ─────────────────────────

export const FLOW_WINDOW_MS: Record<FlowTimeframe, number> = {
  '15m': 15 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '2h': 2 * 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
}

export function bucketsFromTrades(trades: BufferedTrade[], cutoff: number): MoneyFlow {
  const buckets: MoneyFlow = {
    large: { buy: 0, sell: 0 },
    medium: { buy: 0, sell: 0 },
    small: { buy: 0, sell: 0 },
  }
  for (const t of trades) {
    if (t.time < cutoff) continue
    const value = t.qty * t.price
    const key: keyof MoneyFlow = value >= 100_000 ? 'large' : value >= 10_000 ? 'medium' : 'small'
    if (t.buyerIsMaker) buckets[key].sell += t.qty
    else buckets[key].buy += t.qty
  }
  return buckets
}

export function useMoneyFlow(symbol: string, timeframe: FlowTimeframe) {
  const [flow, setFlow] = useState<MoneyFlow | null>(null)
  const [loading, setLoading] = useState(false)
  const bufferRef = useRef<BufferedTrade[]>([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    bufferRef.current = []

    fetch(`https://api.binance.com/api/v3/aggTrades?symbol=${symbol}&limit=1000`)
      .then(r => r.ok ? r.json() : [])
      .then((trades: Array<{ p: string; q: string; m: boolean; T: number }>) => {
        if (cancelled) return
        bufferRef.current = trades.map(t => ({
          price: parseFloat(t.p),
          qty: parseFloat(t.q),
          buyerIsMaker: t.m,
          time: t.T,
        }))
        setFlow(bucketsFromTrades(bufferRef.current, Date.now() - FLOW_WINDOW_MS[timeframe]))
      })
      .catch(() => { if (!cancelled) setFlow(null) })
      .finally(() => { if (!cancelled) setLoading(false) })

    const unsubscribe = subscribeTrades(symbol, (msg: WsTrade) => {
      bufferRef.current.push({
        price: parseFloat(msg.p),
        qty: parseFloat(msg.q),
        buyerIsMaker: msg.m,
        time: msg.T,
      })
      const maxWindow = FLOW_WINDOW_MS['1d']
      const cutoff = Date.now() - maxWindow
      if (bufferRef.current.length > 2000) {
        bufferRef.current = bufferRef.current.filter(t => t.time >= cutoff)
      }
    })

    const interval = setInterval(() => {
      if (cancelled) return
      setFlow(bucketsFromTrades(bufferRef.current, Date.now() - FLOW_WINDOW_MS[timeframe]))
    }, 1000)

    return () => {
      cancelled = true
      clearInterval(interval)
      unsubscribe()
    }
  }, [symbol, timeframe])

  return { flow, loading }
}

// ─── Kline inflow (taker buy - sell volume per bucket) ───────────────────────

export function useKlineInflow(symbol: string, interval: '1h' | '1d', limit: number) {
  const [series, setSeries] = useState<KlineInflow[]>([])

  useEffect(() => {
    let cancelled = false
    fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)
      .then(r => r.ok ? r.json() : [])
      .then((klines: Array<Array<string | number>>) => {
        if (cancelled) return
        const data = klines.map(k => {
          const vol = parseFloat(k[5] as string)
          const takerBuy = parseFloat(k[9] as string)
          const sell = vol - takerBuy
          return { openTime: k[0] as number, inflow: takerBuy - sell }
        })
        setSeries(data)
      })
      .catch(() => { if (!cancelled) setSeries([]) })

    const unsubscribe = subscribeKline(symbol, interval, (msg: WsKline) => {
      if (cancelled) return
      const k = msg.k
      const vol = parseFloat(k.v)
      const takerBuy = parseFloat(k.V)
      const sell = vol - takerBuy
      const point: KlineInflow = { openTime: k.t, inflow: takerBuy - sell }
      setSeries(prev => {
        if (prev.length === 0) return [point]
        const last = prev[prev.length - 1]
        if (last.openTime === point.openTime) {
          return [...prev.slice(0, -1), point]
        }
        if (point.openTime > last.openTime) {
          return [...prev.slice(-(limit - 1)), point]
        }
        return prev
      })
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [symbol, interval, limit])

  return series
}

// ─── Futures public data stats ───────────────────────────────────────────────

// Used as proxies for the Margin metrics the Binance UI shows, since the
// spot-margin numbers are not on a public endpoint.
export function useFuturesStat(
  symbol: string,
  endpoint: FuturesEndpoint,
  valueKey: string,
  period: '5m' | '15m' | '30m' | '1h' | '4h' | '1d' = '1h',
  limit = 24,
) {
  const [data, setData] = useState<FuturesStatPoint[]>([])
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    let cancelled = false
    setAvailable(true)
    fetch(`https://fapi.binance.com/futures/data/${endpoint}?symbol=${symbol}&period=${period}&limit=${limit}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((arr: unknown) => {
        if (cancelled) return
        if (!Array.isArray(arr) || arr.length === 0) {
          setData([])
          setAvailable(false)
          return
        }
        const points: FuturesStatPoint[] = arr
          .map((p: Record<string, unknown>) => ({
            time: (p.timestamp as number) ?? 0,
            value: parseFloat((p[valueKey] as string) ?? 'NaN'),
          }))
          .filter(p => Number.isFinite(p.value))
        setData(points)
      })
      .catch(() => {
        if (cancelled) return
        setData([])
        setAvailable(false)
      })

    // Poll every 60s — futures stats update on that cadence.
    const interval = setInterval(() => {
      fetch(`https://fapi.binance.com/futures/data/${endpoint}?symbol=${symbol}&period=${period}&limit=${limit}`)
        .then(r => r.ok ? r.json() : null)
        .then((arr: unknown) => {
          if (cancelled || !Array.isArray(arr)) return
          const points: FuturesStatPoint[] = arr
            .map((p: Record<string, unknown>) => ({
              time: (p.timestamp as number) ?? 0,
              value: parseFloat((p[valueKey] as string) ?? 'NaN'),
            }))
            .filter(p => Number.isFinite(p.value))
          setData(points)
        })
        .catch(() => {})
    }, 60_000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [symbol, endpoint, valueKey, period, limit])

  return { data, available }
}

export function toGrowthSeries(points: FuturesStatPoint[]): number[] {
  if (points.length === 0) return []
  const baseline = points[0].value
  if (baseline === 0) return points.map(() => 0)
  return points.map(p => ((p.value - baseline) / baseline) * 100)
}
