import { createContext, useContext, type ReactNode } from 'react'

type FeatureKey = 'spot_trading' | 'futures_trading' | 'withdraw' | 'deposit' | string

interface FeatureStatus {
  enabled: boolean
  message?: string
}

interface PlatformStatusContextValue {
  getStatus: (feature: FeatureKey) => FeatureStatus
}

const DEFAULT_STATUS: FeatureStatus = { enabled: true }

const PlatformStatusContext = createContext<PlatformStatusContextValue>({
  getStatus: () => DEFAULT_STATUS,
})

export function PlatformStatusProvider({ children }: { children: ReactNode }) {
  const getStatus = (_feature: FeatureKey): FeatureStatus => {
    return DEFAULT_STATUS
  }

  return (
    <PlatformStatusContext.Provider value={{ getStatus }}>
      {children}
    </PlatformStatusContext.Provider>
  )
}

export function usePlatformStatus(): PlatformStatusContextValue {
  return useContext(PlatformStatusContext)
}
