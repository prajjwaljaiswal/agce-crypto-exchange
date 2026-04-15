import { Route, Routes, useLocation } from 'react-router-dom'
import { AppProviders } from './providers/index.js'
import { UserHeader } from './components/layout/UserHeader.js'
import { Footer } from './components/layout/Footer.js'
import { RequireAuth } from './components/auth/RequireAuth.js'
import { RequireGuest } from './components/auth/RequireGuest.js'
import {
  AssetManagementLayout,
  DepositPage,
  DepositFiatPage,
  WithdrawPage,
} from './features/asset-management/index.js'
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
import {
  ActivityLogs,
  AssetOverview,
  Dashboard,
  Earning,
  EarningHistory,
  KycVerification,
  Notifications,
  OpenOrders,
  ProfileLayout,
  Settings,
  SpotOrders,
  Support,
  Swap,
  SwapHistory,
  TransactionHistory,
  TwoFactor,
  WalletTransferHistory,
} from './features/user-profile/index.js'
import './App.css'

const NO_FOOTER_ROUTE_PREFIXES = [
  '/signup',
  '/login',
  '/forgot_password',
  '/account-verification',
  '/account-activate',
  '/user_profile',
  '/asset_management',
]

function AppInner() {
  const { pathname } = useLocation()
  const hideFooter = NO_FOOTER_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  )

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
          <Route element={<RequireGuest />}>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot_password" element={<ForgotPassword />} />
          </Route>
          <Route path="/account-verification/:authenticationToken" element={<RegistrationVerification />} />
          <Route path="/account-activate/:authenticationToken" element={<RegistrationResult />} />
          <Route element={<RequireAuth />}>
            <Route path="/user_profile" element={<ProfileLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="asset_overview" element={<AssetOverview />} />
              <Route path="spot_orders" element={<SpotOrders />} />
              <Route path="open_orders" element={<OpenOrders />} />
              <Route path="transaction_history" element={<TransactionHistory />} />
              <Route path="swap_history" element={<SwapHistory />} />
              <Route path="wallet_transfer_history" element={<WalletTransferHistory />} />
              <Route path="earning_plan_history" element={<EarningHistory />} />
              <Route path="profile_setting" element={<Settings />} />
              <Route path="kyc" element={<KycVerification />} />
              <Route path="support" element={<Support />} />
              <Route path="two_factor_authentication" element={<TwoFactor />} />
              <Route path="swap" element={<Swap />} />
              <Route path="notification" element={<Notifications />} />
              <Route path="activity_logs" element={<ActivityLogs />} />
            </Route>

            <Route path="/asset_management" element={<AssetManagementLayout />}>
              <Route index element={<DepositPage />} />
              <Route path="deposit" element={<DepositPage />} />
              <Route path="deposit_fiat" element={<DepositFiatPage />} />
              <Route path="withdraw" element={<WithdrawPage />} />
            </Route>
          </Route>

          <Route path="/earning" element={<Earning />} />
          <Route path="*" element={<div className="container py-5">Coming soon</div>} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
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
