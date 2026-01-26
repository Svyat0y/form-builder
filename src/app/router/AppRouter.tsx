import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/widgets/protected-route'
import { UserForm } from '@/pages/user-form'
import { FormBuilder } from '@/pages/form-builder'
import { WelcomePage } from '@/pages/welcome-page'
import { Signup } from '@/pages/auth/Signup'
import { Signin } from '@/pages/auth/SignIn'
import { ROUTES } from '@/shared/config/routes'
import App from '../App'
import { RootLoader } from '../RootLoader'

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
          <Route
            index
            element={
              <ProtectedRoute requireAuth={true} nested={true}>
                <WelcomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.formBuilder}
            element={
              <ProtectedRoute requireAuth={true} nested={true}>
                <FormBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.userForm}
            element={
              <ProtectedRoute requireAuth={true} nested={true}>
                <UserForm />
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

        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </RootLoader>
  )
}
