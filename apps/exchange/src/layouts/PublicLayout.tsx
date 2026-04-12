import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar.js'
import { Footer } from '../components/layout/Footer.js'

export function PublicLayout({ showFooter = false }: { showFooter?: boolean }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </>
  )
}
