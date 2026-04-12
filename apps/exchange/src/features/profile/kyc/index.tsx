import { Link } from 'react-router-dom'
import {
  Lock,
  ChevronDown,
  ChevronUp,
  Wallet,
  ArrowDownToLine,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import type { DiditStatus, KycDecision, KycStartSessionPayload } from '@agce/types'
import { useInstanceConfig } from '@agce/hooks'
import { jurisdictionFromInstance } from '../../auth/api.js'
import { useAuth } from '../../../store/authStore.js'
import { useKycStatus, useStartKycSession } from './hooks.js'

// ─── Verification Status ────────────────────────────────────────────────────

type VerificationStatus = 'none' | 'failed' | 'complete' | 'pending'

function mapDiditStatus(status: DiditStatus | undefined): VerificationStatus {
  switch (status) {
    case 'Approved':
      return 'complete'
    case 'Declined':
      return 'failed'
    case 'In Progress':
    case 'In Review':
    case 'Resubmitted':
      return 'pending'
    default:
      return 'none'
  }
}

// ─── Locked Feature Row ──────────────────────────────────────────────────────

interface LockedFeature {
  icon: React.ReactNode
  title: string
  description: string
}

const LOCKED_FEATURES: LockedFeature[] = [
  {
    icon: <Wallet size={20} style={{ color: '#303236' }} />,
    title: 'Withdrawal',
    description: 'Locked to prevent fraud until identity is verified.',
  },
  {
    icon: <ArrowDownToLine size={20} style={{ color: '#303236' }} />,
    title: 'Deposit',
    description: 'Locked to prevent fraud until identity is verified.',
  },
  {
    icon: <TrendingUp size={20} style={{ color: '#303236' }} />,
    title: 'Trading',
    description: 'Verification ensures safe and legitimate transactions.',
  },
  {
    icon: <Users size={20} style={{ color: '#303236' }} />,
    title: 'P2P',
    description: 'Requires verification for secure transactions.',
  },
]

function LockedFeatureRow({ feature }: { feature: LockedFeature }) {
  return (
    <div
      className="flex items-center justify-between rounded-xl px-5 py-4"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #f2f3f4',
        boxShadow: '0 0 6px rgba(0,0,0,0.1)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0">{feature.icon}</div>
        <div>
          <p className="text-sm font-medium" style={{ color: '#303236' }}>
            {feature.title}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#84878a' }}>
            {feature.description}
          </p>
        </div>
      </div>
      <Lock size={16} style={{ color: '#84878a' }} />
    </div>
  )
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────

interface FAQItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How to complete individual KYC?',
    answer: '',
  },
  {
    question: 'How to complete business KYC?',
    answer: '',
  },
  {
    question: 'Why is KYC verification required?',
    answer:
      'To protect your assets and promote a secure, compliant crypto environment, AGCE requires all users to complete KYC (Know Your Customer) verification. This helps prevent fraud, money laundering, and other illicit activities. Once your KYC is verified, you\u2019ll gain access to key platform features including crypto deposits and withdrawals, P2P trading, and participation in events like Launchpool.',
  },
  {
    question: 'Why is an advanced verification necessary?',
    answer:
      'Advanced verification unlocks higher limits. Rewards Hub with exclusive beginner rewards, and gain access to more platform features, including deposits, buy crypto, trade, and more.',
  },
]

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(2)

  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: '#ffffff', border: '1px solid #f2f3f4' }}
    >
      <h3 className="text-lg font-medium mb-5" style={{ color: '#303236' }}>
        Frequently Asked Questions
      </h3>
      <div className="flex flex-col gap-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx
          const hasAnswer = item.answer.length > 0

          return (
            <div
              key={idx}
              className="pb-3"
              style={{ borderBottom: '1px solid #f2f3f4' }}
            >
              <button
                type="button"
                className="flex items-start justify-between w-full text-left gap-3"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <span className="text-sm font-medium" style={{ color: '#303236' }}>
                  {item.question}
                </span>
                {isOpen ? (
                  <ChevronUp size={18} className="shrink-0 mt-0.5" style={{ color: '#84878a' }} />
                ) : (
                  <ChevronDown size={18} className="shrink-0 mt-0.5" style={{ color: '#84878a' }} />
                )}
              </button>
              {isOpen && hasAnswer && (
                <p
                  className="text-sm leading-relaxed mt-3"
                  style={{ color: '#84878a' }}
                >
                  {item.answer}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Identity Card (initial / no verification) ──────────────────────────────

interface StartVerificationProps {
  onStart: () => void
  isPending: boolean
  error: string | null
}

function IdentityCardInitial({ onStart, isPending, error }: StartVerificationProps) {
  return (
    <div
      className="rounded-xl relative overflow-hidden"
      style={{ border: '1px solid #f2f3f4' }}
    >
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-2" style={{ color: '#303236' }}>
          Standard Identity Verification
        </h2>
        <p className="text-base mb-6" style={{ color: '#84878a' }}>
          It takes only 2-5 minutes to verify your account.
        </p>
        <button
          type="button"
          onClick={onStart}
          disabled={isPending}
          className="inline-block text-sm font-medium px-8 py-3 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#303236', color: '#ffffff' }}
        >
          {isPending ? 'Starting…' : 'Verify Now'}
        </button>
        {error && (
          <p className="text-sm mt-3" style={{ color: '#e7000b' }}>
            {error}
          </p>
        )}
      </div>
      <img
        src="/images/kyc_illustration.svg"
        alt=""
        className="absolute right-8 top-4 w-48 h-48 object-contain pointer-events-none"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
    </div>
  )
}

function IdentityCardPending() {
  return (
    <div
      className="rounded-xl p-8"
      style={{ border: '1px solid #f2f3f4', backgroundColor: '#ffffff' }}
    >
      <h2 className="text-2xl font-semibold mb-2" style={{ color: '#303236' }}>
        Verification in Progress
      </h2>
      <p className="text-base" style={{ color: '#84878a' }}>
        Your verification is being reviewed. This usually takes a few minutes — you can leave this page and come back.
      </p>
    </div>
  )
}

// ─── Identity Card (failed verification) ─────────────────────────────────────

function IdentityCardFailed({
  decision,
  onRetry,
  isPending,
  error,
}: {
  decision?: KycDecision
  onRetry: () => void
  isPending: boolean
  error: string | null
}) {
  const reason =
    decision?.decline_reason ??
    'Your identity verification is currently incomplete. To complete the process, please submit the required information and finish facial recognition.'
  return (
    <div className="flex flex-col gap-5">
      {/* User info row */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-normal text-white shrink-0"
          style={{
            background: 'linear-gradient(135deg, #a684ff 0%, #ad46ff 50%, #4f39f6 100%)',
          }}
        >
          GU
        </div>
        <div>
          <p className="text-lg font-normal" style={{ color: '#0f172b' }}>
            AGCE User-0c52a95c
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: '#fb2c36' }}
            />
            <span className="text-sm" style={{ color: '#e7000b' }}>
              Verification Failed
            </span>
          </div>
        </div>
      </div>

      {/* Error alert */}
      <div
        className="rounded-xl px-5 py-4 flex items-start gap-3"
        style={{
          backgroundColor: '#f2f3f4',
          borderLeft: '4px solid #fb2c36',
        }}
      >
        <AlertCircle size={22} className="shrink-0 mt-0.5" style={{ color: '#fb2c36' }} />
        <div>
          <p className="text-sm font-medium" style={{ color: '#303236' }}>
            Verification Incomplete
          </p>
          <p className="text-sm mt-1" style={{ color: '#303236' }}>
            {reason}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm" style={{ color: '#e7000b' }}>
          {error}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          disabled={isPending}
          className="inline-block text-sm font-medium px-8 py-3 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#303236', color: '#ffffff' }}
        >
          {isPending ? 'Starting…' : 'Try Again'}
        </button>
        <Link
          to="/user_profile/support"
          className="inline-block text-sm font-medium px-8 py-3 rounded-full no-underline"
          style={{ border: '1px solid #d4d4d4', color: '#343539' }}
        >
          Need Help?
        </Link>
      </div>
    </div>
  )
}

// ─── Identity Card (verification complete) ───────────────────────────────────

const UNLOCKED_FEATURES = [
  {
    icon: <Wallet size={28} style={{ color: '#303236' }} />,
    label: 'Withdrawal Limit',
    value: '3M USDT',
    description: 'Daily withdrawal limit',
  },
  {
    icon: <ArrowDownToLine size={28} style={{ color: '#303236' }} />,
    label: 'Deposit',
    value: 'Unlimited',
    description: 'No restrictions',
  },
  {
    icon: <TrendingUp size={28} style={{ color: '#303236' }} />,
    label: 'Trading',
    value: 'Full Access',
    description: 'All markets available',
  },
  {
    icon: <Users size={28} style={{ color: '#303236' }} />,
    label: 'P2P Trading',
    value: 'Enabled',
    description: 'Trade with peers',
  },
]

function IdentityCardComplete() {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Gift box image + heading */}
      <div className="flex flex-col items-center text-center">
        <img
          src="/images/kyc_giftbox.png"
          alt="Verification complete"
          className="w-48 h-48 object-contain mb-2"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <h2
          className="text-5xl font-medium"
          style={{
            background: 'linear-gradient(90deg, #101828 0%, #1e2939 50%, #101828 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Verification Complete!
        </h2>
        <p className="text-xl mt-3 max-w-xl" style={{ color: '#4a5565' }}>
          Your identity has been successfully verified. Welcome to full trading access with enhanced privileges.
        </p>
      </div>

      {/* Unlocked features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        {UNLOCKED_FEATURES.map((feature) => (
          <div
            key={feature.label}
            className="rounded-2xl p-6 flex items-start gap-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(229,231,235,0.5)',
              boxShadow: '0 10px 15px rgba(16,24,40,0.05), 0 4px 6px rgba(16,24,40,0.05)',
            }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: '#ffffff',
                boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)',
              }}
            >
              {feature.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#6a7282' }}>
                {feature.label}
              </p>
              <p className="text-2xl font-normal" style={{ color: '#0a0a0a' }}>
                {feature.value}
              </p>
              <p className="text-sm" style={{ color: '#99a1af' }}>
                {feature.description}
              </p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#d0fae5' }}
            >
              <CheckCircle2 size={20} style={{ color: '#16a34a' }} />
            </div>
          </div>
        ))}
      </div>

      {/* CTA banner */}
      <div
        className="w-full rounded-2xl p-8 flex flex-col items-center gap-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #101828 0%, #1e2939 50%, #101828 100%)',
          boxShadow: '0 25px 50px rgba(16,24,40,0.2)',
        }}
      >
        <h3 className="text-3xl font-medium text-white text-center">
          Ready to Start Trading?
        </h3>
        <p className="text-base text-center" style={{ color: '#d1d5dc' }}>
          Access all markets and start trading with the best rates
        </p>
        <Link
          to="/market"
          className="w-full max-w-xl flex items-center justify-center gap-2 py-4 rounded-xl text-base font-medium no-underline"
          style={{
            backgroundColor: '#ffffff',
            color: '#101828',
            boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          Start Trading Now
          <ArrowRight size={18} />
        </Link>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} style={{ color: '#99a1af' }} />
          <span className="text-sm" style={{ color: '#99a1af' }}>
            Bank-level encryption &bull; Fully secured
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── KycPage ─────────────────────────────────────────────────────────────────

function buildStartSessionPayload(
  jurisdiction: KycStartSessionPayload['jurisdiction'],
  identifier: string | null,
): KycStartSessionPayload {
  const payload: KycStartSessionPayload = { jurisdiction }
  if (identifier) {
    if (identifier.includes('@')) payload.email = identifier
    else if (identifier.startsWith('+')) payload.phone = identifier
  }
  return payload
}

export function KycPage() {
  const { data: kycStatus, refetch } = useKycStatus()
  const startSession = useStartKycSession()
  const instanceConfig = useInstanceConfig()
  const { session } = useAuth()
  const [launchError, setLaunchError] = useState<string | null>(null)

  const status: VerificationStatus = mapDiditStatus(kycStatus?.status)

  const handleStart = async () => {
    setLaunchError(null)
    try {
      const payload = buildStartSessionPayload(
        jurisdictionFromInstance(instanceConfig.id),
        session?.identifier ?? null,
      )
      const result = await startSession.mutate(payload)
      if (result.diditUrl) {
        window.location.href = result.diditUrl
        return
      }
      setLaunchError('Verification URL unavailable. Please try again.')
      await refetch()
    } catch {
      /* error surfaced via startSession.error */
    }
  }

  const startError = launchError ?? startSession.error

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header (hidden on complete state) */}
      {status !== 'complete' && (
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#303236' }}>
            Verification Center
          </h1>
          <p className="mt-1 text-base" style={{ color: '#84878a' }}>
            Manage your identity verification and unlock platform features
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {status === 'complete' ? (
            <IdentityCardComplete />
          ) : status === 'pending' ? (
            <>
              <IdentityCardPending />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Lock size={18} style={{ color: '#303236' }} />
                  <h3 className="text-base font-medium" style={{ color: '#303236' }}>
                    Locked Features - Verify to Unlock
                  </h3>
                </div>
                {LOCKED_FEATURES.map((feature) => (
                  <LockedFeatureRow key={feature.title} feature={feature} />
                ))}
              </div>
            </>
          ) : status === 'failed' ? (
            <>
              <IdentityCardFailed
                decision={kycStatus?.decision}
                onRetry={handleStart}
                isPending={startSession.isPending}
                error={startError}
              />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Lock size={18} style={{ color: '#303236' }} />
                  <h3 className="text-base font-medium" style={{ color: '#303236' }}>
                    Locked Features - Verify to Unlock
                  </h3>
                </div>
                {LOCKED_FEATURES.map((feature) => (
                  <LockedFeatureRow key={feature.title} feature={feature} />
                ))}
              </div>
            </>
          ) : (
            <>
              <IdentityCardInitial
                onStart={handleStart}
                isPending={startSession.isPending}
                error={startError}
              />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Lock size={18} style={{ color: '#303236' }} />
                  <h3 className="text-base font-medium" style={{ color: '#303236' }}>
                    Locked Features - Verify to Unlock
                  </h3>
                </div>
                {LOCKED_FEATURES.map((feature) => (
                  <LockedFeatureRow key={feature.title} feature={feature} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column — FAQ */}
        <div className="lg:w-[360px] shrink-0">
          <FAQSection />
        </div>
      </div>
    </div>
  )
}
