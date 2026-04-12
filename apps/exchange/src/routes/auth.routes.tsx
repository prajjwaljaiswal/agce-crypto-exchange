import { Route } from 'react-router-dom'
import { AuthLayout } from '../layouts/index.js'
import { GuestRoute } from '../features/auth/guards.js'
import { ROUTES } from '../constants/routes.js'

import { LoginPage } from '../features/auth/login/index.js'
import { SignupPage } from '../features/auth/signup/index.js'
import { ForgotPasswordPage } from '../features/auth/forgot-password/index.js'
import { ComingSoonPage } from '../features/coming-soon/index.js'

const stripLeadingSlash = (p: string) => p.replace(/^\//, '')

export function authRoutes() {
  return (
    <Route element={<AuthLayout />}>
      <Route element={<GuestRoute />}>
        <Route path={stripLeadingSlash(ROUTES.AUTH.LOGIN)} element={<LoginPage />} />
        <Route path={stripLeadingSlash(ROUTES.AUTH.SIGNUP)} element={<SignupPage />} />
        <Route path={stripLeadingSlash(ROUTES.AUTH.FORGOT_PASSWORD)} element={<ForgotPasswordPage />} />
        <Route path={stripLeadingSlash(ROUTES.AUTH.ACCOUNT_VERIFY)} element={<ComingSoonPage />} />
        <Route path={stripLeadingSlash(ROUTES.AUTH.ACCOUNT_ACTIVATE)} element={<ComingSoonPage />} />
      </Route>
    </Route>
  )
}
