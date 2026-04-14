import { Route, Routes, useLocation } from 'react-router-dom'
import { AppProviders } from './providers/index.js'
import { UserHeader } from './components/layout/UserHeader.js'
import { Footer } from './components/layout/Footer.js'
import { LandingPage } from './features/landing-page/index.js'
import { Announcement } from './features/announcements/index.js'
import { AnnouncementList } from './features/announcements/list.js'
import { AnnouncementDetails } from './features/announcements/details.js'
import { UsdMFutures } from './features/futures/UsdMFutures.js'
import { SignupPage } from './features/auth/SignupPage.js'
import { LoginPage } from './features/auth/LoginPage.js'
import { ForgotPassword } from './features/auth/ForgotPassword.js'
import { RegistrationVerification } from './features/auth/RegistrationVerification.js'
import { RegistrationResult } from './features/auth/RegistrationResult.js'
import './App.css'

const AUTH_ROUTE_PREFIXES = [
  '/signup',
  '/login',
  '/forgot_password',
  '/account-verification',
  '/account-activate',
]

function AppInner() {
  const { pathname } = useLocation()
  const isAuthRoute = AUTH_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  return (
    <>
      <UserHeader />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route
            path="/announcement_list/:title/:announce_title_id"
            element={<AnnouncementList />}
          />
          <Route
            path="/announcement_details/:title/:announce_title_id"
            element={<AnnouncementDetails />}
          />
          <Route path="/usd_futures/:pairs" element={<UsdMFutures />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/account-verification/:authenticationToken" element={<RegistrationVerification />} />
          <Route path="/account-activate/:authenticationToken" element={<RegistrationResult />} />
          <Route path="*" element={<div className="container py-5">Coming soon</div>} />
        </Routes>
      </main>
      {!isAuthRoute && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <AppProviders>
      <AppInner />
    </AppProviders>
  )
}
