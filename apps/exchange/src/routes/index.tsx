import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicLayout } from '../layouts/index.js'
import { ComingSoonPage } from '../features/coming-soon/index.js'
import { publicRoutes } from './public.routes.js'
import { authRoutes } from './auth.routes.js'
import { profileRoutes } from './profile.routes.js'

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
        <Routes>
          {publicRoutes()}
          {authRoutes()}
          {profileRoutes()}

          {/* Fallback */}
          <Route element={<PublicLayout />}>
            <Route path="*" element={<ComingSoonPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}
