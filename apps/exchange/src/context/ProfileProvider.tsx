import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from '../providers/AuthProvider.js'

interface UserDetails {
  kycVerified?: boolean | number
  email?: string
  name?: string
  [key: string]: unknown
}

interface ProfileContextValue {
  userDetails: UserDetails | null
}

export const ProfileContext = createContext<ProfileContextValue>({ userDetails: null })

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  return (
    <ProfileContext.Provider value={{ userDetails: user as UserDetails | null }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile(): ProfileContextValue {
  return useContext(ProfileContext)
}
