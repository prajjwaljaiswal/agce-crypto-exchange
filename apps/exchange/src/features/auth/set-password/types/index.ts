export interface SetPasswordLocationState {
  email?: string
}

export interface PasswordRuleState {
  notAllNumbers: boolean
  notAllLetters: boolean
  minLength: boolean
  notUsername: boolean
}
