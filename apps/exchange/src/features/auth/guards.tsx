import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../store/authStore.js'
import { ROUTES } from '../../constants/routes.js'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  return <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to={ROUTES.PROFILE.DASHBOARD} replace />
  return <Outlet />
}
