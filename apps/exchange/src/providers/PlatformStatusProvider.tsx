import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────

export type ModuleKey =
  | 'spot_trading'
  | 'futures_trading'
  | 'p2p_trading'
  | 'staking'
  | 'launchpad'
  | 'swap'
  | 'deposit'
  | 'withdrawal'
  | 'full_maintenance'

export interface ModuleStatus {
  enabled: boolean
  scheduled_at: string | null
  scheduled_action: string | null
}

type PlatformStatus = Record<ModuleKey, ModuleStatus>

interface PlatformStatusContextValue {
  platformStatus: PlatformStatus
  loading: boolean
  refetch: () => void
  isFullMaintenance: boolean
  getStatus: (key: ModuleKey) => ModuleStatus
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_STATUS: PlatformStatus = {
  spot_trading:     { enabled: true,  scheduled_at: null, scheduled_action: null },
  futures_trading:  { enabled: true,  scheduled_at: null, scheduled_action: null },
  p2p_trading:      { enabled: true,  scheduled_at: null, scheduled_action: null },
  staking:          { enabled: true,  scheduled_at: null, scheduled_action: null },
  launchpad:        { enabled: true,  scheduled_at: null, scheduled_action: null },
  swap:             { enabled: true,  scheduled_at: null, scheduled_action: null },
  deposit:          { enabled: true,  scheduled_at: null, scheduled_action: null },
  withdrawal:       { enabled: true,  scheduled_at: null, scheduled_action: null },
  full_maintenance: { enabled: false, scheduled_at: null, scheduled_action: null },
}

// ─── Context ─────────────────────────────────────────────────────────────────

const PlatformStatusContext = createContext<PlatformStatusContextValue>({
  platformStatus: DEFAULT_STATUS,
  loading: false,
  refetch: () => {},
  isFullMaintenance: false,
  getStatus: (key) => DEFAULT_STATUS[key],
})

// ─── Provider ────────────────────────────────────────────────────────────────

export function PlatformStatusProvider({ children }: { children: ReactNode }) {
  // Phase 2: replace with real API poll (see legacy src/context/PlatformStatusProvider.jsx)
  const [platformStatus] = useState<PlatformStatus>(DEFAULT_STATUS)

  const getStatus = useCallback(
    (key: ModuleKey): ModuleStatus => platformStatus[key] ?? DEFAULT_STATUS[key],
    [platformStatus],
  )

  return (
    <PlatformStatusContext.Provider
      value={{
        platformStatus,
        loading: false,
        refetch: () => {},
        isFullMaintenance: platformStatus.full_maintenance.enabled,
        getStatus,
      }}
    >
      {children}
    </PlatformStatusContext.Provider>
  )
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function usePlatformStatus(): PlatformStatusContextValue {
  return useContext(PlatformStatusContext)
}
