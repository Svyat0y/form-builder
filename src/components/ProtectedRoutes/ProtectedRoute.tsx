import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../../routes/routes'
import { useAuth } from '@store/hooks/useAuth'
import { ReactNode } from 'react'
import { Ring } from 'react-spinners-css'
import { LOADING_STYLE, SPINNER_COLOR } from '@constants/constants'

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
  const { token, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading && !nested) {
    return (
      <div style={LOADING_STYLE}>
        <Ring color={SPINNER_COLOR} />
      </div>
    )
  }

  if (requireAuth && !token) {
    if (nested) {
      return <Navigate to={ROUTES.signIn} state={{ from: location }} replace />
    }
    return <Navigate to={ROUTES.signIn} state={{ from: location }} replace />
  }

  if (!requireAuth && token) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <>{children}</>
}
