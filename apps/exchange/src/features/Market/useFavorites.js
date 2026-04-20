import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { http, ApiError } from '../../lib/http.js'
import { formatApiError } from '../../lib/errors.js'
import { useAuth } from '../../providers/AuthProvider.js'

const FAVORITES_QUERY_KEY = ['favorites']

// Backend may return the list as plain strings ["BTC-USDT", ...] or as
// objects [{ symbol: "BTC-USDT" }, ...]. Normalize to a string[] either way.
function normalizeSymbols(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => (typeof item === 'string' ? item : item?.symbol))
    .filter(Boolean)
}

// Some DELETE endpoints respond 204/empty; the envelope parser would throw.
// Treat empty-but-ok responses as success.
async function safeHttp(path, opts) {
  try {
    return await http(path, opts)
  } catch (err) {
    if (err instanceof ApiError && err.message === 'Empty response body') return null
    throw err
  }
}

export function useFavorites() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: () => http('/api/v1/favorites', { listResponse: true }),
    enabled: isAuthenticated,
    staleTime: 60_000,
  })

  const favorites = useMemo(
    () => new Set(normalizeSymbols(query.data)),
    [query.data],
  )

  const addMutation = useMutation({
    mutationFn: (symbol) =>
      safeHttp('/api/v1/favorites', { method: 'POST', body: { symbol } }),
    onMutate: async (symbol) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY })
      const prev = queryClient.getQueryData(FAVORITES_QUERY_KEY)
      queryClient.setQueryData(FAVORITES_QUERY_KEY, (old) => {
        const list = normalizeSymbols(old)
        return list.includes(symbol) ? list : [...list, symbol]
      })
      return { prev }
    },
    onError: (err, _symbol, ctx) => {
      if (ctx?.prev !== undefined) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, ctx.prev)
      }
      toast.error(formatApiError(err, 'Could not add favorite.'))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY })
    },
  })

  const removeMutation = useMutation({
    mutationFn: (symbol) =>
      safeHttp(`/api/v1/favorites/${encodeURIComponent(symbol)}`, { method: 'DELETE' }),
    onMutate: async (symbol) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY })
      const prev = queryClient.getQueryData(FAVORITES_QUERY_KEY)
      queryClient.setQueryData(FAVORITES_QUERY_KEY, (old) =>
        normalizeSymbols(old).filter((s) => s !== symbol),
      )
      return { prev }
    },
    onError: (err, _symbol, ctx) => {
      if (ctx?.prev !== undefined) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, ctx.prev)
      }
      toast.error(formatApiError(err, 'Could not remove favorite.'))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY })
    },
  })

  const isFavorite = (symbol) => favorites.has(symbol)

  const toggleFavorite = (symbol) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save favorites.')
      return
    }
    if (!symbol) return
    if (favorites.has(symbol)) {
      removeMutation.mutate(symbol)
    } else {
      addMutation.mutate(symbol)
    }
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    isLoading: query.isLoading,
  }
}
