import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'
import { useAuth } from '@/shared/lib/hooks'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  nested?: boolean
  // If set, only users whose role is in this list may access the route;
  // everyone else is redirected home (e.g. Admin Panel: ADMIN/SUPER_ADMIN only)
  allowedRoles?: string[]
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { token, user } = useAuth()
  const location = useLocation()

  if (requireAuth && !token) {
    return <Navigate to={ROUTES.signIn} state={{ from: location }} replace />
  }

  if (!requireAuth && token) {
    return <Navigate to={ROUTES.home} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role ?? '')) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <>{children}</>
}
