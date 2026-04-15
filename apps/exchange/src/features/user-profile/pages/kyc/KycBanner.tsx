import { useInstanceConfig } from '@agce/hooks'

interface KycBannerProps {
  onVerify: () => void
  isPending?: boolean
}

export function KycBanner({ onVerify, isPending }: KycBannerProps) {
  const instance = useInstanceConfig()
  const { requireVKYC } = instance.kyc

  return (
    <div className="kyc_verif_bnr">
      <div className="kysbnr_cnt">
        <h5>KYC</h5>
        <p>
          Finish your KYC in just a few minutes and enjoy a seamless experience.
          Regulated by <strong>{instance.compliance.regulator}</strong>. Submit
          your basic details once and get instant access to withdrawals,
          rewards, and every feature without any delays or limitations.
        </p>

        <h6>KYC Verification Requirements</h6>

        <ul className="kyclist">
          <li>
            <img src="/images/staricon.png" alt="star" /> ID Document
          </li>
          {instance.compliance.taxReporting && (
            <li>
              <img src="/images/staricon.png" alt="star" /> Tax Document
            </li>
          )}
          {requireVKYC && (
            <li>
              <img src="/images/staricon.png" alt="star" /> Live Selfie (Camera
              Required)
            </li>
          )}
        </ul>

        <button type="button" className="kyc btn" onClick={onVerify} disabled={isPending}>
          {isPending ? 'Starting…' : 'Verify'}
        </button>
      </div>
      <div className="kycvector">
        <img src="/images/kyc_verification_vector.svg" alt="kyc" />
      </div>
    </div>
  )
}
