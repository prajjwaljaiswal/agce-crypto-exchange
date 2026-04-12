import type { PaperState } from './types.ts'

const STORAGE_KEY = 'agce.paper.v1'

function seedState(): PaperState {
  return {
    balances: {
      USDT: { asset: 'USDT', free: 10000, locked: 0 },
      BTC:  { asset: 'BTC',  free: 0.1,   locked: 0 },
      ETH:  { asset: 'ETH',  free: 2,     locked: 0 },
      BNB:  { asset: 'BNB',  free: 10,    locked: 0 },
      SOL:  { asset: 'SOL',  free: 50,    locked: 0 },
    },
    openOrders: [],
    orderHistory: [],
    tradeHistory: [],
    seeded: true,
  }
}

function loadState(): PaperState {
  if (typeof window === 'undefined') return seedState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedState()
    const parsed = JSON.parse(raw) as PaperState
    if (!parsed.seeded) return seedState()
    return parsed
  } catch {
    return seedState()
  }
}

function persistState(state: PaperState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota or serialization issue — silently ignore */
  }
}

type Listener = () => void

export interface PaperStore {
  getState: () => PaperState
  setState: (updater: (prev: PaperState) => PaperState) => void
  subscribe: (listener: Listener) => () => void
  reset: () => void
}

function createPaperStore(): PaperStore {
  let state = loadState()
  const listeners = new Set<Listener>()

  const getState = () => state

  const setState = (updater: (prev: PaperState) => PaperState) => {
    const next = updater(state)
    if (next === state) return
    state = next
    persistState(state)
    listeners.forEach((l) => l())
  }

  const subscribe = (listener: Listener) => {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }

  const reset = () => {
    state = seedState()
    persistState(state)
    listeners.forEach((l) => l())
  }

  return { getState, setState, subscribe, reset }
}

/** Singleton paper-trading store shared across the exchange app. */
export const paperStore = createPaperStore()
