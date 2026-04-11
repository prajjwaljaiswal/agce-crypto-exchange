import { useEffect } from 'react'
import { useInstanceConfig } from '@agce/hooks'
import { AppProviders } from './providers/index.js'
import { AppRouter } from './routes/index.js'

function AppInner() {
  const config = useInstanceConfig()

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', config.theme.primaryColor)
    root.style.setProperty('--color-primary-hover', config.theme.accentColor)
    document.title = `${config.name} — Arab Global Crypto Exchange`
  }, [config])

  return <AppRouter />
}

export default function App() {
  return (
    <AppProviders>
      <AppInner />
    </AppProviders>
  )
}
