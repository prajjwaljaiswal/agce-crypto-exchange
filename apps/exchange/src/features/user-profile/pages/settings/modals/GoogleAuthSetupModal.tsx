import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '@agce/ui'
import type { GoogleAuthSetupResponse } from '@agce/types'
import { useSetupGoogleAuth } from '../../../hooks/useSetupGoogleAuth.js'

interface GoogleAuthSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onEnabled?: () => void
}

export function GoogleAuthSetupModal({
  isOpen,
  onClose,
  onEnabled,
}: GoogleAuthSetupModalProps) {
  const setupMutation = useSetupGoogleAuth()
  const [data, setData] = useState<GoogleAuthSetupResponse | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setData(null)
      setCopied(false)
      return
    }
    setupMutation.mutate(undefined, {
      onSuccess: (res) => setData(res),
    })
    // We intentionally fire once per open; setupMutation identity is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleCopySecret = async () => {
    if (!data?.secret) return
    try {
      await navigator.clipboard.writeText(data.secret)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Could not copy secret.')
    }
  }

  const handleDone = () => {
    toast.success('Google Authenticator enabled.')
    onEnabled?.()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      showHeader={false}
      contentClassName="anti-phishing-modal"
    >
      <div
        style={{
          position: 'relative',
          padding: '26px 26px 22px',
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-primary, #D1AA67) 24%, transparent) 0%, color-mix(in srgb, var(--color-primary, #D1AA67) 6%, transparent) 100%)',
          borderBottom:
            '1px solid color-mix(in srgb, var(--color-primary, #D1AA67) 28%, transparent)',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          aria-hidden
          style={{
            flex: '0 0 auto',
            width: 52,
            height: 52,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--color-primary, #D1AA67) 55%, transparent), color-mix(in srgb, var(--color-primary, #D1AA67) 15%, transparent))',
            border:
              '1px solid color-mix(in srgb, var(--color-primary, #D1AA67) 45%, transparent)',
          }}
        >
          <i
            className="ri-shield-keyhole-line"
            style={{
              fontSize: 26,
              color: 'var(--color-primary, #D1AA67)',
              lineHeight: 1,
            }}
          />
        </div>

        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <h5
            className="anti-phishing-header-title"
            style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: 0.2 }}
          >
            Google Authenticator
          </h5>
          <p
            className="anti-phishing-header-subtitle"
            style={{ margin: '4px 0 0', fontSize: 12.5 }}
          >
            Scan the QR code with your authenticator app.
          </p>
        </div>

        <button
          type="button"
          aria-label="Close"
          className="anti-phishing-header-close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 30,
            height: 30,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            cursor: 'pointer',
          }}
        >
          <i className="ri-close-line" style={{ fontSize: 16 }} />
        </button>
      </div>

      <div
        style={{
          padding: '20px 24px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {setupMutation.isPending && !data && (
          <p style={{ fontSize: 13, opacity: 0.8, margin: 0 }}>
            Generating secret…
          </p>
        )}

        {data && (
          <>
            <section
              style={{
                padding: '14px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <img
                src={data.qrCode}
                alt="Authenticator QR code"
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 8,
                  background: '#fff',
                  padding: 6,
                  flex: '0 0 auto',
                }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <h6
                  className="anti-phishing-heading"
                  style={{ margin: 0, fontSize: 14, fontWeight: 600 }}
                >
                  Scan with your app
                </h6>
                <p
                  className="anti-phishing-paragraph"
                  style={{ margin: '6px 0 0', fontSize: 12.5, lineHeight: 1.55 }}
                >
                  Open Google Authenticator, Authy, or a compatible app and
                  scan this code. Then use the 6-digit code when logging in.
                </p>
              </div>
            </section>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Can&apos;t scan? Enter this secret manually:
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                <code
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    wordBreak: 'break-all',
                  }}
                >
                  {data.secret}
                </code>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  style={{
                    flex: '0 0 auto',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'inherit',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: 11.5, opacity: 0.7, margin: '8px 0 0' }}>
                Keep this secret somewhere safe — you&apos;ll need it to
                recover access if you lose your device.
              </p>
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '16px 24px 22px' }}>
        <button
          type="button"
          onClick={handleDone}
          disabled={!data || setupMutation.isPending}
          style={{
            width: '100%',
            backgroundColor: 'var(--color-primary, #D1AA67)',
            color: '#000',
            fontWeight: 600,
            fontSize: 15,
            padding: '12px 20px',
            border: 'none',
            borderRadius: 50,
            cursor: !data ? 'not-allowed' : 'pointer',
            opacity: !data ? 0.6 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          I&apos;ve scanned it
          <i className="ri-arrow-right-line" style={{ fontSize: 16 }} />
        </button>
      </div>
    </Modal>
  )
}
