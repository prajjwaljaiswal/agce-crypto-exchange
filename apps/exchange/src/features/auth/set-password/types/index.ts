export interface SetPasswordLocationState {
  email?: string
  otp?: string
}

export interface PasswordRuleState {
  notAllNumbers: boolean
  notAllLetters: boolean
  minLength: boolean
  notUsername: boolean
}
