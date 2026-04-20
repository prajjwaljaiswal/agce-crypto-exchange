import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { GoogleAuthSetupResponse } from '@agce/types'
import { authApi } from '../../../lib/auth-api.js'
import { formatApiError } from '../../../lib/errors.js'

// POST /auth/google-authenticator — enables TOTP and returns the secret + QR
// code data URI. Account is enabled server-side immediately; the user still
// has to scan the QR before they can actually log in with it.
export function useSetupGoogleAuth() {
  const queryClient = useQueryClient()

  return useMutation<GoogleAuthSetupResponse>({
    mutationFn: () => authApi.googleAuthSetup(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
    onError: (error) => {
      toast.error(formatApiError(error, 'Could not enable Google Authenticator.'))
    },
  })
}
