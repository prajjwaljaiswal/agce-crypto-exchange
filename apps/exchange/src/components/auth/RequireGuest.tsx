import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../providers/index.js'

/** Redirects authenticated users away from guest-only pages (login, signup, etc.) */
export function RequireGuest() {
  const { status } = useAuth()

  if (status === 'loading') return null
  if (status === 'authenticated') {
    return <Navigate to="/user_profile/dashboard" replace />
  }

  return <Outlet />
}
