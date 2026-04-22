import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../providers/AuthProvider.js'
import { useRemovePasskey } from '../hooks/useRemovePasskey.js'
import { maskEmail } from '../lib/maskEmail.js'
import * as sec from '../lib/security-selectors.js'
import { SecurityCard } from './security/components/SecurityCard.js'
import { SecurityRow } from './security/components/SecurityRow.js'
import { StatusPill } from './security/components/StatusPill.js'
import { GoogleProviderIcon } from './security/components/GoogleProviderIcon.js'
import { RemoveGoogleAuthModal } from './security/components/RemoveGoogleAuthModal.js'
import { Login2StepModal } from './security/components/Login2StepModal.js'
import { WithdrawalSettingsModal } from './security/components/WithdrawalSettingsModal.js'
import './security.css'

const REMOVE_BTN_STYLE: React.CSSProperties = {
  border: '1px solid #ef4444',
  color: '#ef4444',
  background: 'transparent',
}

// The Login 2-Step and Withdrawal Settings rows show a placeholder status
// (email icon + "Off") until backend wiring arrives. Kept in a const so the
// two rows share the same markup without drifting.
const PlaceholderStatus = () => (
  <div className="tf-sec-page__status">
    <div className="email_verify">
      <img src="/images/emailicon2.svg" alt="" />
    </div>
    <div className="tf_checkfill">
      <i className="ri-check-fill"></i>
    </div>
    <span>Off</span>
  </div>
)

export function TwoFactor() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const removePasskey = useRemovePasskey()

  const [isRemoveGaOpen, setIsRemoveGaOpen] = useState(false)
  const [isLogin2StepOpen, setIsLogin2StepOpen] = useState(false)
  const [isWithdrawSettingsOpen, setIsWithdrawSettingsOpen] = useState(false)

  const isPasskeyBound = sec.isPasskeyBound(user)
  const isGaBound = sec.isGaBound(user)
  const isSmsBound = sec.isSmsBound(user)
  const isEmailBound = sec.isEmailBound(user)
  const hasAntiPhishing = sec.hasAntiPhishingCode(user)
  const isFundPasswordSet = sec.isFundPasswordSet(user)

  const maskedEmail = maskEmail(user?.email)
  const go = (path: string) => navigate(path)

  return (
    <div className="dashboard_right">
      <div className="tf-sec-page">
        <div className="tf-sec-page__hero">
          <div className="tf-sec-page__hero-content">
            <h1 className="tf-sec-page__hero-title">Security Settings</h1>
            <p className="tf-sec-page__hero-description">
              Take full control of your account security with advanced verification options like passkeys, email OTP, and mobile
              authentication for a safer experience.
            </p>
          </div>
          <div className="tf-sec-page__hero-media">
            <img src="/images/security/417923014-aaa37ef0-270c-49ed-99d0-02b7e5924263-1.svg" alt="" />
          </div>
        </div>

        <SecurityCard
          title="Two-Factor Authentication (2FA)"
          subtitle="Choose Passkeys, Verification Code, or Trading Password to ensure the safety of your assets"
        >
          <SecurityRow
            icon="/images/security/Container4.svg"
            title="Passkeys"
            badge="Recommended"
            description="Enables secure, passwordless authentication using device-based credentials. Provides faster logins and stronger protection against phishing and unauthorized access."
            meta={<StatusPill enabled={isPasskeyBound} />}
            action={
              isPasskeyBound ? (
                <button
                  type="button"
                  className="tf-sec-page__btn"
                  style={REMOVE_BTN_STYLE}
                  disabled={removePasskey.isPending}
                  onClick={() => removePasskey.mutate()}
                >
                  {removePasskey.isPending ? 'Removing…' : 'Remove'}
                </button>
              ) : (
                <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/passkey')}>
                  Turn on
                </button>
              )
            }
          />

          <SecurityRow
            icon="/images/security/Container8.svg"
            title="Google Authenticator"
            description="Generates time-based one-time codes for secure login verification. Adds an extra layer of protection beyond passwords to prevent unauthorized access."
            meta={<StatusPill enabled={isGaBound} />}
            action={
              isGaBound ? (
                <button
                  type="button"
                  className="tf-sec-page__btn"
                  style={REMOVE_BTN_STYLE}
                  onClick={() => setIsRemoveGaOpen(true)}
                >
                  Remove
                </button>
              ) : (
                <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/google-authenticator')}>
                  Turn on
                </button>
              )
            }
          />

          <SecurityRow
            icon="/images/security/Container6.svg"
            title="Phone Verification"
            description="Securely verifies user identity using SMS-based OTP. Ensures safe logins and protects sensitive actions with an added layer of security."
            meta={<StatusPill enabled={isSmsBound} />}
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/smsVerification')}>
                {isSmsBound ? 'Change' : 'Turn on'}
              </button>
            }
          />

          <SecurityRow
            icon="/images/security/Container9.svg"
            title="Email Verification"
            description="Securely verifies user identity via email confirmation, adding an extra layer of protection."
            meta={
              isEmailBound && maskedEmail ? (
                <span className="tf-sec-page__status-email">{maskedEmail}</span>
              ) : (
                <StatusPill enabled={isEmailBound} />
              )
            }
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/emailVerification')}>
                {isEmailBound ? 'Change' : 'Turn on'}
              </button>
            }
          />
        </SecurityCard>

        <SecurityCard title="Advanced Security">
          <SecurityRow
            icon="/images/security/Container14.svg"
            title="Login 2-Step Verification"
            description="Adds a second verification step for secure login. Protects accounts even if the password is compromised."
            meta={<PlaceholderStatus />}
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => setIsLogin2StepOpen(true)}>
                Turn on
              </button>
            }
          />

          <SecurityRow
            icon="/images/security/Container13.svg"
            title="Anti-Phishing Code"
            description="Adds a personal code to verify authentic messages. Helps users identify and avoid phishing attempts."
            meta={<StatusPill enabled={hasAntiPhishing} />}
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/antiPhishing')}>
                {hasAntiPhishing ? 'Turn off' : 'Turn on'}
              </button>
            }
          />

          <SecurityRow
            icon="/images/security/Container3.svg"
            title="Withdrawal Settings"
            description="Manages withdrawal options and security controls. Ensures safe and authorized fund transfers."
            meta={<PlaceholderStatus />}
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => setIsWithdrawSettingsOpen(true)}>
                Change
              </button>
            }
          />

          <SecurityRow
            icon="/images/security/Container10.svg"
            title="Emergency Contact"
            description="Adds a trusted contact for account recovery. Helps in case of emergencies."
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/emergencyContact')}>
                Turn on
              </button>
            }
          />

          <SecurityRow
            icon="/images/security/Container5.svg"
            title="Account Connections"
            description="Manages linked accounts and services. Helps control access and maintain security."
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/accountConnections')}>
                Turn on
              </button>
            }
          />
        </SecurityCard>

        <SecurityCard title="Password Management">
          <SecurityRow
            icon="/images/security/Container1.svg"
            title="Password"
            description="Protects account access with secure authentication. Helps prevent unauthorized logins."
            meta={<StatusPill enabled />}
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/changeLoginPassword')}>
                Change
              </button>
            }
          />

          <SecurityRow
            icon="/images/security/Container11.svg"
            title="Fund Password"
            description="Adds an extra password layer for transactions and withdrawals. Ensures stronger protection for funds against unauthorized actions."
            meta={<StatusPill enabled={isFundPasswordSet} />}
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/setFundPassword')}>
                {isFundPasswordSet ? 'Change' : 'Setup'}
              </button>
            }
          />
        </SecurityCard>

        <SecurityCard title="Devices & activity">
          <SecurityRow
            icon="/images/security/Container12.svg"
            title="Authorized Devices"
            description="Manages and recognizes trusted devices for secure account access. Helps prevent unauthorized logins by allowing access only from approved devices."
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/authorizedDevices')}>
                Change
              </button>
            }
          />

          <SecurityRow
            icon="/images/security/Container.svg"
            title="Security Logs"
            description="Tracks and records account activity, including logins and security actions. Helps monitor suspicious behavior and maintain account safety."
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/securityLogs')}>
                Setup
              </button>
            }
          />
        </SecurityCard>

        <SecurityCard title="Account Management">
          <SecurityRow
            icon="/images/security/Container15.svg"
            title="Disable Account"
            description="Allows users to temporarily deactivate their account for added security. Prevents access and protects data until the account is re-enabled."
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/disableAccount')}>
                Disable
              </button>
            }
          />

          <SecurityRow
            icon="/images/security/Container.svg"
            title="Close Account"
            description="Permanently deletes the user account and associated data. Ensures complete removal of access and disables all related services."
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/closeAccount')}>
                Close
              </button>
            }
          />
        </SecurityCard>

        <SecurityCard title="Other Settings">
          <SecurityRow
            icon="/images/security/Container2.svg"
            title="Third Party Account Access Management"
            description="Controls and manages access granted to external apps and services. Helps protect account data by allowing users to review and revoke permissions anytime."
            meta={
              <span className="tf-sec-page__google-badge">
                <GoogleProviderIcon />
              </span>
            }
            action={
              <button type="button" className="tf-sec-page__btn" onClick={() => go('/user_profile/security/thirdPartyAccess')}>
                Change
              </button>
            }
          />
        </SecurityCard>

        {isRemoveGaOpen && <RemoveGoogleAuthModal onClose={() => setIsRemoveGaOpen(false)} />}
        {isLogin2StepOpen && <Login2StepModal onClose={() => setIsLogin2StepOpen(false)} />}
        {isWithdrawSettingsOpen && <WithdrawalSettingsModal onClose={() => setIsWithdrawSettingsOpen(false)} />}
      </div>
    </div>
  )
}
