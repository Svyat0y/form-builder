import { FC, useState } from 'react'
import styles from './WelcomePage.module.scss'
//utils
import { formatTimeAgo } from '@utils/dateHelpers'
import { formatDeviceName } from '@utils/deviceHelpers'
//store
import { authApi } from '@store/features/auth/authApi'
import { Session } from '@store/features/auth/types'
import { useAppDispatch } from '@store/hooks/useAppDispatch'
import { logout } from '@store/features/auth/authSlice'
//routes
import { ROUTES } from '@routes/routes'

export const WelcomePage: FC = () => {
  const [data, setData] = useState(null)
  const [sessions, setSessions] = useState<Session[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const dispatch = useAppDispatch()

  const onHandleClick = async () => {
    const result = await authApi.getProfile()
    setData(result.data)
  }

  const onGetSessions = async () => {
    setLoading(true)
    try {
      const result = await authApi.getSessions()
      setSessions(result.data)
    } catch (error) {
      console.error('Failed to get sessions:', error)
      setSessions(null)
    } finally {
      setLoading(false)
    }
  }

  const onLogout = async () => {
    setLogoutLoading(true)
    try {
      await dispatch(logout())
      // Полная перезагрузка страницы для сброса всех состояний
      window.location.href = ROUTES.signIn
    } catch (error) {
      console.error('Logout error:', error)
      // Даже при ошибке делаем редирект
      window.location.href = ROUTES.signIn
    }
  }

  return (
    <div className={styles.wrapper}>
      <p>welcome page</p>
      <button onClick={onHandleClick} className={styles.button}>
        get user data
      </button>
      <p>{JSON.stringify(data)}</p>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={onLogout}
          className={styles.button}
          disabled={logoutLoading}
        >
          {logoutLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      <div className={styles.sessionsSection}>
        <button
          onClick={onGetSessions}
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Sessions'}
        </button>
        {sessions && sessions.length > 0 && (
          <div className={styles.sessionsList}>
            <h3 className={styles.sessionsTitle}>
              Active Sessions ({sessions.length})
            </h3>
            {sessions.map((session) => (
              <div key={session.id} className={styles.sessionItem}>
                <div className={styles.sessionDevice}>
                  {formatDeviceName(session.deviceInfo)}
                </div>
                <div className={styles.sessionTime}>
                  Last active: {formatTimeAgo(session.lastUsed)}
                </div>
              </div>
            ))}
          </div>
        )}
        {sessions && sessions.length === 0 && (
          <div className={styles.noSessions}>No active sessions found</div>
        )}
      </div>
    </div>
  )
}
