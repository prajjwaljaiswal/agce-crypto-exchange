import { useNavigate } from 'react-router-dom'
import { Check, ShieldCheck } from 'lucide-react'
import { Navbar } from '../../../components/layout/Navbar.js'
import { ROUTES } from '../../../constants/routes.js'

interface PrivilegeRow {
  label: string
  notVerified: string
  verified: string | 'check'
}

const PRIVILEGES: PrivilegeRow[] = [
  { label: 'Withdrawal', notVerified: '----', verified: '3M USDT' },
  { label: 'Deposit', notVerified: '----', verified: 'check' },
  { label: 'Trading', notVerified: '----', verified: 'check' },
  { label: 'P2P', notVerified: '----', verified: 'check' },
]

export function SignupSuccessPage() {
  const navigate = useNavigate()

  const handleVerifyNow = () => {
    navigate(ROUTES.PROFILE.KYC)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-6 py-4">
        <div
          className="w-full mx-auto flex flex-col items-center"
          style={{ maxWidth: '960px' }}
        >
          {/* Hero image + reflection (cropped window per Figma) */}
          <div className="relative" style={{ width: 257, height: 300 }}>
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 overflow-hidden pointer-events-none select-none"
              style={{ width: 257, height: 260 }}
            >
              <img
                src="/images/kyc_hero.png"
                alt="AGCE reward"
                className="absolute top-0"
                style={{
                  width: '171.38%',
                  height: '100%',
                  left: '-71.38%',
                  maxWidth: 'none',
                }}
              />
            </div>
            <img
              src="/images/kyc_hero_reflection.png"
              alt=""
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none"
              style={{
                top: 220,
                width: 220,
                height: 90,
                opacity: 0.1,
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Heading */}
          <h1
            className="text-[50px] font-semibold leading-[70px] text-center mb-6"
            style={{ color: 'var(--color-text)', maxWidth: '929px' }}
          >
            Welcome to AGCE Verify your identity to claim{' '}
            <span style={{ color: 'var(--color-primary)' }}>exciting bonus</span>.
          </h1>

          {/* Privilege table */}
          <div className="w-full mb-6" style={{ maxWidth: '660px' }}>
            <div className="grid grid-cols-3 text-center pb-3">
              <div
                className="text-[24px] font-normal"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Privileges
              </div>
              <div
                className="text-[24px] font-normal"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Not Verified
              </div>
              <div
                className="text-[24px] font-normal"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Verified
              </div>
            </div>

            {PRIVILEGES.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-3 items-center text-center py-[14px]"
              >
                <div
                  className="text-[20px] font-semibold"
                  style={{ color: 'var(--color-text)' }}
                >
                  {row.label}
                </div>
                <div
                  className="text-[20px] font-semibold"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  {row.notVerified}
                </div>
                <div
                  className="text-[20px] font-semibold flex items-center justify-center"
                  style={{ color: 'var(--color-text)' }}
                >
                  {row.verified === 'check' ? (
                    <Check size={22} strokeWidth={2.5} />
                  ) : (
                    row.verified
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Verify Now — stays as dark pill in both themes to match brand */}
          <button
            type="button"
            onClick={handleVerifyNow}
            className="h-[67px] rounded-full text-[20px] font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-surface-3)',
              color: 'var(--color-text)',
              width: '657px',
              maxWidth: '100%',
            }}
          >
            Verify Now
          </button>

          {/* Security footer */}
          <div
            className="flex items-center gap-1.5 mt-6 text-[14px]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <ShieldCheck size={16} />
            <span>Your information is securely encrypted on AGCE.</span>
          </div>
        </div>
      </main>
    </div>
  )
}
