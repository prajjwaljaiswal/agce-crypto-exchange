import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../Trade/SocketContext.js'

const RAW_URL = import.meta.env.VITE_MARKET_DATA_URL || 'http://localhost:8080'
const MARKET_DATA_ORIGIN = (() => {
  try {
    return new URL(RAW_URL).origin
  } catch {
    return RAW_URL
  }
})()
const REST_PREFIX = import.meta.env.VITE_MARKET_DATA_REST_PREFIX || '/market-data'
const REST_BASE = `${MARKET_DATA_ORIGIN}${REST_PREFIX}`

function normalizeRest(row) {
  return {
    symbol: row.symbol,
    lastPrice: Number(row.lastPrice),
    priceChange: Number(row.priceChange),
    priceChangePercent: Number(row.priceChangePercent),
    high: Number(row.highPrice),
    low: Number(row.lowPrice),
    volume: Number(row.volume),
    quoteVolume: Number(row.quoteVolume),
    openPrice: Number(row.openPrice),
    count: Number(row.count) || 0,
  }
}

function normalizeStream(t) {
  return {
    symbol: t.s,
    lastPrice: Number(t.c),
    priceChange: Number(t.p),
    priceChangePercent: Number(t.P),
    high: Number(t.h),
    low: Number(t.l),
    volume: Number(t.v),
    quoteVolume: Number(t.q),
    openPrice: Number(t.o),
    count: Number(t.n) || 0,
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
    fetch(`${REST_BASE}/api/v1/binance/ticker/24hr`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((rows) => {
        if (cancelled) return
        const map = {}
        for (const row of rows) {
          if (!row?.symbol) continue
          map[row.symbol] = normalizeRest(row)
        }
        setTickers(map)
        setIsLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        console.warn('[useMarketTickers] REST bootstrap failed:', err.message)
        setError(err)
        setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const socket = getSocket()
    if (!socket || !isConnected) return undefined

    socket.emit('subscribe', { channel: 'all_tickers' })

    const handleData = (event) => {
      if (!event || (event.channel !== 'all_tickers' && event.channel !== 'ticker')) return
      const payload = event.payload
      if (!payload) return
      const frames = Array.isArray(payload) ? payload : [payload]
      setTickers((prev) => {
        const next = { ...prev }
        for (const t of frames) {
          if (!t?.s) continue
          next[t.s] = normalizeStream(t)
        }
        return next
      })
    }

    socket.on('data', handleData)
    return () => {
      socket.emit('unsubscribe', { channel: 'all_tickers' })
      socket.off('data', handleData)
    }
  }, [getSocket, isConnected])

  return { tickers, isLoading, error }
}
