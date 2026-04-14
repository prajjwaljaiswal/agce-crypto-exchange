interface ProfileSectionProps {
  onEditProfile: () => void
}

export function ProfileSection({ onEditProfile }: ProfileSectionProps) {
  return (
    <div className="twofactor_outer_s">
      <h5>Profile</h5>
      <p>
        To protect your account, we recommend that you enable at least one 2FA
      </p>
      <div className="two_factor_list">
        <div className="factor_bl active">
          <div className="lftcnt">
            <h6>
              <img src="/images/lock_icon.svg" alt="Authenticator App" /> Name &
              Avatar
            </h6>
            <p>
              Update your name and avatar to personalize your profile. Save
              changes to keep your account up to date.
            </p>
            <input
              type="file"
              id="avatarFileInput"
              accept="image/png,image/jpeg,image/jpg"
              style={{ display: 'none' }}
            />
          </div>

          <div className="enable">
            <img src="/images/user.png" alt="user" />
            Demo User
          </div>
          <button type="button" className="btn" onClick={onEditProfile}>
            Change
          </button>
        </div>
      </div>
    </div>
  )
}
