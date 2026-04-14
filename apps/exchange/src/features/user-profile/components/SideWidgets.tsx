import { Link } from 'react-router-dom'
import type { AnnouncementItem } from '../types.js'

export function VipServicesCard() {
  return (
    <div className="vip_servies">
      <h6>
        <img src="/images/vip_vector.svg" alt="VIP Services" /> VIP Services
      </h6>

      <ul className="vip_services_list">
        <li>Lower trading fees & priority support</li>
        <li>Higher withdrawal limits & faster withdrawals</li>
        <li>Personal account manager</li>
      </ul>

      <button type="button" className="vip_btn">
        Upgrade to VIP
      </button>
    </div>
  )
}

interface AnnouncementsProps {
  items: AnnouncementItem[]
}

export function AnnouncementsCard({ items }: AnnouncementsProps) {
  return (
    <div className="announcements_right">
      <div className="announcements_card">
        <div className="announcements_top">
          <div className="announcements_title">
            <i className="ri-notification-3-line" aria-hidden />
            <h4>Announcements</h4>
          </div>
          <Link className="announcements_viewall" to="/announcement">
            View All
          </Link>
        </div>

        <div className="announcement_block">
          {items.map((item, index) => (
            <div key={item.id}>
              {index > 0 ? (
                <div className="announcement_divider" role="separator" />
              ) : null}
              <Link className="announcement_item" to="/announcement">
                <div className="announcement_item_left">
                  <p className="announcement_item_title">{item.title}</p>
                  <span className="announcement_item_time">{item.time}</span>
                </div>
                <i className="ri-arrow-right-s-line" aria-hidden />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DownloadAppCard() {
  return (
    <div className="new_features_s">
      <div className="features_block">
        <Link className="block_features" to="#">
          <div className="features_cnt">
            <h5>
              Download AGCE App{' '}
              <span>
                <i className="ri-arrow-right-s-line" />
              </span>
            </h5>

            <div className="d-flex justify-content-between agcf_block_midle">
              <div className="agcf">
                <h6>AGCE</h6>
                <span>Scan to download</span>
              </div>

              <div className="agcf_img">
                <img src="/images/agcf_vector.svg" alt="AGCE App" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

interface ReferralProps {
  code: string
}

export function ReferralProgramCard({ code }: ReferralProps) {
  return (
    <div className="dashboard_simple_card referral_program_card">
      <div className="dash_card_header">
        <div className="dash_card_icon dash_card_icon--muted">
          <i className="ri-gift-line" aria-hidden />
        </div>
        <h4>Referral Program</h4>
      </div>

      <p className="dash_card_desc">
        Invite friends and earn up to 40% commission
      </p>

      <div className="dash_code_pill">
        <span className="dash_code_text">{code}</span>
        <button
          type="button"
          className="dash_code_copy"
          aria-label="Copy referral code"
        >
          <i className="ri-file-copy-line" aria-hidden />
        </button>
      </div>

      <Link className="dash_outline_btn" to="/refer_earn">
        Share Link
      </Link>
    </div>
  )
}

export function SecurityCenterCard() {
  return (
    <div className="dashboard_simple_card security_center_card">
      <div className="dash_card_header">
        <div className="dash_card_icon dash_card_icon--green">
          <i className="ri-shield-check-line" aria-hidden />
        </div>
        <h4>Security Center</h4>
      </div>

      <p className="dash_card_desc">Enable 2FA for enhanced security</p>

      <Link
        className="dash_primary_btn dash_primary_btn--green"
        to="/user_profile/two_factor_authentication"
      >
        Enable 2FA
      </Link>
    </div>
  )
}
