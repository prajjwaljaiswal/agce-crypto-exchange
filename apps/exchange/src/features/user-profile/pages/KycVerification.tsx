import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useInstanceConfig } from '@agce/hooks'
import { mapInstanceToJurisdiction } from '@agce/config'
import { KycBanner } from './kyc/KycBanner.js'
import { AccountBenefits } from './kyc/AccountBenefits.js'
import { KycFaq } from './kyc/KycFaq.js'
import { KycVerifyWarningModal } from './kyc/modals/KycVerifyWarningModal.js'
import { useKycStatus, useStartKyc } from './kyc/hooks.js'
import { useAuth } from '../../../providers/index.js'
import { formatApiError } from '../../../lib/errors.js'

export function KycVerification() {
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const instance = useInstanceConfig()
  const { data: kycData, isLoading, isError } = useKycStatus()
  const { mutateAsync: startKyc, isPending: isStarting } = useStartKyc()
  const [pendingVerifyUrl, setPendingVerifyUrl] = useState('')

  // When Didit redirects back with ?session_id=, force a fresh status fetch
  useEffect(() => {
    if (searchParams.get('session_id')) {
      queryClient.invalidateQueries({ queryKey: ['kyc', 'status'] })
    }
  }, [searchParams, queryClient])

  const handleVerify = async () => {
    try {
      const identifier = user?.identifier ?? ''
      const isEmail = identifier.includes('@')
      const session = await startKyc({
        jurisdiction: mapInstanceToJurisdiction(instance.id),
        ...(isEmail ? { email: identifier } : identifier.startsWith('+') ? { phone: identifier } : {}),
      })
      setPendingVerifyUrl(session.diditUrl)
    } catch (err) {
      alert(formatApiError(err, 'Could not start verification. Please try again.'))
    }
  }

  const status = kycData?.status
  const isInitial = !status || status === 'NOT_STARTED' || status === 'ABANDONED' || status === 'EXPIRED'
  const isPendingReview = status === 'IN_PROGRESS' || status === 'IN_REVIEW' || status === 'RESUBMITTED'
  const isApproved = status === 'APPROVED'
  const isDeclined = status === 'DECLINED'

  return (
    <div className="dashboard_right">
      <KycVerifyWarningModal
        isOpen={!!pendingVerifyUrl}
        onContinue={() => { window.location.href = pendingVerifyUrl }}
        onLater={() => setPendingVerifyUrl('')}
      />

      <div className="kyc_verif_bnr_wrapper">
        <div className="profile_sections">
          <div className="row">
            <div className="col-md-12">
              <h2 className="mb-0 pb-0"> KYC Verification </h2>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="kyc_verif_bnr" style={{ justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
            <i className="ri-loader-4-line" style={{ fontSize: 32 }} />
          </div>
        ) : isPendingReview ? (
          <div className="kyc_verif_bnr">
            <div className="kysbnr_cnt">
              <h5>KYC Verification In Progress</h5>
              <p>Your verification is being reviewed. This usually takes a few minutes.</p>
              <button type="button" className="kyc btn" disabled>
                <i className="ri-loader-4-line" /> Under Review
              </button>
            </div>
            <div className="kycvector">
              <img src="/images/kyc_verification_vector.svg" alt="kyc" />
            </div>
          </div>
        ) : isApproved ? (
          <div className="kyc_verif_bnr">
            <div className="kysbnr_cnt">
              <h5>KYC Verified</h5>
              <p>Your identity has been verified. You have full access to all platform features.</p>
              <span className="kyc btn" style={{ cursor: 'default' }}>
                <i className="ri-shield-check-line" /> Verified
              </span>
            </div>
            <div className="kycvector">
              <img src="/images/kyc_verification_vector.svg" alt="kyc" />
            </div>
          </div>
        ) : isDeclined ? (
          <div className="kyc_verif_bnr">
            <div className="kysbnr_cnt">
              <h5>KYC Declined</h5>
              <p>
                Your verification was declined.
                {kycData?.decision?.decline_reason && (
                  <> Reason: <strong>{kycData.decision.decline_reason}</strong></>
                )}
              </p>
              <button type="button" className="kyc btn" onClick={handleVerify} disabled={isStarting}>
                {isStarting ? 'Starting…' : 'Try Again'}
              </button>
            </div>
            <div className="kycvector">
              <img src="/images/kyc_verification_vector.svg" alt="kyc" />
            </div>
          </div>
        ) : isInitial || isError ? (
          <KycBanner onVerify={handleVerify} isPending={isStarting} />
        ) : null}

        <div className="kyc_account d-flex">
          <AccountBenefits />
          <KycFaq />
        </div>
      </div>
    </div>
  )
}
