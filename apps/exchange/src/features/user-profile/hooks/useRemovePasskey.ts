import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authApi } from '../../../lib/auth-api.js'
import { formatApiError } from '../../../lib/errors.js'

// Removes every passkey on the account. The backend only exposes a per-
// credential DELETE, so we list first, then delete each. Invalidates /me so
// `isPasskeyEnabled` flips back to false in the UI.
export function useRemovePasskey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { passkeys } = await authApi.passkeyList()
      if (!passkeys?.length) return { removed: 0 }
      await Promise.all(
        passkeys.map((p) => authApi.passkeyDelete(p.credentialId)),
      )
      return { removed: passkeys.length }
    },
    onSuccess: ({ removed }) => {
      if (removed === 0) {
        toast('No passkey registered.')
        return
      }
      toast.success(removed === 1 ? 'Passkey removed.' : `${removed} passkeys removed.`)
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
    onError: (error) => {
      toast.error(formatApiError(error, 'Could not remove passkey.'))
    },
  })
}
