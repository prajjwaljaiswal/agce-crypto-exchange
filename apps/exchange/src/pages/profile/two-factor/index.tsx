import { useState } from 'react'
import { QrCode, Copy, Check, Shield, AlertCircle } from 'lucide-react'

const SECRET_KEY = 'JBSWY3DPEHPK3PXP'

function SecretKeyDisplay({ secretKey }: { secretKey: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(secretKey).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatted = secretKey.match(/.{1,4}/g)?.join(' ') ?? secretKey

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] px-4 py-3"
      style={{ backgroundColor: 'var(--color-surface-2)' }}
    >
      <span className="font-mono text-sm tracking-widest text-[var(--color-text)]">{formatted}</span>
      <button
        onClick={handleCopy}
        className="shrink-0 rounded p-1 hover:bg-[var(--color-border)] transition-colors"
        title="Copy secret key"
      >
        {copied ? (
          <Check size={15} style={{ color: 'var(--color-green)' }} />
        ) : (
          <Copy size={15} className="text-[var(--color-text-muted)]" />
        )}
      </button>
    </div>
  )
}

const STEPS = [
  {
    number: 1,
    title: 'Download Authenticator App',
    body: 'Install Google Authenticator, Authy, or any TOTP-compatible authenticator app on your mobile device.',
  },
  {
    number: 2,
    title: 'Scan QR Code',
    body: 'Open the app, tap "+" or "Add account", then scan the QR code below. Alternatively, enter the secret key manually.',
  },
  {
    number: 3,
    title: 'Verify Setup',
    body: 'Enter the 6-digit code shown in your authenticator app to confirm the setup is working correctly.',
  },
]

export function TwoFactorPage() {
  const [code, setCode] = useState('')

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Set Up Google Authenticator</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Two-factor authentication adds an extra layer of security to your account.
        </p>
      </div>

      {/* Instructions */}
      <div
        className="rounded-xl p-6 border border-[var(--color-border)] space-y-5"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {STEPS.map((step) => (
          <div key={step.number} className="flex gap-4">
            <div
              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-semibold"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            >
              {step.number}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">{step.title}</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-0.5 leading-relaxed">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* QR + Secret */}
      <div
        className="rounded-xl p-6 border border-[var(--color-border)]"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <h2 className="text-base font-medium text-[var(--color-text)] mb-5">Scan or Enter Key</h2>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* QR Code Placeholder */}
          <div
            className="w-40 h-40 rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center gap-2 shrink-0"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            <QrCode size={60} className="text-[var(--color-text-muted)]" />
            <span className="text-xs text-[var(--color-text-muted)]">QR Code</span>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">
                Manual Entry Key (Base32)
              </label>
              <SecretKeyDisplay secretKey={SECRET_KEY} />
            </div>

            <div
              className="flex items-start gap-2.5 rounded-lg p-3 border border-yellow-600/30"
              style={{ backgroundColor: '#d1aa6711' }}
            >
              <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
              <p className="text-xs text-[var(--color-text-muted)]">
                Store this key in a safe place. If you lose access to your authenticator app, you will need this key
                to recover 2FA access.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verify Code */}
      <div
        className="rounded-xl p-6 border border-[var(--color-border)] space-y-4"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <h2 className="text-base font-medium text-[var(--color-text)] flex items-center gap-2">
          <Shield size={16} style={{ color: 'var(--color-primary)' }} />
          Verify Setup
        </h2>

        <div>
          <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">
            Enter 6-Digit Code from Authenticator App
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6)
              setCode(val)
            }}
            placeholder="000000"
            maxLength={6}
            className="w-full max-w-xs rounded-lg px-4 py-3 text-center text-xl font-mono tracking-widest text-[var(--color-text)] border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <button
          disabled={code.length !== 6}
          className="rounded-lg px-8 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Enable 2FA
        </button>
      </div>
    </div>
  )
}
