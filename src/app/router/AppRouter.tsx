import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/widgets/protected-route'
import { FormBuilder } from '@/pages/form-builder'
import { Dashboard } from '@/pages/dashboard'
import { Settings } from '@/pages/settings'
import { Signup } from '@/pages/auth/Signup'
import { Signin } from '@/pages/auth/SignIn'
import { ROUTES } from '@/shared/config/routes'
import App from '../App'
import { RootLoader } from '../RootLoader'
import { OAuthCallback } from '@/pages/auth/OAuthCallback/OAuthCallback'
import { PasswordRecovery } from '@/pages/password-recovery'

export const AppRouter = () => {
  return (
    <RootLoader>
      <Routes>
        <Route
          path={ROUTES.home}
          element={
            <ProtectedRoute requireAuth={true}>
              <App />
            </ProtectedRoute>
          }
        >
          {/* Dashboard — main page after login */}
          <Route
            index
            element={
              <ProtectedRoute requireAuth={true} nested={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Form builder — create and edit forms */}
          <Route
            path={ROUTES.formBuilder}
            element={
              <ProtectedRoute requireAuth={true} nested={true}>
                <FormBuilder />
              </ProtectedRoute>
            }
          />

          {/* Settings — profile, security, notifications, account */}
          <Route
            path={ROUTES.settings}
            element={
              <ProtectedRoute requireAuth={true} nested={true}>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path={ROUTES.signUp}
          element={
            <ProtectedRoute requireAuth={false}>
              <Signup />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.signIn}
          element={
            <ProtectedRoute requireAuth={false}>
              <Signin />
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.resetPassword} element={<PasswordRecovery />} />

        <Route path="/auth/callback" element={<OAuthCallback />} />

        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </RootLoader>
  )
}
