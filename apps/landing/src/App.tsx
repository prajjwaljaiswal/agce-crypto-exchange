import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { Navbar } from './components/layout/Navbar.js'
import { Footer } from './components/layout/Footer.js'
import { HomePage } from './pages/HomePage.js'
import { FeaturesPage } from './pages/FeaturesPage.js'
import { FeesPage } from './pages/FeesPage.js'
import { SecurityPage } from './pages/SecurityPage.js'
import { CompliancePage } from './pages/CompliancePage.js'
import { AboutPage } from './pages/AboutPage.js'
import { useInstanceConfig } from '@agce/hooks'

export default function App() {
  const config = useInstanceConfig()

  // Apply instance theme tokens to :root
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', config.theme.primaryColor)
    root.style.setProperty('--color-accent', config.theme.accentColor)
    // Derive hover from primary (slightly darker via opacity trick)
    root.style.setProperty('--color-primary-hover', config.theme.primaryColor)
    document.title = `${config.name} — Arab Global Crypto Exchange`
  }, [config])

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
