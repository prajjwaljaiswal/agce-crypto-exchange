export type ForgotPasswordTab = 'email' | 'phone'

export interface EmailResetForm {
  email: string
  otp: string
  newPassword: string
  showPassword: boolean
  otpSent: boolean
}

export interface PhoneResetForm {
  countryCode: string
  phone: string
  otp: string
  newPassword: string
  showPassword: boolean
  otpSent: boolean
}
