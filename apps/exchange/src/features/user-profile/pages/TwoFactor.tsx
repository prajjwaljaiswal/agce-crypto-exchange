import { useDisclosure } from '@agce/hooks'
import { useAuth } from '../../../providers/AuthProvider.js'
import { MOCK_FACTORS, SECURITY_TIPS } from './__mocks__/twoFactorData.js'
import { PasskeySetupModal } from './settings/modals/PasskeySetupModal.js'
import { GoogleAuthSetupModal } from './settings/modals/GoogleAuthSetupModal.js'
import { useRemovePasskey } from '../hooks/useRemovePasskey.js'
import { useRemoveGoogleAuth } from '../hooks/useRemoveGoogleAuth.js'

const REMOVE_BTN_STYLE: React.CSSProperties = {
  border: '1px solid #ef4444',
  color: '#ef4444',
  background: 'transparent',
}

export function TwoFactor() {
  const { user } = useAuth()
  const passkeySetup = useDisclosure()
  const googleAuthSetup = useDisclosure()
  const removePasskey = useRemovePasskey()
  const removeGoogleAuth = useRemoveGoogleAuth()

  const isPasskeyEnabled = Boolean(user?.isPasskeyEnabled)
  const isGoogleAuthEnabled = Boolean(
    user?.isGoogleAuthenticatorEnabled ?? user?.googleAuthenticatorEnabled,
  )

  // Derive active state for dynamic rows from /me. Email/mobile still come
  // from the mock until backend exposes those flags.
  const factors = MOCK_FACTORS.map((f) => {
    if (f.id === 'passkey') return { ...f, active: isPasskeyEnabled }
    if (f.id === 'google') return { ...f, active: isGoogleAuthEnabled }
    return f
  })
  const activeCount = factors.filter((f) => f.active).length

  return (
    <div className="dashboard_right">
      <div className="twofactor_outer_s">
        <div className="security_level mb-3">
          <h4>Security Settings</h4>
          <p>
            Current security level:{' '}
            <strong className="text-success">
              High ({activeCount}/{factors.length} methods active)
            </strong>
          </p>
        </div>

        <div className="two_factor_list">
          {factors.map((f) => {
            const isPasskey = f.id === 'passkey'
            const isGoogle = f.id === 'google'
            const isActionable = isPasskey || isGoogle

            const showRemovePasskey = isPasskey && isPasskeyEnabled
            const showRemoveGoogle = isGoogle && isGoogleAuthEnabled

            const isPending =
              (isPasskey && removePasskey.isPending) ||
              (isGoogle && removeGoogleAuth.isPending)

            const handleClick = () => {
              if (!isActionable) return
              if (isPasskey) {
                if (showRemovePasskey) {
                  if (removePasskey.isPending) return
                  removePasskey.mutate()
                } else {
                  passkeySetup.open()
                }
                return
              }
              if (isGoogle) {
                if (showRemoveGoogle) {
                  if (removeGoogleAuth.isPending) return
                  removeGoogleAuth.mutate()
                } else {
                  googleAuthSetup.open()
                }
              }
            }

            const removing = showRemovePasskey || showRemoveGoogle
            const label = removing
              ? isPending
                ? 'Removing…'
                : isPasskey
                  ? 'Remove Passkey'
                  : 'Disable'
              : f.active
                ? 'Change'
                : 'Enable'

            return (
              <div
                key={f.id}
                className={`factor_bl${f.active ? ' active' : ''}`}
              >
                <div className="lftcnt">
                  <div className="enable">
                    <i className={f.icon} />
                  </div>
                  <div>
                    <h5>{f.title}</h5>
                    <p>{f.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={handleClick}
                  disabled={isActionable && isPending}
                  style={removing ? REMOVE_BTN_STYLE : undefined}
                >
                  {label}
                </button>
              </div>
            )
          })}
        </div>

        <div className="security-tips mt-4">
          <h5>Security tips</h5>
          <ul className="security-tips-list">
            {SECURITY_TIPS.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <PasskeySetupModal
        isOpen={passkeySetup.isOpen}
        onClose={passkeySetup.close}
      />
      <GoogleAuthSetupModal
        isOpen={googleAuthSetup.isOpen}
        onClose={googleAuthSetup.close}
      />
    </div>
  )
}
