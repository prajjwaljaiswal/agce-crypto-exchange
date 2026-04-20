import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authApi } from '../../../lib/auth-api.js'
import { formatApiError } from '../../../lib/errors.js'

// DELETE /auth/google-authenticator — drops the TOTP secret and flips
// `googleAuthenticatorEnabled` to false. Invalidates /me so the UI updates.
export function useRemoveGoogleAuth() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.googleAuthDisable(),
    onSuccess: () => {
      toast.success('Google Authenticator disabled.')
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
    onError: (error) => {
      toast.error(formatApiError(error, 'Could not disable Google Authenticator.'))
    },
  })
}
