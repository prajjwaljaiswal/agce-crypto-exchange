import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider.js'
import { PlatformStatusProvider } from './PlatformStatusProvider.js'

// ─── Root provider wrapper ────────────────────────────────────────────────────

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <PlatformStatusProvider>
        {children}
      </PlatformStatusProvider>
    </ThemeProvider>
  )
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { useTheme } from './ThemeProvider.js'
export { usePlatformStatus } from './PlatformStatusProvider.js'
export type { ModuleKey, ModuleStatus } from './PlatformStatusProvider.js'
