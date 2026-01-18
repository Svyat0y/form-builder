import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../../routes/routes'
import { useAuth } from '@store/hooks/useAuth'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  nested?: boolean
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  nested = false,
}: ProtectedRouteProps) => {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

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
