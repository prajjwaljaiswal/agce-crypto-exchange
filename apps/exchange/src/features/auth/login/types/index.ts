export type LoginTab = 'email' | 'phone' | 'qrcode'

export interface LoginForm {
  identifier: string
  countryCode: string
  phone: string
  password: string
  bindIp: boolean
}
