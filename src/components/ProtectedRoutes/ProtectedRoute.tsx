import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context'
import { ROUTES } from '../../routes/routes'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  nested?: boolean
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  nested = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (requireAuth && !isAuthenticated) {
    if (nested) {
      return <Navigate to={ROUTES.signIn} state={{ from: location }} replace />
    }
    return <Navigate to={ROUTES.signIn} state={{ from: location }} replace />
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <>{children}</>
}
