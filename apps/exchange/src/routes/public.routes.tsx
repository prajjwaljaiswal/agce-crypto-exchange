import { Route } from 'react-router-dom'
import { PublicLayout } from '../layouts/index.js'
import { ROUTES } from '../constants/routes.js'

import { LandingPage } from '../features/landing-page/index.js'
import { MarketPage } from '../features/market/index.js'
import { EarningPage } from '../features/earning/index.js'
import { FeesPage } from '../features/fees/index.js'
import { ContactPage } from '../features/contact/index.js'
import { FAQPage } from '../features/faq/index.js'
import { BlogListPage } from '../features/blog/list/index.js'
import { BlogDetailsPage } from '../features/blog/details/index.js'
import { AboutPage } from '../features/about/index.js'
import { ReferralPage } from '../features/referral/index.js'
import { LaunchpadPage } from '../features/launchpad/index.js'
import { AnnouncementPage } from '../features/announcements/index.js'
import { NotificationPage } from '../features/profile/notifications/index.js'
import { ComingSoonPage } from '../features/coming-soon/index.js'
import { SpotTradePage } from '../features/trade/spot/index.js'

import { TermsOfUsePage } from '../features/legal/terms-of-use/index.js'
import { PrivacyPolicyPage } from '../features/legal/privacy-policy/index.js'
import { AmlPolicyPage } from '../features/legal/aml-policy/index.js'
import { RiskDisclosurePage } from '../features/legal/risk-disclosure/index.js'
import { GeneralDisclaimerPage } from '../features/legal/general-disclaimer/index.js'
import { ComplaintsPage } from '../features/legal/complaints/index.js'

const stripLeadingSlash = (p: string) => p.replace(/^\//, '')

export function publicRoutes() {
  return (
    <>
      {/* Landing — public in all environments, with footer */}
      <Route element={<PublicLayout showFooter />}>
        <Route index element={<LandingPage />} />
      </Route>

      {/* Public — navbar only */}
      <Route element={<PublicLayout />}>
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.MARKET)} element={<MarketPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.EARNING)} element={<EarningPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.FEES)} element={<FeesPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.CONTACT)} element={<ContactPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.FAQ)} element={<FAQPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.BLOG_LIST)} element={<BlogListPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.BLOG_DETAILS)} element={<BlogDetailsPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.ABOUT)} element={<AboutPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.REFERRAL)} element={<ReferralPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.LAUNCHPAD)} element={<LaunchpadPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.ANNOUNCEMENT)} element={<AnnouncementPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.NOTIFICATION)} element={<NotificationPage />} />

        {/* Trade */}
        <Route path={stripLeadingSlash(ROUTES.TRADE.SPOT)} element={<SpotTradePage />} />
        <Route path={stripLeadingSlash(ROUTES.TRADE.USD_FUTURES)} element={<ComingSoonPage />} />
        <Route path={stripLeadingSlash(ROUTES.TRADE.MEME)} element={<ComingSoonPage />} />
        <Route path={stripLeadingSlash(ROUTES.TRADE.COIN_LIST)} element={<ComingSoonPage />} />
        <Route path={stripLeadingSlash(ROUTES.TRADE.TOKEN)} element={<ComingSoonPage />} />
        <Route path={stripLeadingSlash(ROUTES.TRADE.SECURITY_SYSTEM)} element={<ComingSoonPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.COMING_SOON)} element={<ComingSoonPage />} />

        {/* Announcement sub-routes */}
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.ANNOUNCEMENT_LIST)} element={<AnnouncementPage />} />
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.ANNOUNCEMENT_DETAILS)} element={<AnnouncementPage />} />

        {/* Launchpad sub-routes */}
        <Route path={stripLeadingSlash(ROUTES.PUBLIC.LAUNCHPAD_DETAILS)} element={<ComingSoonPage />} />

        {/* Legal */}
        <Route path={stripLeadingSlash(ROUTES.LEGAL.TERMS)} element={<TermsOfUsePage />} />
        <Route path={stripLeadingSlash(ROUTES.LEGAL.PRIVACY)} element={<PrivacyPolicyPage />} />
        <Route path={stripLeadingSlash(ROUTES.LEGAL.AML)} element={<AmlPolicyPage />} />
        <Route path={stripLeadingSlash(ROUTES.LEGAL.RISK)} element={<RiskDisclosurePage />} />
        <Route path={stripLeadingSlash(ROUTES.LEGAL.DISCLAIMER)} element={<GeneralDisclaimerPage />} />
        <Route path={stripLeadingSlash(ROUTES.LEGAL.COMPLAINTS)} element={<ComplaintsPage />} />
      </Route>
    </>
  )
}
