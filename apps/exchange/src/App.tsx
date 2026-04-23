import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster, ToastBar, toast } from 'react-hot-toast'
import { X } from 'lucide-react'
import { useTheme } from './providers/ThemeProvider.js'
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
  KycVerificationNew,
  Notifications,
  ProfileLayout,
  Settings,
  Support,
  Swap,
  SwapHistory,
  TransactionHistory,
  TwoFactor,
  WalletTransferHistory,
} from './features/user-profile/index.js'
import './App.css'
import Trade from './features/Trade/index.js'
import { SocketProvider } from './features/Trade/SocketContext.js'
import Market from './features/Market/index.jsx'
import SmsVerification from './features/user-profile/pages/security/TwofactorPage/smsVerification.js'
import EmailVerification from './features/user-profile/pages/security/TwofactorPage/emailVerification.js'
import AntiPhishing from './features/user-profile/pages/security/TwofactorPage/antiPhishing.js'
import EmergencyContact from './features/user-profile/pages/security/TwofactorPage/emergencyContact.js'
import AccountConnections from './features/user-profile/pages/security/TwofactorPage/accountConnections.js'
import ChangeLoginPassword from './features/user-profile/pages/security/TwofactorPage/changeLoginPassword.js'
import SetFundPassword from './features/user-profile/pages/security/TwofactorPage/setFundPassword.js'
import AuthorizedDevices from './features/user-profile/pages/security/TwofactorPage/authorizedDevices.js'
import SecurityLogs from './features/user-profile/pages/security/TwofactorPage/securityLogs.js'
import DisableAccount from './features/user-profile/pages/security/TwofactorPage/disableAccount.js'
import CloseAccount from './features/user-profile/pages/security/TwofactorPage/closeAccount.js'
import ThirdPartyAccess from './features/user-profile/pages/security/TwofactorPage/thirdPartyAccess.js'
import PasskeyPage from './features/user-profile/pages/security/TwofactorPage/PassKey.js'
import GoogleAuthPage from './features/user-profile/pages/security/TwofactorPage/GoogleAuthPage.js'
import SpotOrders from './features/user-profile/pages/Order/SpotOrders.js'
import SpotPositionHistory from './features/user-profile/pages/Order/SpotPositionHistory.js'
import DepositHistory from './features/user-profile/pages/Order/DepositHistory.js'
import WithdrawHistory from './features/user-profile/pages/Order/WithdrawHistory.js'

const NO_FOOTER_ROUTE_PREFIXES = [
  '/signup',
  '/login',
  '/forgot_password',
  '/account-verification',
  '/account-activate',
  '/user_profile',
  '/asset_management',
  '/trade',
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
          <Route
            path="/market"
            element={<SocketProvider><Market /></SocketProvider>}
          />
          <Route path="/announcement" element={<Announcement />} />
          <Route
            path="/announcement_list/:title/:announce_title_id"
            element={<AnnouncementList />}
          />
          <Route
            path="/trade/:trade"
            element={<SocketProvider><Trade /></SocketProvider>}
          />
          <Route
            path="/announcement_details/:title/:announce_title_id"
            element={<AnnouncementDetails />}
          />
          <Route path="/usd_futures" element={<Navigate to="/usd_futures/BTC_USDT" replace />} />
          <Route path="/usd_futures/:pairs" element={<UsdMFutures />} />
          <Route path="/coin-m-futures" element={<ComingSoonPage title="Coin-M Futures" />} />
          <Route path="/futures-options" element={<ComingSoonPage title="Futures Options" />} />
          <Route element={<RequireGuest />}>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot_password" element={<ForgotPassword />} />
          </Route>
          <Route path="/account-verification/:authenticationToken" element={<RegistrationVerification />} />
          <Route path="/account-activate/:authenticationToken" element={<RegistrationResult />} />
          <Route element={<RequireAuth />}>
            <Route path="/user_profile" element={<ProfileLayout />}>
              <Route index element={<SocketProvider><Dashboard /></SocketProvider>} />
              <Route path="dashboard" element={<SocketProvider><Dashboard /></SocketProvider>} />
              <Route path="asset_overview" element={<AssetOverview />} />
              
              
              <Route path="orders" element={<SpotOrders />} />
              <Route path="orders/spot_orders" element={<SpotOrders />} />
              <Route path="orders/spot_order_history" element={<SpotPositionHistory />} />
              <Route path="orders/deposit_history" element={<DepositHistory />} />
               <Route path="orders/withdraw_history" element={<WithdrawHistory />} />
              <Route path="orders/trade_history" element={<SpotPositionHistory />} />


              <Route path="transaction_history" element={<TransactionHistory />} />
              <Route path="swap_history" element={<SwapHistory />} />
              <Route path="wallet_transfer_history" element={<WalletTransferHistory />} />
              <Route path="earning_plan_history" element={<EarningHistory />} />
              <Route path="profile_setting" element={<Settings />} />
              <Route path="kyc" element={<KycVerificationNew />} />
              <Route path="support" element={<Support />} />
              <Route path="two_factor_authentication" element={<TwoFactor />} />
              <Route path="swap" element={<Swap />} />
              <Route path="notification" element={<Notifications />} />
              <Route path="activity_logs" element={<ActivityLogs />} />

              <Route path="security" element={<TwoFactor />} />
              <Route path="security/smsVerification" element={<SmsVerification />} />
              <Route path="security/emailVerification" element={<EmailVerification />} />
              <Route path="security/antiPhishing" element={<AntiPhishing />} />
              <Route path="security/emergencyContact" element={<EmergencyContact />} />
              <Route path="security/accountConnections" element={<AccountConnections />} />
              <Route path="security/changeLoginPassword" element={<ChangeLoginPassword />} />
              <Route path="security/setFundPassword" element={<SetFundPassword />} />
              <Route path="security/authorizedDevices" element={<AuthorizedDevices />} />
              <Route path="security/securityLogs" element={<SecurityLogs />} />
              <Route path="security/disableAccount" element={<DisableAccount />} />
              <Route path="security/closeAccount" element={<CloseAccount />} />
              <Route path="security/thirdPartyAccess" element={<ThirdPartyAccess />} />
              <Route path="security/passkey" element={<PasskeyPage />} />
              <Route path="security/google-authenticator" element={<GoogleAuthPage />} />
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

function ThemedToaster() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const palette = isDark
    ? {
        background: '#1f2937',
        color: '#f9fafb',
        shadow:
          '0 10px 25px -5px rgba(0, 0, 0, 0.35), 0 8px 10px -6px rgba(0, 0, 0, 0.25)',
        closeBg: 'rgba(255, 255, 255, 0.12)',
        closeBgHover: 'rgba(255, 255, 255, 0.22)',
        closeColor: 'rgba(255, 255, 255, 0.75)',
        closeColorHover: '#ffffff',
      }
    : {
        background: '#ffffff',
        color: '#111827',
        shadow:
          '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
        closeBg: 'rgba(0, 0, 0, 0.06)',
        closeBgHover: 'rgba(0, 0, 0, 0.12)',
        closeColor: 'rgba(0, 0, 0, 0.55)',
        closeColorHover: '#111827',
      }

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      containerStyle={{ zIndex: 2147483647 }}
      toastOptions={{
        duration: 4000,
        style: {
          zIndex: 2147483647,
          background: palette.background,
          color: palette.color,
          padding: '12px 16px',
          borderRadius: '12px',
          boxShadow: palette.shadow,
          fontSize: '14px',
          fontWeight: 500,
          maxWidth: '420px',
          border: isDark ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#ffffff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
              }}
            >
              <span style={{ display: 'flex', flexShrink: 0 }}>{icon}</span>
              <span style={{ flex: 1, lineHeight: 1.4 }}>{message}</span>
              {t.type !== 'loading' && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  aria-label="Close"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    width: '20px',
                    height: '20px',
                    padding: 0,
                    border: 'none',
                    borderRadius: '9999px',
                    background: palette.closeBg,
                    color: palette.closeColor,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = palette.closeBgHover
                    e.currentTarget.style.color = palette.closeColorHover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = palette.closeBg
                    e.currentTarget.style.color = palette.closeColor
                  }}
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}

function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="container py-5 text-center">
      <h1>{title}</h1>
      <p className="mt-4 text-muted">This feature is coming soon.</p>
    </div>
  )
}

export default function App() {
  return (
    <AppProviders>
      <AppInner />
      <ThemedToaster />
    </AppProviders>
  )
}
