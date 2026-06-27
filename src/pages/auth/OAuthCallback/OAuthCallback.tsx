import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authStorage } from '@/features/auth/model'
import { ROUTES } from '@/shared/config/routes'
import { Ring } from 'react-spinners-css'
import { LOADING_STYLE, SPINNER_COLOR } from '@/shared/config/constants'

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
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

      const user = JSON.parse(decodeURIComponent(userJson))

      authStorage.setToken(token)
      authStorage.setUser(user)

      setTimeout(() => navigate(ROUTES.dashboard), 500)
    } catch {
      setError('Authentication failed. Please try again.')
      setTimeout(() => navigate(ROUTES.signIn), 2000)
    }
  }, [searchParams, navigate])

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
