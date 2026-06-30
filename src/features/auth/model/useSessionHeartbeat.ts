import { useEffect } from 'react'
import { useAuth } from '@/shared/lib/hooks'
import { authApi } from './authApi'

const HEARTBEAT_INTERVAL = 30_000

// Periodically — and immediately whenever the tab regains focus — validate the
// session against the backend, so a session revoked from another device logs
// this client out promptly instead of only on the next user-triggered request.
//
// The axios interceptor performs the actual cleanup + redirect on a 401, so the
// request here is fire-and-forget; failures are intentionally swallowed.
export const useSessionHeartbeat = () => {
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return

    const validate = () => {
      authApi.getProfile().catch(() => {})
    }

    const interval = setInterval(validate, HEARTBEAT_INTERVAL)
    const onFocus = () => validate()
    window.addEventListener('focus', onFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [token])
}
