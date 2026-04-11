import { useEffect } from 'react'
import { useInstanceConfig } from '@agce/hooks'
import { Navbar } from './components/layout/Navbar.js'
import { Footer } from './components/layout/Footer.js'
import { HomePage } from './pages/HomePage.js'
import { AppProviders } from './providers/index.js'

// ─── Inner app — consumes providers ──────────────────────────────────────────

function AppInner() {
  const config = useInstanceConfig()

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', config.theme.primaryColor)
    root.style.setProperty('--color-primary-hover', config.theme.accentColor)
    document.title = `${config.name} — Arab Global Crypto Exchange`
  }, [config])

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  )
}

// ─── Root — mounts providers ──────────────────────────────────────────────────

export default function App() {
  return (
    <AppProviders>
      <AppInner />
    </AppProviders>
  )
}
