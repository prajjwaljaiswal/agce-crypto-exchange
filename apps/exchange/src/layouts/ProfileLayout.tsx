import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar.js'
import { ProfileSidebar } from '../components/layout/ProfileSidebar.js'

export function ProfileLayout() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)]">
        <ProfileSidebar />
        <div className="flex-1 min-w-0 px-8 py-5">
          <Outlet />
        </div>
      </div>
    </>
  )
}
