import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'agce_spot_favorites'

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

function saveToStorage(set: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {
    // ignore quota errors
  }
}

export function useDashboardFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(loadFromStorage)

  useEffect(() => {
    saveToStorage(favorites)
  }, [favorites])

  const isFavorite = useCallback(
    (symbol: string) => favorites.has(symbol),
    [favorites],
  )

  const toggleFavorite = useCallback((symbol: string) => {
    if (!symbol) return
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(symbol)) {
        next.delete(symbol)
      } else {
        next.add(symbol)
      }
      return next
    })
  }, [])

  return { isFavorite, toggleFavorite }
}
