import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../Trade/SocketContext.js'

/** "BTC/USDT" or "BTC-USDT" → "BTCUSDT" */
function normalizeKey(symbol) {
    return String(symbol || '').replace(/[/\-]/g, '').toUpperCase()
}

const MATCHING_BASE = (
    import.meta.env.VITE_MATCHING_API_URL ||
    import.meta.env.VITE_AUTH_API_URL ||
    'http://localhost:8080'
).replace(/\/$/, '')

/** Prefix a relative icon path with the API base URL. */
function resolveIcon(path) {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${MATCHING_BASE}${path}`
}

/** Normalize a ticker from the ui:categories payload shape. */
function normalizeTicker(t) {
    return {
        symbol: normalizeKey(t.symbol),
        baseAsset: t.baseAsset ?? null,
        quoteAsset: t.quoteAsset ?? null,
        baseName: t.baseName ?? null,
        baseIconUrl: resolveIcon(t.baseIconUrl),
        lastPrice: Number(t.price ?? 0),
        priceChange: Number(t.priceChange ?? 0),
        priceChangePercent: Number(t.priceChangePercent ?? 0),
        high: Number(t.high ?? 0),
        low: Number(t.low ?? 0),
        volume: Number(t.volume ?? 0),
        quoteVolume: Number(t.quoteVolume ?? 0),
        openPrice: Number(t.open ?? 0),
        count: Number(t.count ?? 0),
        marketCap: Number(t.marketCap ?? 0),
    }
}

const EMPTY_CATEGORIES = { trending: [], hot: [], new_listing: [], top_gainers: [] }

function applyCategories(data, setTickers, setCategories, setIsLoading, setError) {
    if (!data || typeof data !== 'object') return
    const tickerMap = {}
    const catKeys = {}
    for (const [cat, items] of Object.entries(data)) {
        if (!Array.isArray(items)) continue
        catKeys[cat] = []
        for (const raw of items) {
            if (!raw?.symbol) continue
            const row = normalizeTicker(raw)
            tickerMap[row.symbol] = row
            catKeys[cat].push(row.symbol)
        }
    }
    setTickers((prev) => {
        const next = { ...tickerMap }
        for (const sym of Object.keys(next)) {
            next[sym] = {
                ...next[sym],
                // Icons come from the REST seed; socket updates must not overwrite them.
                baseIconUrl: prev[sym]?.baseIconUrl ?? next[sym].baseIconUrl,
            }
        }
        return next
    })
    setCategories((prev) => ({ ...prev, ...catKeys }))
    setIsLoading(false)
    if (setError) setError(null)
}

export function useMarketTickers() {
    const { getSocket, isConnected } = useContext(SocketContext)
    const [tickers, setTickers] = useState({})
    const [categories, setCategories] = useState(EMPTY_CATEGORIES)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // REST seed — populate immediately on mount before socket connects.
    useEffect(() => {
        let cancelled = false
        const url = `${MATCHING_BASE.replace(/\/$/, '')}/api/v1/market-data/ui-categories`
        fetch(url)
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
            .then((body) => {
                if (cancelled) return
                // Response: { success: true, data: { ts, categories: { trending, hot, new_listing, top_gainers } } }
                const categories = body?.data?.categories
                applyCategories(categories, setTickers, setCategories, setIsLoading, setError)
            })
            .catch((err) => {
                if (cancelled) return
                console.warn('[useMarketTickers] REST seed failed:', err.message)
                setError(err)
                setIsLoading(false)
            })
        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        const socket = getSocket()
        if (!socket || !isConnected) return undefined

        socket.emit('subscribe', { channel: 'ui_categories' })

        const handle = (payload) => {
            // payload: { ts, categories: {...} } or bare categories object
            const data = payload?.categories ?? payload
            applyCategories(data, setTickers, setCategories, setIsLoading, setError)
        }

        socket.on('ui:categories', handle)
        return () => {
            socket.emit('unsubscribe', { channel: 'ui_categories' })
            socket.off('ui:categories', handle)
        }
    }, [getSocket, isConnected])

    return { tickers, categories, isLoading, error }
}
