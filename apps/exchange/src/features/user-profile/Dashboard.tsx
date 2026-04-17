import { useEffect, useMemo } from 'react'
import { useAuth } from '../../providers/index.js'
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
import type { ProfileSnapshot } from './types.js'

function mapKycStatus(raw?: string): ProfileSnapshot['kycStatus'] {
  const s = (raw ?? '').toUpperCase()
  if (s === 'APPROVED' || s === 'VERIFIED') return 'approved'
  if (s === 'DECLINED' || s === 'REJECTED' || s === 'EXPIRED') return 'rejected'
  return 'pending'
}

function formatTimestamp(iso?: string): string | undefined {
  if (!iso) return undefined
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return undefined
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  let hh = d.getHours()
  const mi = String(d.getMinutes()).padStart(2, '0')
  const ampm = hh >= 12 ? 'PM' : 'AM'
  hh = hh % 12 || 12
  return `${dd}/${mm}/${yyyy} ${String(hh).padStart(2, '0')}:${mi} ${ampm}`
}

export function Dashboard() {
  const { user } = useAuth()

  useEffect(() => {
    document.title = 'AGCE — Dashboard'
  }, [])

  const profile = useMemo<ProfileSnapshot>(() => {
    if (!user) return PROFILE_SNAPSHOT
    const signupAt = formatTimestamp(user.createdAt) ?? PROFILE_SNAPSHOT.signupAt
    return {
      ...PROFILE_SNAPSHOT,
      email: user.email ?? user.identifier ?? PROFILE_SNAPSHOT.email,
      uid: user.userId ?? user.id ?? PROFILE_SNAPSHOT.uid,
      kycStatus: mapKycStatus(user.kycStatus),
      verified: Boolean(user.isEmailVerified && user.isPhoneVerified),
      signupAt,
      lastLoginAt: formatTimestamp(user.lastLoginAt) ?? PROFILE_SNAPSHOT.lastLoginAt,
      lastLoginIp: user.lastLoginIp ?? PROFILE_SNAPSHOT.lastLoginIp,
    }
  }, [user])

  return (
    <div className="dashboard_right">
      <div className="dashboard_listing_section">
        <div className="dashboard_left_side">
          <div className="top_header_dash">
            <ProfileHeaderCard profile={profile} />
            <WalletSnapshot profile={profile} />
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
            <ReferralProgramCard code={profile.referralCode} />
            <SecurityCenterCard />
          </div>
        </div>
      </div>
    </div>
  )
}
