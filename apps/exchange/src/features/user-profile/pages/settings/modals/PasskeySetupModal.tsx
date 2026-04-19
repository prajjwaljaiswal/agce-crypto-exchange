import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  startRegistration,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser'
import { Modal } from '@agce/ui'
import { authApi } from '../../../../../lib/auth-api.js'
import { formatApiError } from '../../../../../lib/errors.js'

interface PasskeySetupModalProps {
  isOpen: boolean
  onClose: () => void
  onAdded?: () => void
}

export function PasskeySetupModal({
  isOpen,
  onClose,
  onAdded,
}: PasskeySetupModalProps) {
  const [deviceName, setDeviceName] = useState('')

  useEffect(() => {
    if (!isOpen) setDeviceName('')
  }, [isOpen])

  const addPasskeyMutation = useMutation({
    mutationFn: async (name: string) => {
      const { options } = await authApi.passkeyRegisterOptions()
      const attestation = await startRegistration({
        optionsJSON: options as unknown as Parameters<
          typeof startRegistration
        >[0]['optionsJSON'],
      })
      return authApi.passkeyVerifyRegistration({
        response: attestation as unknown as Record<string, unknown>,
        deviceName: name || undefined,
      })
    },
    onSuccess: (res) => {
      if (!res?.credentialId) {
        toast.error(res?.message ?? 'Passkey could not be verified.')
        return
      }
      toast.success('Passkey added. You can now use it to sign in.')
      onAdded?.()
      onClose()
    },
    onError: (error) => {
      const err = error as { name?: string }
      if (err?.name === 'NotAllowedError' || err?.name === 'AbortError') {
        toast.error('Passkey prompt was cancelled.')
        return
      }
      if (err?.name === 'InvalidStateError') {
        toast.error('This authenticator is already registered.')
        return
      }
      toast.error(formatApiError(error, 'Could not add passkey.'))
    },
  })

  const unsupported = !browserSupportsWebAuthn()

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
            className="ri-fingerprint-line"
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
            Add a Passkey
          </h5>
          <p
            className="anti-phishing-header-subtitle"
            style={{ margin: '4px 0 0', fontSize: 12.5 }}
          >
            Sign in with Face ID, Touch ID, Windows Hello, or a security key.
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

      <div style={{ padding: '20px 24px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <section
          style={{
            padding: '14px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h6 className="anti-phishing-heading" style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
            How it works
          </h6>
          <p
            className="anti-phishing-paragraph"
            style={{ margin: '6px 0 0', fontSize: 12.5, lineHeight: 1.55 }}
          >
            Your device creates a private key that never leaves it. Next time you log
            in, you can use your device&apos;s biometrics instead of your password —
            password login continues to work.
          </p>
        </section>

        <div>
          <label
            htmlFor="passkey-device-name"
            style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}
          >
            Device name (optional)
          </label>
          <input
            id="passkey-device-name"
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value.slice(0, 40))}
            placeholder="e.g. My iPhone 14"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: 'inherit',
              fontSize: 14,
            }}
          />
        </div>

        {unsupported && (
          <p style={{ fontSize: 12.5, color: '#f0b429', margin: 0 }}>
            Your browser doesn&apos;t support passkeys. Try the latest Chrome, Safari,
            or Edge.
          </p>
        )}
      </div>

      <div style={{ padding: '16px 24px 22px' }}>
        <button
          type="button"
          onClick={() => addPasskeyMutation.mutate(deviceName.trim())}
          disabled={unsupported || addPasskeyMutation.isPending}
          style={{
            width: '100%',
            backgroundColor: 'var(--color-primary, #D1AA67)',
            color: '#000',
            fontWeight: 600,
            fontSize: 15,
            padding: '12px 20px',
            border: 'none',
            borderRadius: 50,
            cursor: unsupported || addPasskeyMutation.isPending ? 'not-allowed' : 'pointer',
            opacity: unsupported || addPasskeyMutation.isPending ? 0.6 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {addPasskeyMutation.isPending ? 'Waiting for device…' : 'Create passkey'}
          <i className="ri-arrow-right-line" style={{ fontSize: 16 }} />
        </button>
      </div>
    </Modal>
  )
}
