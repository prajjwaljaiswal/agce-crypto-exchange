import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar.js'
import { Footer } from '../components/layout/Footer.js'

// ─── Layouts ─────────────────────────────────────────────────────────────────
import { ProfileSidebar } from '../components/layout/ProfileSidebar.js'

// ─── Pages ───────────────────────────────────────────────────────────────────
import { LandingPage } from '../pages/landing-page/index.js'
import { LoginPage } from '../pages/auth/login/index.js'
import { SignupPage } from '../pages/auth/signup/index.js'
import { ForgotPasswordPage } from '../pages/auth/forgot-password/index.js'
import { MarketPage } from '../pages/market/index.js'
import { EarningPage } from '../pages/earning/index.js'
import { SwapPage } from '../pages/swap/index.js'
import { ReferralPage } from '../pages/referral/index.js'
import { LaunchpadPage } from '../pages/launchpad/index.js'
import { FeesPage } from '../pages/fees/index.js'
import { ContactPage } from '../pages/contact/index.js'
import { FAQPage } from '../pages/faq/index.js'
import { BlogListPage } from '../pages/blog/list/index.js'
import { BlogDetailsPage } from '../pages/blog/details/index.js'
import { AboutPage } from '../pages/about/index.js'
import { AnnouncementPage } from '../pages/announcements/index.js'

// Policy pages
import { TermsOfUsePage } from '../pages/legal/terms-of-use/index.js'
import { PrivacyPolicyPage } from '../pages/legal/privacy-policy/index.js'
import { AmlPolicyPage } from '../pages/legal/aml-policy/index.js'
import { RiskDisclosurePage } from '../pages/legal/risk-disclosure/index.js'
import { GeneralDisclaimerPage } from '../pages/legal/general-disclaimer/index.js'
import { ComplaintsPage } from '../pages/legal/complaints/index.js'

// Protected pages
import { DashboardPage } from '../pages/profile/dashboard/index.js'
import { SettingsPage } from '../pages/profile/settings/index.js'
import { SecurityPage } from '../pages/profile/security/index.js'
import { KycPage } from '../pages/profile/kyc/index.js'
import { WalletPage } from '../pages/profile/wallet/index.js'
import { AssetOverviewPage } from '../pages/profile/asset-overview/index.js'
import { DepositPage } from '../pages/profile/deposit/index.js'
import { WithdrawPage } from '../pages/profile/withdraw/index.js'
import { SpotOrdersPage } from '../pages/profile/orders/spot/index.js'
import { OpenOrdersPage } from '../pages/profile/orders/open/index.js'
import { TransactionHistoryPage } from '../pages/profile/orders/transactions/index.js'
import { SwapHistoryPage } from '../pages/profile/orders/swap-history/index.js'
import { WalletTransferHistoryPage } from '../pages/profile/orders/wallet-transfer/index.js'
import { EarningHistoryPage } from '../pages/profile/orders/earning-history/index.js'
import { BonusHistoryPage } from '../pages/profile/orders/bonus-history/index.js'
import { NotificationPage } from '../pages/profile/notifications/index.js'
import { ActivityLogPage } from '../pages/profile/activity-log/index.js'
import { SupportPage } from '../pages/profile/support/index.js'
import { TwoFactorPage } from '../pages/profile/two-factor/index.js'

import { ComingSoonPage } from '../pages/coming-soon/index.js'

// ─── Auth guard ──────────────────────────────────────────────────────────────

// DEV ONLY: auto-set a fake token so protected routes are accessible
if (import.meta.env.DEV && !localStorage.getItem('token')) {
  localStorage.setItem('token', 'dev-fake-token')
}

function useAuth() {
  const token = localStorage.getItem('token')
  return { isAuthenticated: !!token }
}

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

function GuestRoute() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/user_profile/dashboard" replace />
  return <Outlet />
}

// ─── Layout wrappers ─────────────────────────────────────────────────────────

function PublicLayout({ showFooter = false }: { showFooter?: boolean }) {
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

function ProfileLayout() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)]">
        <ProfileSidebar />
        <div className="flex-1 min-w-0 px-8 py-5">
          <Outlet />
        </div>
      </div>
    </>
  )
}

function AuthLayout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0E0E0E' }}>
      <Outlet />
    </div>
  )
}

// ─── Router ──────────────────────────────────────────────────────────────────

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
        <Routes>
          {/* Landing page — with footer (dev redirects to dashboard) */}
          <Route element={<PublicLayout showFooter />}>
            <Route index element={
              import.meta.env.DEV
                ? <Navigate to="/user_profile/dashboard" replace />
                : <LandingPage />
            } />
          </Route>

          {/* Auth pages — guest only */}
          <Route element={<AuthLayout />}>
            <Route element={<GuestRoute />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="forgot_password" element={<ForgotPasswordPage />} />
              <Route path="account-verification/:authenticationToken" element={<ComingSoonPage />} />
              <Route path="account-activate/:authenticationToken" element={<ComingSoonPage />} />
            </Route>
          </Route>

          {/* Public pages — with navbar, no footer */}
          <Route element={<PublicLayout />}>
            <Route path="market" element={<MarketPage />} />
            <Route path="earning" element={<EarningPage />} />
            <Route path="fees" element={<FeesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="FAQ" element={<FAQPage />} />
            <Route path="blogs" element={<BlogListPage />} />
            <Route path="blogdetails" element={<BlogDetailsPage />} />
            <Route path="aboutus" element={<AboutPage />} />
            <Route path="refer_earn" element={<ReferralPage />} />
            <Route path="launchpad" element={<LaunchpadPage />} />
            <Route path="announcement" element={<AnnouncementPage />} />
            <Route path="notification" element={<NotificationPage />} />

            {/* Trade & Futures */}
            <Route path="trade/:pairs" element={<ComingSoonPage />} />
            <Route path="usd_futures/:pairs" element={<ComingSoonPage />} />
            <Route path="meme" element={<ComingSoonPage />} />
            <Route path="coin_list" element={<ComingSoonPage />} />
            <Route path="token" element={<ComingSoonPage />} />
            <Route path="security_system" element={<ComingSoonPage />} />
            <Route path="coming-soon" element={<ComingSoonPage />} />

            {/* Announcement sub-routes */}
            <Route path="announcement_list/:title/:announce_title_id" element={<AnnouncementPage />} />
            <Route path="announcement_details/:title/:announce_title_id" element={<AnnouncementPage />} />

            {/* Launchpad sub-routes */}
            <Route path="launchpadCoin_Details/:id" element={<ComingSoonPage />} />

            {/* Legal / Policy */}
            <Route path="TermsofUse" element={<TermsOfUsePage />} />
            <Route path="PrivacyDataProtectionPolicy" element={<PrivacyPolicyPage />} />
            <Route path="aml-kyc-policy" element={<AmlPolicyPage />} />
            <Route path="RiskDisclosure" element={<RiskDisclosurePage />} />
            <Route path="general-disclaimer" element={<GeneralDisclaimerPage />} />
            <Route path="complaints-handling-procedure" element={<ComplaintsPage />} />
          </Route>

          {/* Protected — Profile sidebar layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="user_profile" element={<ProfileLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="asset_overview" element={<AssetOverviewPage />} />
              <Route path="wallet/:walletType" element={<WalletPage />} />
              <Route path="profile_setting" element={<SettingsPage />} />
              <Route path="kyc" element={<KycPage />} />
              <Route path="two_factor_autentication" element={<TwoFactorPage />} />
              <Route path="activity_logs" element={<ActivityLogPage />} />
              <Route path="notification" element={<NotificationPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="swap" element={<SwapPage />} />
              <Route path="spot_orders" element={<SpotOrdersPage />} />
              <Route path="open_orders" element={<OpenOrdersPage />} />
              <Route path="transaction_history" element={<TransactionHistoryPage />} />
              <Route path="swap_history" element={<SwapHistoryPage />} />
              <Route path="wallet_transfer_History" element={<WalletTransferHistoryPage />} />
              <Route path="earning_plan_history" element={<EarningHistoryPage />} />
              <Route path="bonus_history" element={<BonusHistoryPage />} />
              <Route path="launchpad_transactions" element={<ComingSoonPage />} />
            </Route>

            <Route element={<PublicLayout />}>
              <Route path="asset_managemnet/deposit" element={<DepositPage />} />
              <Route path="asset_managemnet/withdraw" element={<WithdrawPage />} />
              <Route path="security_system" element={<SecurityPage />} />
              <Route path="referal_list" element={<ComingSoonPage />} />
            </Route>

            {/* P2P routes */}
            <Route element={<PublicLayout />}>
              <Route path="p2p-dashboard" element={<ComingSoonPage />} />
              <Route path="p2p-order-details/:adId" element={<ComingSoonPage />} />
              <Route path="p2p-create-post" element={<ComingSoonPage />} />
              <Route path="p2p-my-ads" element={<ComingSoonPage />} />
              <Route path="p2p-orders" element={<ComingSoonPage />} />
              <Route path="p2p-profile" element={<ComingSoonPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route element={<PublicLayout />}>
            <Route path="*" element={<ComingSoonPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}
