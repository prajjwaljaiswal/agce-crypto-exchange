import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../Trade/SocketContext.js'
import { marketApi } from '../../lib/matching-api.js'

function emptyTicker(symbol) {
  return {
    symbol,
    source: 'local',
    lastPrice: 0,
    priceChange: 0,
    priceChangePercent: 0,
    high: 0,
    low: 0,
    volume: 0,
    quoteVolume: 0,
    openPrice: 0,
    count: 0,
  }
}

function normalizeStream(t) {
  return {
    symbol: String(t.symbol ?? ''),
    source: t.source ?? 'local',
    lastPrice: Number(t.last ?? t.lastPrice ?? 0),
    priceChange: Number(t.priceChange ?? 0),
    priceChangePercent: Number(t.priceChangePercent ?? 0),
    high: Number(t.high ?? 0),
    low: Number(t.low ?? 0),
    volume: Number(t.volume ?? 0),
    quoteVolume: Number(t.quoteVolume ?? 0),
    openPrice: Number(t.open ?? t.openPrice ?? 0),
    count: Number(t.count ?? 0),
  }
}

export function useMarketTickers() {
  const { getSocket, isConnected } = useContext(SocketContext)
  const [tickers, setTickers] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    marketApi
      .symbols()
      .then((symbols) => {
        if (cancelled) return
        const map = {}
        for (const symbol of symbols ?? []) {
          if (!symbol) continue
          map[symbol] = emptyTicker(symbol)
        }
        setTickers(map)
        setIsLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        console.warn('[useMarketTickers] symbols bootstrap failed:', err.message)
        setError(err)
        setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const socket = getSocket()

    console.log('[useMarketTickers] socket:', socket, 'isConnected:', isConnected)

    if (!socket || !isConnected) return undefined

    socket.emit('subscribe', { channel: 'local_all_tickers' })

    const handleAllTickers = (event) => {
      const payload = event?.payload ?? event
      if (!payload) return
      const frames = Array.isArray(payload) ? payload : [payload]
      setTickers((prev) => {
        const next = { ...prev }
        for (const t of frames) {
          if (!t?.symbol) continue
          next[t.symbol] = normalizeStream(t)
        }
        return next
      })
    }

    socket.on('local:all_tickers', handleAllTickers)
    return () => {
      socket.emit('unsubscribe', { channel: 'local_all_tickers' })
      socket.off('local:all_tickers', handleAllTickers)
    }
  }, [getSocket, isConnected])

  return { tickers, isLoading, error }
}