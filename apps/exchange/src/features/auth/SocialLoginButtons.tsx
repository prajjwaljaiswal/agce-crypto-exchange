import { useGoogleLogin } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'
import { mapInstanceToJurisdiction } from '@agce/config'
import { useInstanceConfig } from '@agce/hooks'
import type { LoginSuccess, RegisterResponse } from '@agce/types'
import { authApi } from '../../lib/auth-api.js'
import { useAuth } from '../../providers/index.js'
import { formatApiError } from '../../lib/errors.js'

// The redirect_uri Google expects must match what was used when the code was obtained.
// For popup flow (@react-oauth/google default), Google uses 'postmessage' internally.
const GOOGLE_REDIRECT_URI = 'postmessage'

function isLoginSuccess(res: object): res is LoginSuccess {
  return 'accessToken' in res
}

interface SocialLoginButtonsProps {
  /** Text shown in the divider above the buttons. */
  dividerLabel: string
  /** 'login' calls POST /login; 'signup' calls POST /register — both with provider:'GOOGLE'. */
  mode: 'login' | 'signup'
  /** Called after tokens are stored — typically used to navigate or advance the wizard. */
  onSuccess: () => void
}

export function SocialLoginButtons({ dividerLabel, mode, onSuccess }: SocialLoginButtonsProps) {
  const { login } = useAuth()
  const instanceConfig = useInstanceConfig()
  const jurisdiction = mapInstanceToJurisdiction(instanceConfig.id)

  const handleTokens = (res: LoginSuccess) => {
    login(
      { accessToken: res.accessToken, refreshToken: res.refreshToken },
      { id: res.userId, userId: res.userId },
    )
    onSuccess()
  }

  const loginMutation = useMutation({
    mutationFn: (code: string) =>
      authApi.googleLogin({ provider: 'GOOGLE', code, redirectUri: GOOGLE_REDIRECT_URI }),
    onSuccess: (response) => {
      if (isLoginSuccess(response)) {
        handleTokens(response)
      } else {
        alert('Google sign-in requires a verification step. Please use email/password login.')
      }
    },
    onError: (error) => alert(formatApiError(error, 'Google sign-in failed.')),
  })

  const registerMutation = useMutation({
    mutationFn: (code: string) =>
      authApi.googleRegister({ provider: 'GOOGLE', code, redirectUri: GOOGLE_REDIRECT_URI, jurisdiction }),
    onSuccess: (response: RegisterResponse) => {
      handleTokens({ userId: response.userId, accessToken: response.accessToken, refreshToken: response.refreshToken })
    },
    onError: (error) => alert(formatApiError(error, 'Google sign-up failed.')),
  })

  const isPending = loginMutation.isPending || registerMutation.isPending

  const triggerGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: ({ code }) => {
      if (mode === 'signup') {
        registerMutation.mutate(code)
      } else {
        loginMutation.mutate(code)
      }
    },
    onError: () => alert('Google sign-in was cancelled or failed.'),
  })

  return (
    <>
      <div className="signup-wizard-divider">{dividerLabel}</div>
      <div className="signup-wizard-social-row">
        <button
          type="button"
          className="signup-wizard-social-btn"
          onClick={() => triggerGoogleLogin()}
          disabled={isPending}
          aria-label="Google"
        >
          <img src="/images/google_icon.svg" alt="" />
        </button>
        <button
          type="button"
          className="signup-wizard-social-btn"
          onClick={() => alert('Apple sign-in coming soon.')}
          aria-label="Apple"
        >
          <img src="/images/appleicon2.svg" alt="" />
        </button>
      </div>
    </>
  )
}
