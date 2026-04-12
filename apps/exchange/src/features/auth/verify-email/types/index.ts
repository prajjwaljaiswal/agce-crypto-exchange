export type VerifyEmailMode = 'signup' | 'login'

export interface VerifyEmailLocationState {
  email?: string
  mode?: VerifyEmailMode
}
