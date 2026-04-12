import { useSyncExternalStore, useMemo } from 'react'
import { paperStore } from './store.ts'
import type { PaperBalance, PaperOrder, PaperState, PaperTrade } from './types.ts'

/**
 * Full-state subscription. Components may read any slice — React re-renders
 * only on state-reference change (setState always yields a new top-level object).
 * Derived slices should be wrapped in useMemo to avoid downstream re-renders.
 */
export function usePaperState(): PaperState {
  return useSyncExternalStore(
    paperStore.subscribe,
    paperStore.getState,
    paperStore.getState,
  )
}

export function useBalance(asset: string): PaperBalance {
  const state = usePaperState()
  const b = state.balances[asset]
  return useMemo(() => b ?? { asset, free: 0, locked: 0 }, [b, asset])
}

export function useOpenOrders(symbol?: string): PaperOrder[] {
  const state = usePaperState()
  return useMemo(
    () => (symbol ? state.openOrders.filter((o) => o.symbol === symbol) : state.openOrders),
    [state.openOrders, symbol],
  )
}

export function useOrderHistory(symbol?: string): PaperOrder[] {
  const state = usePaperState()
  return useMemo(
    () => (symbol ? state.orderHistory.filter((o) => o.symbol === symbol) : state.orderHistory),
    [state.orderHistory, symbol],
  )
}

export function useTradeHistory(symbol?: string): PaperTrade[] {
  const state = usePaperState()
  return useMemo(
    () => (symbol ? state.tradeHistory.filter((t) => t.symbol === symbol) : state.tradeHistory),
    [state.tradeHistory, symbol],
  )
}
