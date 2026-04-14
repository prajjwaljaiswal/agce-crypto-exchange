export interface MockFactor {
  id: string
  icon: string
  title: string
  description: string
  active: boolean
}

export const MOCK_FACTORS: MockFactor[] = [
  {
    id: 'email',
    icon: 'ri-mail-line',
    title: 'Email Verification',
    description: 'Receive verification codes via email.',
    active: true,
  },
  {
    id: 'mobile',
    icon: 'ri-phone-line',
    title: 'Mobile Verification',
    description: 'Receive OTP codes on your registered mobile.',
    active: true,
  },
  {
    id: 'google',
    icon: 'ri-shield-keyhole-line',
    title: 'Google Authenticator',
    description: 'Use Google Authenticator app for time-based codes.',
    active: true,
  },
  {
    id: 'passkey',
    icon: 'ri-fingerprint-line',
    title: 'Passkey',
    description: 'Biometric or hardware-key authentication.',
    active: false,
  },
]

export const SECURITY_TIPS = [
  'Never share your verification codes with anyone.',
  'Enable at least two different authentication methods.',
  'Review your active sessions regularly in Activity Logs.',
  'Update your password every 90 days.',
]
