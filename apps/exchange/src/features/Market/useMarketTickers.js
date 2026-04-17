import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../Trade/SocketContext.js'
import { marketApi } from '../../lib/matching-api.js'

/**
 * Market-page data source — LOCAL AGCE pairs only, via the
 * `local_all_tickers` broadcast on market-data-service.
 *
 *   URL:       VITE_MARKET_DATA_URL  (gateway, e.g. http://192.168.1.13:8080)
 *   Path:      VITE_MARKET_DATA_PATH (/market-data/socket.io/)
 *   Subscribe: { channel: "local_all_tickers" }
 *   Event:     "local:all_tickers"  (array payload, every ~1s)
 *
 * REST seed on mount — `GET /api/v1/market/symbols` (matching-service
 * through the gateway) populates rows with zero placeholders instantly
 * so the table isn't blank while waiting for the first socket tick.
 * The socket then overlays live stats as trades happen on each pair.
 */

const MATCHING_BASE =
    import.meta.env.VITE_MATCHING_API_URL ||
    import.meta.env.VITE_AUTH_API_URL ||
    'http://localhost:8080'

/** "BTC-USDT" → "BTCUSDT"; match the FEATURED / UI symbol format. */
function normalizeKey(symbol) {
    return String(symbol || '').replace(/-/g, '').toUpperCase()
}

/** Zero-filled row used while a pair has no trade history yet. */
function emptyRow(meta) {
    // meta may be a plain string (legacy shape) or an object from
    // /api/v1/market/symbols carrying baseAsset / quoteAsset / iconUrl / etc.
    const sym = typeof meta === 'string' ? meta : meta?.symbol
    const refPrice = Number(meta?.referencePrice ?? 0) || 0
    return {
        symbol: normalizeKey(sym),
        baseAsset: typeof meta === 'object' ? meta?.baseAsset ?? null : null,
        quoteAsset: typeof meta === 'object' ? meta?.quoteAsset ?? null : null,
        iconUrl: typeof meta === 'object' ? meta?.iconUrl ?? null : null,
        // Seed with the server-provided reference price so the table doesn't
        // render zeros before the first socket frame arrives.
        lastPrice: refPrice,
        priceChange: 0,
        priceChangePercent: 0,
        high: refPrice,
        low: refPrice,
        volume: 0,
        quoteVolume: 0,
        openPrice: refPrice,
        count: 0,
    }
}

/** Map a `local_all_tickers` row → the shape Market/index.jsx consumes. */
function normalizeLocal(t) {
    const last = Number(t.last ?? 0)
    const volume = Number(t.volume ?? 0)
    return {
        symbol: normalizeKey(t.symbol),
        lastPrice: last,
        priceChange: Number(t.priceChange ?? 0),
        priceChangePercent: Number(t.priceChangePercent ?? 0),
        high: Number(t.high ?? 0),
        low: Number(t.low ?? 0),
        volume,
        // local ticker doesn't emit quoteVolume — estimate as base vol × last.
        quoteVolume: last * volume,
        openPrice: Number(t.open ?? 0),
        count: Number(t.count ?? 0),
    }
}

export function useMarketTickers() {
    const { getSocket, isConnected } = useContext(SocketContext)
    const [tickers, setTickers] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // REST seed — get the pair list up so the table isn't empty while
    // we wait for the first socket frame.
    useEffect(() => {
        let cancelled = false
        const url = `${MATCHING_BASE.replace(/\/$/, '')}/api/v1/market/symbols`
        fetch(url)
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
            .then((body) => {
                if (cancelled) return
                // matching-service returns { success, data: [...] }; tolerate either shape.
                const symbols = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : []
                const seed = {}
                for (const s of symbols) {
                    // Each entry may be a plain "BTC-USDT" string or an object with
                    // { symbol, baseAsset, quoteAsset, iconUrl, referencePrice, ... }.
                    const sym = typeof s === 'string' ? s : s?.symbol
                    const key = normalizeKey(sym)
                    if (key) seed[key] = emptyRow(s)
                }
                setTickers((prev) => ({ ...seed, ...prev }))
                setIsLoading(false)
                setError(null)
            })
            .catch((err) => {
                if (cancelled) return
                console.warn('[useMarketTickers] /market/symbols seed failed:', err.message)
                setError(err)
                setIsLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    // Live overlay — subscribe to local_all_tickers, merge every frame.
    useEffect(() => {
        const socket = getSocket()
        if (!socket || !isConnected) return undefined

        socket.emit('subscribe', { channel: 'local_all_tickers' })

        const handle = (payload) => {
            const rows = Array.isArray(payload) ? payload : [payload]
            if (!rows.length) return
            setTickers((prev) => {
                const next = { ...prev }
                for (const raw of rows) {
                    if (!raw?.symbol) continue
                    const row = normalizeLocal(raw)
                    // Preserve REST-seeded metadata (iconUrl, baseAsset, quoteAsset)
                    // that the socket frame doesn't carry.
                    const existing = next[row.symbol]
                    next[row.symbol] = {
                        iconUrl: existing?.iconUrl ?? null,
                        baseAsset: existing?.baseAsset ?? null,
                        quoteAsset: existing?.quoteAsset ?? null,
                        ...row,
                    }
                }
                return next
            })
            // Any real frame clears a stale "failed" state from the REST seed.
            setError(null)
            setIsLoading(false)
        }

        socket.on('local:all_tickers', handle)
        return () => {
            socket.emit('unsubscribe', { channel: 'local_all_tickers' })
            socket.off('local:all_tickers', handle)
        }
    }, [getSocket, isConnected])

    return { tickers, isLoading, error }
}