import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider.js'
import { PlatformStatusProvider } from './PlatformStatusProvider.js'
import { AuthProvider } from '../store/authStore.js'

// ─── Root provider wrapper ────────────────────────────────────────────────────

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PlatformStatusProvider>
          {children}
        </PlatformStatusProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { useTheme } from './ThemeProvider.js'
export { usePlatformStatus } from './PlatformStatusProvider.js'
export type { ModuleKey, ModuleStatus } from './PlatformStatusProvider.js'
