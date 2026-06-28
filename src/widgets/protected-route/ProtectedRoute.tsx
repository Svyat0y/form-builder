import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'
import { useAuth } from '@/shared/lib/hooks'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  nested?: boolean
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { token } = useAuth()
  const location = useLocation()

  if (requireAuth && !token) {
    return <Navigate to={ROUTES.signIn} state={{ from: location }} replace />
  }

  if (!requireAuth && token) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <>{children}</>
}
