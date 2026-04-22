import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { useAuth } from '../providers/AuthProvider.js'

interface UserDetails {
  kycVerified?: boolean | number
  email?: string
  name?: string
  [key: string]: unknown
}

interface ProfileContextValue {
  userDetails: UserDetails | null
  currentPage: string
  setCurrentPage: Dispatch<SetStateAction<string>>
  walletTypes: string[]
  setWalletTypes: Dispatch<SetStateAction<string[]>>
}

const noop: Dispatch<SetStateAction<never>> = () => {}

export const ProfileContext = createContext<ProfileContextValue>({
  userDetails: null,
  currentPage: '',
  setCurrentPage: noop as Dispatch<SetStateAction<string>>,
  walletTypes: [],
  setWalletTypes: noop as Dispatch<SetStateAction<string[]>>,
})

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState('')
  const [walletTypes, setWalletTypes] = useState<string[]>([])

  const value = useMemo<ProfileContextValue>(
    () => ({
      userDetails: user as UserDetails | null,
      currentPage,
      setCurrentPage,
      walletTypes,
      setWalletTypes,
    }),
    [user, currentPage, walletTypes],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile(): ProfileContextValue {
  return useContext(ProfileContext)
}
