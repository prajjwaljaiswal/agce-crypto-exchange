export type SignupTab = 'email' | 'phone'

export interface SignupStep1Form {
  email: string
  phone: string
  countryCode: string
  referralCode: string
}
