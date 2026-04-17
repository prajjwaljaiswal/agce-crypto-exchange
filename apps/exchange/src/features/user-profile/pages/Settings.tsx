import { useDisclosure } from '@agce/hooks'
import { useAuth } from '../../../providers/AuthProvider.js'
import { ProfileSection } from './settings/ProfileSection.js'
import { CurrencyPreferenceSection } from './settings/CurrencyPreferenceSection.js'
import { SecuritySection } from './settings/SecuritySection.js'
import { AntiPhishingInfoModal } from './settings/modals/AntiPhishingInfoModal.js'
import { AntiPhishingSetCodeModal } from './settings/modals/AntiPhishingSetCodeModal.js'
import { VerificationOptionsModal } from './settings/modals/VerificationOptionsModal.js'
import { PasswordChangeModal } from './settings/modals/PasswordChangeModal.js'
import { EditProfileModal } from './settings/modals/EditProfileModal.js'

const ALL_VERIFY_OPTIONS = [
  {
    icon: 'ri-mail-line',
    title: 'Email',
    description: 'Send code to de***o@example.com',
  },
  {
    icon: 'ri-shield-keyhole-line',
    title: 'Google Authenticator',
    description: 'Use your authenticator app',
  },
  {
    icon: 'ri-smartphone-line',
    title: 'Mobile',
    description: 'Send code to ****3210',
  },
]

const PASSWORD_VERIFY_OPTIONS = [
  {
    icon: 'ri-mail-line',
    title: 'Email',
    description: 'Receive verification code via email',
  },
  {
    icon: 'ri-shield-keyhole-line',
    title: 'Google Authenticator',
    description: 'Use your Google Authenticator app',
  },
  {
    icon: 'ri-smartphone-line',
    title: 'Mobile',
    description: 'Receive verification code via SMS',
  },
]

export function Settings() {
  const { user } = useAuth()
  const editProfile = useDisclosure()
  const passwordChange = useDisclosure()
  const antiPhishingInfo = useDisclosure()
  const antiPhishingSetCode = useDisclosure()
  const antiPhishingVerifyOptions = useDisclosure()
  const passwordVerifyOptions = useDisclosure()

  const handleGetStarted = () => {
    antiPhishingInfo.close()
    antiPhishingSetCode.open()
  }

  return (
    <div className="dashboard_right">
      <ProfileSection onEditProfile={editProfile.open} />
      <CurrencyPreferenceSection />
      <SecuritySection
        onChangePassword={passwordChange.open}
        onSetAntiPhishing={antiPhishingInfo.open}
      />

      <EditProfileModal
        isOpen={editProfile.isOpen}
        onClose={editProfile.close}
        initialFirstName={user?.firstName ?? ''}
        initialLastName={user?.lastName ?? ''}
      />

      <PasswordChangeModal
        isOpen={passwordChange.isOpen}
        onClose={passwordChange.close}
        onSwitchVerification={passwordVerifyOptions.open}
      />
      <VerificationOptionsModal
        isOpen={passwordVerifyOptions.isOpen}
        onClose={passwordVerifyOptions.close}
        options={PASSWORD_VERIFY_OPTIONS}
      />

      <AntiPhishingInfoModal
        isOpen={antiPhishingInfo.isOpen}
        onClose={antiPhishingInfo.close}
        onGetStarted={handleGetStarted}
      />
      <AntiPhishingSetCodeModal
        isOpen={antiPhishingSetCode.isOpen}
        onClose={antiPhishingSetCode.close}
        onSwitchVerification={antiPhishingVerifyOptions.open}
      />
      <VerificationOptionsModal
        isOpen={antiPhishingVerifyOptions.isOpen}
        onClose={antiPhishingVerifyOptions.close}
        options={ALL_VERIFY_OPTIONS}
      />
    </div>
  )
}
