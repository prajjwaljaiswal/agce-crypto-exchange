import { useDisclosure } from '@agce/hooks'
import { VerificationOptionsModal } from './settings/modals/VerificationOptionsModal.js'
import { KycBanner } from './kyc/KycBanner.js'
import { AccountBenefits } from './kyc/AccountBenefits.js'
import { KycFaq } from './kyc/KycFaq.js'
import { KycSelectCountryModal } from './kyc/modals/KycSelectCountryModal.js'
import { KycVerificationCodeModal } from './kyc/modals/KycVerificationCodeModal.js'
import { KycSubmitModal } from './kyc/modals/KycSubmitModal.js'

const KYC_VERIFY_OPTIONS = [
  {
    icon: 'ri-mail-line',
    title: 'Email OTP',
    description: 'Send code to demo.user@example.com',
  },
  {
    icon: 'ri-shield-keyhole-line',
    title: 'Google Authenticator',
    description: 'Use your authenticator app',
  },
  {
    icon: 'ri-smartphone-line',
    title: 'Mobile OTP',
    description: 'Send code to +91 98765 43210',
  },
]

export function KycVerification() {
  const selectCountry = useDisclosure()
  const verificationCode = useDisclosure()
  const submitted = useDisclosure()
  const verifyOptions = useDisclosure()

  return (
    <div className="dashboard_right">
      <div className="kyc_verif_bnr_wrapper">
        <div className="profile_sections">
          <div className="row">
            <div className="col-md-12">
              <h2 className="mb-0 pb-0"> KYC Verification </h2>
            </div>
          </div>
        </div>

        <KycBanner onVerify={selectCountry.open} />

        <div className="kyc_account d-flex">
          <AccountBenefits />
          <KycFaq />
        </div>
      </div>

      <KycSelectCountryModal
        isOpen={selectCountry.isOpen}
        onClose={selectCountry.close}
        onNext={verificationCode.open}
      />
      <KycVerificationCodeModal
        isOpen={verificationCode.isOpen}
        onClose={verificationCode.close}
        onBack={() => {
          verificationCode.close()
          selectCountry.open()
        }}
        onSwitchVerification={verifyOptions.open}
        onSubmit={submitted.open}
      />
      <KycSubmitModal isOpen={submitted.isOpen} onClose={submitted.close} />
      <VerificationOptionsModal
        isOpen={verifyOptions.isOpen}
        onClose={verifyOptions.close}
        options={KYC_VERIFY_OPTIONS}
      />
    </div>
  )
}
