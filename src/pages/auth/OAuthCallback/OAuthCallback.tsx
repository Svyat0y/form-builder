import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setCredentials } from '@/features/auth/model'
import { useAppDispatch } from '@/shared/lib/hooks'
import { ROUTES } from '@/shared/config/routes'
import { Ring } from 'react-spinners-css'
import { LOADING_STYLE, SPINNER_COLOR } from '@/shared/config/constants'

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const token = searchParams.get('token')
      const userJson = searchParams.get('user')

      if (!token || !userJson) {
        setError('Missing authentication data')
        setTimeout(() => navigate(ROUTES.signIn), 2000)
        return
      }

      // useSearchParams().get() already URL-decodes the value — do not
      // decodeURIComponent it again, that double-decodes the JSON string.
      const user = JSON.parse(userJson)

      // Dispatch, not authStorage directly: RootLoader's checkAuth() only
      // runs once on the initial full page load (which just happened, before
      // this token existed), so writing to localStorage alone leaves Redux's
      // token stuck at null and ProtectedRoute bounces to /signin until the
      // next hard refresh. setCredentials updates both in one step.
      dispatch(setCredentials({ token, user }))

      setTimeout(() => navigate(ROUTES.dashboard), 500)
    } catch {
      setError('Authentication failed. Please try again.')
      setTimeout(() => navigate(ROUTES.signIn), 2000)
    }
  }, [searchParams, navigate, dispatch])

  if (error) {
    return (
      <div style={LOADING_STYLE}>
        <div style={{ textAlign: 'center', color: 'red' }}>
          <p>{error}</p>
          <p>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={LOADING_STYLE}>
      <Ring color={SPINNER_COLOR} size={50} />
    </div>
  )
}
