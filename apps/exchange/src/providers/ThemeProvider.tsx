import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'agce:theme'

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  // The pre-React bootstrap script in index.html sets data-theme synchronously
  // from the same sources. Reading it first keeps React in sync with whatever
  // the page already painted, avoiding a second flip on mount.
  const fromDom = document.documentElement.getAttribute('data-theme')
  if (fromDom === 'light' || fromDom === 'dark') return fromDom
  // Fallback path (storage blocked, attribute stripped, etc.) — try storage,
  // then the legacy `theme` key, then OS preference.
  const stored = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
  return prefersLight ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    // Mirror to legacy `body.light_theme` class — older CSS rules and
    // chart helpers (chartThemeFromBody.js) still read this class.
    if (theme === 'light') document.body.classList.add('light_theme')
    else document.body.classList.remove('light_theme')
    window.localStorage.setItem(STORAGE_KEY, theme)
    // Mirror to legacy storage key used by UserHeader.toggleTheme.
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const setTheme = useCallback((next: Theme) => setThemeState(next), [])
  const toggleTheme = useCallback(() => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}
