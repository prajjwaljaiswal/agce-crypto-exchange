import { Route } from 'react-router-dom'
import { AuthLayout } from '../layouts/index.js'
import { GuestRoute } from '../features/auth/guards.js'
import { ROUTES } from '../constants/routes.js'

import { LoginPage } from '../features/auth/login/index.js'
import { SignupPage } from '../features/auth/signup/index.js'
import { VerifyEmailPage } from '../features/auth/verify-email/index.js'
import { SetPasswordPage } from '../features/auth/set-password/index.js'
import { SignupSuccessPage } from '../features/auth/signup-success/index.js'
import { ForgotPasswordPage } from '../features/auth/forgot-password/index.js'
import { ComingSoonPage } from '../features/coming-soon/index.js'

const stripLeadingSlash = (p: string) => p.replace(/^\//, '')

export function authRoutes() {
  return (
    <Route element={<AuthLayout />}>
      {/* Accessible whether signed in or not — shown right after account creation */}
      <Route path={stripLeadingSlash(ROUTES.AUTH.SIGNUP_SUCCESS)} element={<SignupSuccessPage />} />
      <Route element={<GuestRoute />}>
        <Route path={stripLeadingSlash(ROUTES.AUTH.LOGIN)} element={<LoginPage />} />
        <Route path={stripLeadingSlash(ROUTES.AUTH.SIGNUP)} element={<SignupPage />} />
        <Route path={stripLeadingSlash(ROUTES.AUTH.VERIFY_EMAIL)} element={<VerifyEmailPage />} />
        <Route path={stripLeadingSlash(ROUTES.AUTH.SET_PASSWORD)} element={<SetPasswordPage />} />
        <Route path={stripLeadingSlash(ROUTES.AUTH.FORGOT_PASSWORD)} element={<ForgotPasswordPage />} />
        <Route path={stripLeadingSlash(ROUTES.AUTH.ACCOUNT_VERIFY)} element={<ComingSoonPage />} />
        <Route path={stripLeadingSlash(ROUTES.AUTH.ACCOUNT_ACTIVATE)} element={<ComingSoonPage />} />
      </Route>
    </Route>
  )
}
