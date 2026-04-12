export type VerifyEmailMode = 'signup' | 'login'

export interface VerifyEmailLocationState {
  email?: string
  mode?: VerifyEmailMode
  password?: string
  bindIp?: boolean
}
