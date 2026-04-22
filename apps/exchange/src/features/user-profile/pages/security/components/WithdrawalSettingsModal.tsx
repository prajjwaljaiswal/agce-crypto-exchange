import { useState } from 'react'

interface WithdrawalSettingsModalProps {
  onClose: () => void
}

interface ToggleOption {
  id: keyof WithdrawSettings
  icon: string
  label: string
}

interface WithdrawSettings {
  smsVerification: boolean
  fundPassword: boolean
  emailVerification: boolean
  trustedAddresses: boolean
}

type WithdrawAddressMode = 'addressBook' | 'verificationFree'

const TOGGLES: ToggleOption[] = [
  { id: 'smsVerification', icon: '/images/security/setting_icon.svg', label: 'SMS verification' },
  { id: 'fundPassword', icon: '/images/security/setting_icon2.svg', label: 'Fund Password' },
  { id: 'emailVerification', icon: '/images/security/setting_icon3.svg', label: 'Email verification' },
  { id: 'trustedAddresses', icon: '/images/security/setting_icon4.svg', label: 'Withdraw Only to Trusted Addresses' },
]

// Local-only UI state today; backend wiring happens in a later phase.
export function WithdrawalSettingsModal({ onClose }: WithdrawalSettingsModalProps) {
  const [settings, setSettings] = useState<WithdrawSettings>({
    smsVerification: false,
    fundPassword: false,
    emailVerification: false,
    trustedAddresses: false,
  })
  const [addressMode, setAddressMode] = useState<WithdrawAddressMode>('addressBook')

  const toggle = (id: keyof WithdrawSettings) =>
    setSettings((s) => ({ ...s, [id]: !s[id] }))

  return (
    <div className="tf-sec-page__wds-overlay" role="presentation">
      <div className="tf-sec-page__wds-modal" role="dialog" aria-modal="true" aria-labelledby="tf-wds-title">
        <button type="button" className="tf-sec-page__wds-close" aria-label="Close" onClick={onClose}>
          ×
        </button>

        <h2 id="tf-wds-title" className="tf-sec-page__wds-title">
          Withdrawal Settings
        </h2>
        <p className="tf-sec-page__wds-subtitle">Manage security verification for asset withdrawals.</p>

        <div className="tf-sec-page__wds-list" role="list">
          {TOGGLES.map((opt) => (
            <div key={opt.id} className="tf-sec-page__wds-item" role="listitem">
              <div className="tf-sec-page__wds-left">
                <span className="tf-sec-page__wds-icon" aria-hidden="true">
                  <img src={opt.icon} alt="" />
                </span>
                <span className="tf-sec-page__wds-text">{opt.label}</span>
              </div>
              <button
                type="button"
                className={`tf-sec-page__wds-switch ${settings[opt.id] ? 'is-on' : ''}`}
                role="switch"
                aria-checked={settings[opt.id]}
                onClick={() => toggle(opt.id)}
              >
                <span className="tf-sec-page__wds-knob" aria-hidden="true" />
              </button>
            </div>
          ))}

          <button type="button" className="tf-sec-page__wds-item tf-sec-page__wds-item--link">
            <div className="tf-sec-page__wds-left">
              <span className="tf-sec-page__wds-icon" aria-hidden="true">
                <img src="/images/security/Icon.svg" alt="" />
              </span>
              <span className="tf-sec-page__wds-text">API Withdrawal Settings</span>
            </div>
            <span className="tf-sec-page__wds-right">
              <span className="tf-sec-page__wds-muted">More options</span>
              <span className="tf-sec-page__wds-chev" aria-hidden="true">
                ›
              </span>
            </span>
          </button>
        </div>

        <div className="tf-sec-page__wds-radioGroup" role="radiogroup" aria-label="Withdrawal address options">
          <button
            type="button"
            className={`tf-sec-page__wds-radioRow ${addressMode === 'addressBook' ? 'is-selected' : ''}`}
            onClick={() => setAddressMode('addressBook')}
          >
            <span className="tf-sec-page__wds-radio" aria-hidden="true" />
            <span className="tf-sec-page__wds-radioText">To Address Book Addresses Only</span>
          </button>
          <button
            type="button"
            className={`tf-sec-page__wds-radioRow ${addressMode === 'verificationFree' ? 'is-selected' : ''}`}
            onClick={() => setAddressMode('verificationFree')}
          >
            <span className="tf-sec-page__wds-radio" aria-hidden="true" />
            <span className="tf-sec-page__wds-radioText">Verification-free addresses only</span>
          </button>
        </div>
      </div>
    </div>
  )
}
