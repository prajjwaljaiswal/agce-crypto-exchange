import type { ProfileSnapshot } from '../types.js'

interface Props {
  profile: ProfileSnapshot
}

export function ProfileHeaderCard({ profile }: Props) {
  return (
    <div className="d-flex user_header_cnt_top justify-content-between align-items-center">
      <div className="user_profile">
        <div className="user_left_img">
          <div className="user_img">
            <img src="/images/user.png" alt="User profile" />
          </div>
          <div className="user_edit">
            <button type="button" aria-label="Edit profile">
              <i className="ri-pencil-line" />
            </button>
          </div>
        </div>

        <div className="user_profile_cnt">
          <h3>{profile.email}</h3>
          <div className="d-flex gap-2 align-items-center sublevels">
            <span className="vip_level">
              <i className="ri-star-fill" /> {profile.vipLevel}
            </span>
            <span className="subdel">
              {profile.verified ? 'Verified' : 'Unverified'}
            </span>
            <span className="low_level">
              <i className="ri-circle-fill" />
              {profile.riskLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="profile_id_s">
        <div className="profile_id">
          <span>UID :</span>
          {profile.uid}
          <img
            src="/images/uid_icon.svg"
            className="m-1"
            alt="Copy UID"
            style={{ cursor: 'pointer' }}
          />
        </div>
        {/* <div className="profile_id">
          <span>Referral Code :</span>
          {profile.referralCode}
          <img
            src="/images/uid_icon.svg"
            className="m-1"
            alt="Copy referral code"
            style={{ cursor: 'pointer' }}
          />
        </div> */}
        {/* <div className="profile_id kycstatus">
          <span>KYC Status</span>
          <Link className="text" to="/user_profile/kyc">
            <img src="/images/check_icon.svg" alt="Verify KYC" />
            KYC {profile.kycStatus === 'approved' ? 'Verified' : 'Pending'}
          </Link>
        </div> */}
        {/* <div className="profile_id">
          <span>Sign-up Time</span>
          <span className="textprofile">{profile.signupAt}</span>
        </div> */}
        <div className="profile_id">
          <span>Last Login Time</span>
          <span className="textprofile">{profile.lastLoginAt}</span>
        </div>
        <div className="profile_id">
          <span>Last Login IP</span>
          <span className="textprofile">{profile.lastLoginIp}</span>
        </div>
      </div>
    </div>
  )
}
