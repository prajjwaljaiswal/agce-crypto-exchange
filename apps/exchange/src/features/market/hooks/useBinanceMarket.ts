import { useState, useEffect, useRef, useCallback } from 'react'
import type { MarketPair, FeaturedPair } from '@agce/types'
import { get24hrTickers, subscribeMiniTickers, type Ticker24hr } from '@agce/binance'

const FEATURED_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BCHUSDT']

const TABLE_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT',
  'BNBUSDT', 'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT',
  'LINKUSDT', 'LTCUSDT', 'BCHUSDT', 'UNIUSDT', 'NEARUSDT',
  'APTUSDT', 'FILUSDT', 'ATOMUSDT', 'ARBUSDT', 'OPUSDT',
  'SHIBUSDT', 'PEPEUSDT', 'TRXUSDT', 'TONUSDT', 'SUIUSDT',
  'AAVEUSDT', 'RENDERUSDT', 'INJUSDT', 'FETUSDT', 'TAOUSDT',
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
  FET: 'Artificial Superintelligence Alliance', TAO: 'Bittensor',
}

function extractBase(symbol: string): string {
  return symbol.replace('USDT', '')
}

function formatCompact(val: number): string {
  if (val >= 1_000_000_000_000) return `$${(val / 1_000_000_000_000).toFixed(2)}T`
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`
  if (val >= 1_000) return `$${(val / 1_000).toFixed(2)}K`
  return `$${val.toFixed(2)}`
}

function formatPriceCompact(price: number): string {
  if (price >= 1_000) return formatCompact(price)
  if (price >= 1) return `$${price.toFixed(2)}`
  if (price >= 0.01) return `$${price.toFixed(4)}`
  if (price >= 0.0001) return `$${price.toFixed(6)}`
  return `$${price.toFixed(10)}`
}

function formatPrice(price: number): string {
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (price >= 0.01) return price.toFixed(4)
  if (price >= 0.0001) return price.toFixed(6)
  return price.toFixed(10)
}

function tickerToMarketPair(t: Ticker24hr): MarketPair {
  const base = extractBase(t.symbol)
  const price = parseFloat(t.lastPrice)
  const change = parseFloat(t.priceChangePercent)
  const quoteVol = parseFloat(t.quoteVolume)

  return {
    symbol: `${base}/USDT`,
    baseCurrency: base,
    quoteCurrency: 'USDT',
    price: formatPrice(price),
    priceUsd: `$${formatPrice(price)}`,
    change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
    positive: change >= 0,
    high24h: `$${formatPrice(parseFloat(t.highPrice))}`,
    low24h: `$${formatPrice(parseFloat(t.lowPrice))}`,
    volume: formatCompact(quoteVol),
    marketCap: '-',
    icon: `/images/coins/${base.toLowerCase()}.svg`,
  }
}

function tickerToFeatured(t: Ticker24hr): FeaturedPair {
  const base = extractBase(t.symbol)
  const price = parseFloat(t.lastPrice)
  const change = parseFloat(t.priceChangePercent)
  const quoteVol = parseFloat(t.quoteVolume)

  return {
    symbol: `${base}/USDT`,
    baseCurrency: base,
    quoteCurrency: 'USDT',
    price: formatPriceCompact(price),
    change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
    positive: change >= 0,
    volume: formatCompact(quoteVol).replace('$', '') + ' (USD)',
    icon: `/images/coins/${base.toLowerCase()}.svg`,
  }
}

export function useBinanceMarket() {
  const [pairs, setPairs] = useState<MarketPair[]>([])
  const [featured, setFeatured] = useState<FeaturedPair[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pairsRef = useRef<Map<string, MarketPair>>(new Map())
  const featuredRef = useRef<Map<string, FeaturedPair>>(new Map())

  const loadInitial = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const symbols = [...new Set([...FEATURED_SYMBOLS, ...TABLE_SYMBOLS])]
      const data = await get24hrTickers(symbols)

      const tableMap = new Map<string, MarketPair>()
      const featMap = new Map<string, FeaturedPair>()

      for (const ticker of data) {
        if (TABLE_SYMBOLS.includes(ticker.symbol)) {
          tableMap.set(ticker.symbol, tickerToMarketPair(ticker))
        }
        if (FEATURED_SYMBOLS.includes(ticker.symbol)) {
          featMap.set(ticker.symbol, tickerToFeatured(ticker))
        }
      }

      pairsRef.current = tableMap
      featuredRef.current = featMap

      setPairs(TABLE_SYMBOLS.filter((s) => tableMap.has(s)).map((s) => tableMap.get(s)!))
      setFeatured(FEATURED_SYMBOLS.filter((s) => featMap.has(s)).map((s) => featMap.get(s)!))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  const hasPairs = pairs.length > 0

  useEffect(() => {
    if (loading || !hasPairs) return

    const allSymbols = [...new Set([...FEATURED_SYMBOLS, ...TABLE_SYMBOLS])]

    const unsubscribe = subscribeMiniTickers(allSymbols, (msg) => {
      const symbol = msg.s

      if (pairsRef.current.has(symbol)) {
        const prev = pairsRef.current.get(symbol)!
        const price = parseFloat(msg.c)
        const high = parseFloat(msg.h)
        const low = parseFloat(msg.l)
        const quoteVol = parseFloat(msg.q)
        pairsRef.current.set(symbol, {
          ...prev,
          price: formatPrice(price),
          priceUsd: `$${formatPrice(price)}`,
          high24h: `$${formatPrice(high)}`,
          low24h: `$${formatPrice(low)}`,
          volume: formatCompact(quoteVol),
        })
      }

      if (featuredRef.current.has(symbol)) {
        const prev = featuredRef.current.get(symbol)!
        const price = parseFloat(msg.c)
        const quoteVol = parseFloat(msg.q)
        featuredRef.current.set(symbol, {
          ...prev,
          price: formatPriceCompact(price),
          volume: formatCompact(quoteVol).replace('$', '') + ' (USD)',
        })
      }
    })

    const interval = setInterval(() => {
      setPairs(TABLE_SYMBOLS.filter((s) => pairsRef.current.has(s)).map((s) => pairsRef.current.get(s)!))
      setFeatured(FEATURED_SYMBOLS.filter((s) => featuredRef.current.has(s)).map((s) => featuredRef.current.get(s)!))
    }, 1000)

    return () => {
      clearInterval(interval)
      unsubscribe()
    }
  }, [loading, hasPairs])

  return { pairs, featured, loading, error, coinNames: COIN_NAMES }
}
