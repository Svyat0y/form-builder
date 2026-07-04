import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/widgets/protected-route'
import { FormEditPage } from '@/pages/form-edit'
import { FormResponsesPage } from '@/pages/form-responses'
import { Dashboard } from '@/pages/dashboard'
import { Settings } from '@/pages/settings'
import { Feedback } from '@/pages/feedback'
import { AdminPanel } from '@/pages/admin'
import { Signup } from '@/pages/auth/Signup'
import { Signin } from '@/pages/auth/SignIn'
import { ROUTES } from '@/shared/config/routes'
import App from '../App'
import { RootLoader } from '../RootLoader'
import { OAuthCallback } from '@/pages/auth/OAuthCallback/OAuthCallback'
import { PasswordRecovery } from '@/pages/password-recovery'
import { PublicForm, FormSuccess, FormClosed } from '@/pages/public-form'

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

          {/* Form editor — build/edit a single form's fields */}
          <Route
            path={ROUTES.formEdit}
            element={
              <ProtectedRoute requireAuth={true} nested={true}>
                <FormEditPage />
              </ProtectedRoute>
            }
          />

          {/* Form responses — answers + analytics for a single form */}
          <Route
            path={ROUTES.formResponses}
            element={
              <ProtectedRoute requireAuth={true} nested={true}>
                <FormResponsesPage />
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

          {/* Feedback — any authenticated user can submit a message */}
          <Route
            path={ROUTES.feedback}
            element={
              <ProtectedRoute requireAuth={true} nested={true}>
                <Feedback />
              </ProtectedRoute>
            }
          />

          {/* Admin Panel — user & forms management, ADMIN/SUPER_ADMIN only */}
          <Route
            path={ROUTES.admin}
            element={
              <ProtectedRoute
                requireAuth={true}
                nested={true}
                allowedRoles={['ADMIN', 'SUPER_ADMIN']}
              >
                <AdminPanel />
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

        {/* Public form — anonymous, no auth, no app shell */}
        <Route path={ROUTES.publicForm} element={<PublicForm />} />
        <Route path={ROUTES.publicFormSuccess} element={<FormSuccess />} />
        <Route path={ROUTES.publicFormClosed} element={<FormClosed />} />

        <Route path="/auth/callback" element={<OAuthCallback />} />

        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </RootLoader>
  )
}
