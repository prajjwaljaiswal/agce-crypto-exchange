import { Route } from 'react-router-dom'
import { PublicLayout, ProfileLayout } from '../layouts/index.js'
import { ProtectedRoute } from '../features/auth/guards.js'
import { ROUTES } from '../constants/routes.js'

import { DashboardPage } from '../features/profile/dashboard/index.js'
import { SettingsPage } from '../features/profile/settings/index.js'
import { SecurityPage } from '../features/profile/security/index.js'
import { KycPage } from '../features/profile/kyc/index.js'
import { WalletPage } from '../features/profile/wallet/index.js'
import { AssetOverviewPage } from '../features/profile/asset-overview/index.js'
import { DepositPage } from '../features/profile/deposit/index.js'
import { WithdrawPage } from '../features/profile/withdraw/index.js'
import { SpotOrdersPage } from '../features/profile/orders/spot/index.js'
import { OpenOrdersPage } from '../features/profile/orders/open/index.js'
import { TransactionHistoryPage } from '../features/profile/orders/transactions/index.js'
import { SwapHistoryPage } from '../features/profile/orders/swap-history/index.js'
import { WalletTransferHistoryPage } from '../features/profile/orders/wallet-transfer/index.js'
import { EarningHistoryPage } from '../features/profile/orders/earning-history/index.js'
import { BonusHistoryPage } from '../features/profile/orders/bonus-history/index.js'
import { NotificationPage } from '../features/profile/notifications/index.js'
import { ActivityLogPage } from '../features/profile/activity-log/index.js'
import { SupportPage } from '../features/profile/support/index.js'
import { TwoFactorPage } from '../features/profile/two-factor/index.js'
import { SwapPage } from '../features/swap/index.js'
import { ComingSoonPage } from '../features/coming-soon/index.js'

const stripLeadingSlash = (p: string) => p.replace(/^\//, '')

// Paths nested under /user_profile — strip the prefix so they render inside ProfileLayout
const underProfile = (fullPath: string) => fullPath.replace(/^\/user_profile\//, '')

export function profileRoutes() {
  return (
    <Route element={<ProtectedRoute />}>
      {/* Sidebar layout — everything under /user_profile */}
      <Route path={stripLeadingSlash(ROUTES.PROFILE.ROOT)} element={<ProfileLayout />}>
        <Route path={underProfile(ROUTES.PROFILE.DASHBOARD)} element={<DashboardPage />} />
        <Route path={underProfile(ROUTES.PROFILE.ASSET_OVERVIEW)} element={<AssetOverviewPage />} />
        <Route path={underProfile(ROUTES.PROFILE.WALLET)} element={<WalletPage />} />
        <Route path={underProfile(ROUTES.PROFILE.SETTINGS)} element={<SettingsPage />} />
        <Route path={underProfile(ROUTES.PROFILE.KYC)} element={<KycPage />} />
        <Route path={underProfile(ROUTES.PROFILE.TWO_FACTOR)} element={<TwoFactorPage />} />
        <Route path={underProfile(ROUTES.PROFILE.ACTIVITY_LOGS)} element={<ActivityLogPage />} />
        <Route path={underProfile(ROUTES.PROFILE.NOTIFICATION)} element={<NotificationPage />} />
        <Route path={underProfile(ROUTES.PROFILE.SUPPORT)} element={<SupportPage />} />
        <Route path={underProfile(ROUTES.PROFILE.SWAP)} element={<SwapPage />} />
        <Route path={underProfile(ROUTES.PROFILE.SPOT_ORDERS)} element={<SpotOrdersPage />} />
        <Route path={underProfile(ROUTES.PROFILE.OPEN_ORDERS)} element={<OpenOrdersPage />} />
        <Route path={underProfile(ROUTES.PROFILE.TRANSACTION_HISTORY)} element={<TransactionHistoryPage />} />
        <Route path={underProfile(ROUTES.PROFILE.SWAP_HISTORY)} element={<SwapHistoryPage />} />
        <Route path={underProfile(ROUTES.PROFILE.WALLET_TRANSFER_HISTORY)} element={<WalletTransferHistoryPage />} />
        <Route path={underProfile(ROUTES.PROFILE.EARNING_HISTORY)} element={<EarningHistoryPage />} />
        <Route path={underProfile(ROUTES.PROFILE.BONUS_HISTORY)} element={<BonusHistoryPage />} />
        <Route path={underProfile(ROUTES.PROFILE.LAUNCHPAD_TRANSACTIONS)} element={<ComingSoonPage />} />
      </Route>

      {/* Other protected pages using PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path={stripLeadingSlash(ROUTES.ASSET.DEPOSIT)} element={<DepositPage />} />
        <Route path={stripLeadingSlash(ROUTES.ASSET.WITHDRAW)} element={<WithdrawPage />} />
        <Route path={stripLeadingSlash(ROUTES.SECURITY_SYSTEM)} element={<SecurityPage />} />
        <Route path={stripLeadingSlash(ROUTES.REFERRAL_LIST)} element={<ComingSoonPage />} />

        {/* P2P */}
        <Route path={stripLeadingSlash(ROUTES.P2P.DASHBOARD)} element={<ComingSoonPage />} />
        <Route path={stripLeadingSlash(ROUTES.P2P.ORDER_DETAILS)} element={<ComingSoonPage />} />
        <Route path={stripLeadingSlash(ROUTES.P2P.CREATE_POST)} element={<ComingSoonPage />} />
        <Route path={stripLeadingSlash(ROUTES.P2P.MY_ADS)} element={<ComingSoonPage />} />
        <Route path={stripLeadingSlash(ROUTES.P2P.ORDERS)} element={<ComingSoonPage />} />
        <Route path={stripLeadingSlash(ROUTES.P2P.PROFILE)} element={<ComingSoonPage />} />
      </Route>
    </Route>
  )
}
