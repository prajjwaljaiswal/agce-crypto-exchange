import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0E0E0E' }}>
      <Outlet />
    </div>
  )
}
