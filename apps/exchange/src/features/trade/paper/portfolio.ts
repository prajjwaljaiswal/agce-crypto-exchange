import { useEffect, useMemo, useState } from 'react'
import { subscribeAllTickers } from '@agce/binance'
import { usePaperState } from './hooks.ts'
import type { PaperBalance } from './types.ts'

export interface PortfolioPosition {
  asset: string
  free: number
  locked: number
  total: number
  priceUsdt: number       // live USDT price (1 for USDT/stables)
  valueUsdt: number       // total * priceUsdt
  changePct: number       // 24h % change from Binance ticker
}

export interface PortfolioSnapshot {
  totalValueUsdt: number
  change24hUsdt: number   // signed $ change in total value over the 24h window
  change24hPct: number    // weighted-avg % change
  positions: PortfolioPosition[]
}

/**
 * Live portfolio valuation.
 * Opens a single !ticker@arr WebSocket and maps each asset balance to its current USDT price.
 * Stable-coins valued 1:1. Assets without a <ASSET>USDT pair on Binance valued 0.
 */
export function usePaperPortfolio(): PortfolioSnapshot {
  const state = usePaperState()
  const [prices, setPrices] = useState<Record<string, { price: number; changePct: number }>>({})

  useEffect(() => {
    const unsub = subscribeAllTickers((tickers) => {
      // Build a snapshot map in one pass, then commit once.
      const next: Record<string, { price: number; changePct: number }> = {}
      for (const t of tickers) {
        if (!t.s.endsWith('USDT')) continue
        const base = t.s.slice(0, -4)
        next[base] = { price: parseFloat(t.c), changePct: parseFloat(t.P) }
      }
      next['USDT'] = { price: 1, changePct: 0 }
      setPrices(next)
    })
    return unsub
  }, [])

  return useMemo(() => {
    const positions: PortfolioPosition[] = []
    let totalValueUsdt = 0
    let totalValueYesterdayUsdt = 0

    const allAssets = new Set<string>(Object.keys(state.balances))
    for (const b of Object.values(state.balances) as PaperBalance[]) {
      const asset = b.asset
      const total = b.free + b.locked
      if (total === 0 && !allAssets.has(asset)) continue
      const priced = prices[asset]
      const priceUsdt = priced?.price ?? (asset === 'USDT' ? 1 : 0)
      const changePct = priced?.changePct ?? 0
      const valueUsdt = total * priceUsdt
      totalValueUsdt += valueUsdt
      // Reverse-engineer yesterday value from current + 24h %.
      // valueYesterday = value / (1 + pct/100)
      if (priceUsdt > 0 && (1 + changePct / 100) > 0) {
        totalValueYesterdayUsdt += valueUsdt / (1 + changePct / 100)
      } else {
        totalValueYesterdayUsdt += valueUsdt
      }
      positions.push({
        asset,
        free: b.free,
        locked: b.locked,
        total,
        priceUsdt,
        valueUsdt,
        changePct,
      })
    }
    positions.sort((a, b) => b.valueUsdt - a.valueUsdt)

    const change24hUsdt = totalValueUsdt - totalValueYesterdayUsdt
    const change24hPct = totalValueYesterdayUsdt > 0
      ? (change24hUsdt / totalValueYesterdayUsdt) * 100
      : 0

    return { totalValueUsdt, change24hUsdt, change24hPct, positions }
  }, [state.balances, prices])
}
