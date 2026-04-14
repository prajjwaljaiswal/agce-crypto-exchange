import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider.js'

export { useTheme } from './ThemeProvider.js'
export type { Theme } from './ThemeProvider.js'

export function AppProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
