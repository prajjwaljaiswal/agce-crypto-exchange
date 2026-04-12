export type SignupTab = 'email' | 'mobile'

export interface PasswordValidation {
  hasNumber: boolean
  hasSpecial: boolean
  hasCapital: boolean
  hasMinLength: boolean
}

export interface EmailSignupForm {
  email: string
  password: string
  showPassword: boolean
  inviteCode: string
}

export interface MobileSignupForm {
  countryCode: string
  phone: string
  password: string
  showPassword: boolean
  inviteCode: string
}
