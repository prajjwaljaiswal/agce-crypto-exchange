import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../providers/index.js'

export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return null
  if (status === 'guest') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
