import type { ReactNode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from './ThemeProvider.js'
import { AuthProvider } from './AuthProvider.js'
import { QueryProvider } from './QueryProvider.js'

export { useTheme } from './ThemeProvider.js'
export type { Theme } from './ThemeProvider.js'
export { useAuth } from './AuthProvider.js'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined ?? ''

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    </GoogleOAuthProvider>
  )
}
