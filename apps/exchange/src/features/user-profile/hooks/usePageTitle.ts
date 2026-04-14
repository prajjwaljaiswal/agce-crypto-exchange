import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { pageTitleFromPath } from './pageTitleFromPath.js'

export function usePageTitle(): string {
  const { pathname } = useLocation()
  return useMemo(() => pageTitleFromPath(pathname), [pathname])
}
