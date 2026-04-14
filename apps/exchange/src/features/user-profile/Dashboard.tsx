import { useEffect } from 'react'
import { ProfileHeaderCard } from './components/ProfileHeaderCard.js'
import { WalletSnapshot } from './components/WalletSnapshot.js'
import { NewcomerPerks } from './components/NewcomerPerks.js'
import { SpotMarketsCard } from './components/SpotMarketsCard.js'
import {
  AnnouncementsCard,
  DownloadAppCard,
  ReferralProgramCard,
  SecurityCenterCard,
  VipServicesCard,
} from './components/SideWidgets.js'
import {
  ANNOUNCEMENTS,
  NEWCOMER_PERKS,
  PROFILE_SNAPSHOT,
  TRENDING_MARKETS,
} from './data.js'

export function Dashboard() {
  useEffect(() => {
    document.title = 'AGCE — Dashboard'
  }, [])

  return (
    <div className="dashboard_right">
      <div className="dashboard_listing_section">
        <div className="dashboard_left_side">
          <div className="top_header_dash">
            <ProfileHeaderCard profile={PROFILE_SNAPSHOT} />
            <WalletSnapshot profile={PROFILE_SNAPSHOT} />
          </div>

          <NewcomerPerks steps={NEWCOMER_PERKS} />

          <div className="listing_left_outer">
            <SpotMarketsCard coins={TRENDING_MARKETS} />
          </div>
        </div>

        <div className="dashboard_right_side">
          <VipServicesCard />
          <AnnouncementsCard items={ANNOUNCEMENTS} />
          <DownloadAppCard />
          <div className="dashboard_right_cards">
            <ReferralProgramCard code={PROFILE_SNAPSHOT.referralCode} />
            <SecurityCenterCard />
          </div>
        </div>
      </div>
    </div>
  )
}
