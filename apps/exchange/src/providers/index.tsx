import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider.js'
import { AuthProvider } from './AuthProvider.js'
import { QueryProvider } from './QueryProvider.js'

export { useTheme } from './ThemeProvider.js'
export type { Theme } from './ThemeProvider.js'
export { useAuth } from './AuthProvider.js'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
