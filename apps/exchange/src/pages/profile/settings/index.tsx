import { useState } from 'react'
import { Camera, User, Shield, Eye, EyeOff } from 'lucide-react'

type CurrencyOption = 'USDT' | 'BTC' | 'BNB'

export function SettingsPage() {
  const [name, setName] = useState('John Doe')
  const [email] = useState('john.doe@example.com')
  const [currency, setCurrency] = useState<CurrencyOption>('USDT')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [antiPhishingCode, setAntiPhishingCode] = useState('')

  const currencies: CurrencyOption[] = ['USDT', 'BTC', 'BNB']

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Account Settings</h1>

      {/* Profile Section */}
      <section
        className="rounded-xl p-6 border border-[var(--color-border)]"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <h2 className="text-lg font-medium text-[var(--color-text)] mb-5 flex items-center gap-2">
          <User size={18} className="text-[var(--color-primary)]" />
          Profile Information
        </h2>

        <div className="flex items-start gap-6 flex-wrap">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center border-2 border-[var(--color-primary)]"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
            >
              <User size={40} className="text-[var(--color-text-muted)]" />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border border-[var(--color-border)]"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Camera size={14} className="text-white" />
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">Upload Photo</span>
          </div>

          {/* Name & Email */}
          <div className="flex-1 min-w-[260px] space-y-4">
            <div>
              <label className="block text-sm text-[var(--color-text-muted)] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 text-sm text-[var(--color-text)] border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-muted)] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-lg px-4 py-2.5 text-sm border border-[var(--color-border)] outline-none cursor-not-allowed"
                style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
              />
            </div>
            <button
              className="rounded-lg px-6 py-2.5 text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </section>

      {/* Currency Preference */}
      <section
        className="rounded-xl p-6 border border-[var(--color-border)]"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <h2 className="text-lg font-medium text-[var(--color-text)] mb-5">Currency Preference</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Select the currency used to display your balance estimates.
        </p>
        <div className="flex gap-6 flex-wrap">
          {currencies.map((c) => (
            <label key={c} className="flex items-center gap-3 cursor-pointer">
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: currency === c ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              >
                {currency === c && (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                )}
              </div>
              <input
                type="radio"
                name="currency"
                value={c}
                checked={currency === c}
                onChange={() => setCurrency(c)}
                className="hidden"
              />
              <span className="text-sm text-[var(--color-text)]">{c}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Security Settings */}
      <section
        className="rounded-xl p-6 border border-[var(--color-border)]"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <h2 className="text-lg font-medium text-[var(--color-text)] mb-5 flex items-center gap-2">
          <Shield size={18} className="text-[var(--color-primary)]" />
          Security Settings
        </h2>

        {/* Login Password */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-[var(--color-text)] mb-4">Change Login Password</h3>
          <div className="space-y-3 max-w-md">
            <div className="relative">
              <label className="block text-sm text-[var(--color-text-muted)] mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-lg px-4 py-2.5 pr-10 text-sm text-[var(--color-text)] border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-muted)] mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-lg px-4 py-2.5 pr-10 text-sm text-[var(--color-text)] border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-muted)] mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-lg px-4 py-2.5 text-sm text-[var(--color-text)] border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <button
              className="rounded-lg px-6 py-2.5 text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Anti-Phishing Code */}
        <div
          className="rounded-lg p-4 border border-[var(--color-border)]"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        >
          <h3 className="text-base font-medium text-[var(--color-text)] mb-1">Anti-Phishing Code</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            Set a code that will appear in all official AGCE emails to help you identify authentic messages.
          </p>
          <div className="flex gap-3 max-w-md">
            <input
              type="text"
              value={antiPhishingCode}
              onChange={(e) => setAntiPhishingCode(e.target.value)}
              placeholder="Enter anti-phishing code"
              maxLength={20}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm text-[var(--color-text)] border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
            />
            <button
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-white whitespace-nowrap"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Save Code
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
