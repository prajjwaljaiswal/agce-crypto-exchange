import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchBinanceTickers,
  subscribeBinanceMiniTickers,
} from '../../../api/binance.js'
import type { Coin } from '../types/index.js'

const SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'BNBUSDT',
  'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT', 'LINKUSDT', 'LTCUSDT',
  'BCHUSDT', 'UNIUSDT', 'NEARUSDT', 'APTUSDT', 'FILUSDT', 'ATOMUSDT',
  'ARBUSDT', 'OPUSDT', 'SHIBUSDT', 'PEPEUSDT', 'TRXUSDT', 'TONUSDT',
  'SUIUSDT', 'AAVEUSDT', 'RENDERUSDT', 'INJUSDT', 'FETUSDT', 'TAOUSDT',
  'HBARUSDT', 'ICPUSDT', 'ETCUSDT', 'ALGOUSDT', 'AXSUSDT', 'SANDUSDT',
  'MANAUSDT', 'XLMUSDT', 'FTMUSDT', 'VETUSDT', 'GRTUSDT', 'CRVUSDT',
  'COMPUSDT', 'MKRUSDT', 'SNXUSDT', 'CAKEUSDT', 'JUPUSDT', 'WLDUSDT',
  'SEIUSDT', 'TIAUSDT',
]

const COIN_NAMES: Record<string, string> = {
  BTC: 'Bitcoin', ETH: 'Ethereum', SOL: 'Solana', XRP: 'Ripple',
  DOGE: 'DogeCoin', BNB: 'Binance Coin', ADA: 'Cardano',
  AVAX: 'Avalanche', DOT: 'Polkadot', MATIC: 'Polygon',
  LINK: 'Chainlink', LTC: 'Litecoin', BCH: 'Bitcoin Cash',
  UNI: 'Uniswap', NEAR: 'NEAR Protocol', APT: 'Aptos',
  FIL: 'Filecoin', ATOM: 'Cosmos', ARB: 'Arbitrum', OP: 'Optimism',
  SHIB: 'Shiba Inu', PEPE: 'Pepe', TRX: 'TRON', TON: 'Toncoin',
  SUI: 'Sui', AAVE: 'Aave', RENDER: 'Render', INJ: 'Injective',
  FET: 'Artificial Superintelligence', TAO: 'Bittensor',
  HBAR: 'Hedera', ICP: 'Internet Computer', ETC: 'Ethereum Classic',
  ALGO: 'Algorand', AXS: 'Axie Infinity', SAND: 'The Sandbox',
  MANA: 'Decentraland', XLM: 'Stellar', FTM: 'Fantom', VET: 'VeChain',
  GRT: 'The Graph', CRV: 'Curve DAO', COMP: 'Compound', MKR: 'Maker',
  SNX: 'Synthetix', CAKE: 'PancakeSwap', JUP: 'Jupiter',
  WLD: 'Worldcoin', SEI: 'Sei', TIA: 'Celestia',
}

function extractBase(symbol: string): string {
  return symbol.replace('USDT', '')
}

function formatPrice(price: number): string {
  if (price >= 1000)
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  if (price >= 1) return `$${price.toFixed(2)}`
  if (price >= 0.01) return `$${price.toFixed(4)}`
  if (price >= 0.0001) return `$${price.toFixed(6)}`
  return `$${price.toFixed(10)}`
}

function formatChange(change: number): string {
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
}

interface TickerState {
  price: number
  change: number
  volume: number
}

function tickerToCoin(base: string, state: TickerState): Coin {
  return {
    symbol: base,
    name: COIN_NAMES[base] ?? base,
    price: formatPrice(state.price),
    change: formatChange(state.change),
    positive: state.change >= 0,
    icon: `/images/coins/${base.toLowerCase()}.svg`,
  }
}

interface TrendingData {
  hot: Coin[]
  gainers: Coin[]
  losers: Coin[]
}

export function useTrendingCoins(topN = 5) {
  const [data, setData] = useState<TrendingData>({
    hot: [],
    gainers: [],
    losers: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const tickersRef = useRef<Map<string, TickerState>>(new Map())

  const recompute = useCallback(() => {
    const entries = Array.from(tickersRef.current.entries())
    if (entries.length === 0) return

    const byVolume = [...entries]
      .sort((a, b) => b[1].volume - a[1].volume)
      .slice(0, topN)
    const byGain = [...entries]
      .sort((a, b) => b[1].change - a[1].change)
      .slice(0, topN)
    const byLoss = [...entries]
      .sort((a, b) => a[1].change - b[1].change)
      .slice(0, topN)

    setData({
      hot: byVolume.map(([base, s]) => tickerToCoin(base, s)),
      gainers: byGain.map(([base, s]) => tickerToCoin(base, s)),
      losers: byLoss.map(([base, s]) => tickerToCoin(base, s)),
    })
  }, [topN])

  // Initial REST fetch
  useEffect(() => {
    let cancelled = false

    async function loadInitial() {
      try {
        setLoading(true)
        setError(null)
        const tickers = await fetchBinanceTickers(SYMBOLS)
        if (cancelled) return
        tickersRef.current.clear()
        for (const t of tickers) {
          tickersRef.current.set(extractBase(t.symbol), {
            price: parseFloat(t.lastPrice),
            change: parseFloat(t.priceChangePercent),
            volume: parseFloat(t.quoteVolume),
          })
        }
        recompute()
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : 'Failed to load trending coins',
          )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadInitial()
    return () => {
      cancelled = true
    }
  }, [recompute])

  // WebSocket live updates
  const hasTickers = !loading && tickersRef.current.size > 0
  useEffect(() => {
    if (!hasTickers) return

    const unsubscribe = subscribeBinanceMiniTickers(SYMBOLS, (msg) => {
      const base = extractBase(msg.s)
      const close = parseFloat(msg.c)
      const open = parseFloat(msg.o)
      const changePercent = open > 0 ? ((close - open) / open) * 100 : 0
      tickersRef.current.set(base, {
        price: close,
        change: changePercent,
        volume: parseFloat(msg.q),
      })
    })

    // Batch re-render every 2s to avoid thrashing
    const interval = setInterval(recompute, 2000)

    return () => {
      clearInterval(interval)
      unsubscribe()
    }
  }, [hasTickers, recompute])

  return { ...data, loading, error }
}
