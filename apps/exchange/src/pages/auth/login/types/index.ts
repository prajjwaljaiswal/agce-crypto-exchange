export type LoginTab = 'email' | 'mobile'

export interface EmailLoginForm {
  email: string
  password: string
  showPassword: boolean
}

export interface MobileLoginForm {
  countryCode: string
  phone: string
  password: string
  showPassword: boolean
}
