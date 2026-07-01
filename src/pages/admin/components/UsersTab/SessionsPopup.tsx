import { FC, useEffect, useState } from 'react'
import styles from './SessionsPopup.module.scss'
import { adminApi } from '@/features/auth/model'
import { handleApiError } from '@/features/auth/lib'
import { mapAdminSession } from '../../lib/mapAdminSession'
import { AdminSessionItem } from '../../types'
import { LaptopIcon, MobileIcon } from '../icons'

interface SessionsPopupProps {
  userId: string
  userName: string
  onClose?: () => void
}

export const SessionsPopup: FC<SessionsPopupProps> = ({
  userId,
  userName,
  onClose,
}) => {
  const [sessions, setSessions] = useState<AdminSessionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [isRevokingAll, setIsRevokingAll] = useState(false)

  useEffect(() => {
    let cancelled = false

    adminApi
      .getUserSessions(userId)
      .then((response) => {
        if (cancelled) return
        setSessions(response.data.map(mapAdminSession))
      })
      .catch((error) => handleApiError(error, 'Failed to load sessions'))
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  const handleRevoke = async (sessionId: string) => {
    setRevokingId(sessionId)
    try {
      await adminApi.revokeUserSession(userId, sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    } catch (error) {
      await handleApiError(error, 'Failed to revoke session')
    } finally {
      setRevokingId(null)
    }
  }

  const handleRevokeAll = async () => {
    setIsRevokingAll(true)
    try {
      await adminApi.revokeAllUserSessions(userId)
      setSessions([])
    } catch (error) {
      await handleApiError(error, 'Failed to revoke sessions')
    } finally {
      setIsRevokingAll(false)
    }
  }

  return (
    <div className={styles.popup}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Sessions</h2>
          <p className={styles.subtitle}>{userName}</p>
        </div>
        {sessions.length > 0 && (
          <button
            type="button"
            className={styles.revokeAllBtn}
            disabled={isRevokingAll}
            onClick={handleRevokeAll}
          >
            {isRevokingAll ? 'Revoking…' : 'Revoke all'}
          </button>
        )}
      </div>

      {isLoading ? (
        <p className={styles.empty}>Loading sessions…</p>
      ) : sessions.length === 0 ? (
        <p className={styles.empty}>No active sessions.</p>
      ) : (
        <ul className={styles.sessionList}>
          {sessions.map((session) => (
            <li key={session.id} className={styles.session}>
              <span className={styles.sessionIcon}>
                {session.type === 'mobile' ? <MobileIcon /> : <LaptopIcon />}
              </span>
              <div className={styles.sessionInfo}>
                <p className={styles.sessionDevice}>
                  {session.device} · {session.os}
                </p>
                <p className={styles.sessionMeta}>{session.lastActive}</p>
              </div>
              <button
                type="button"
                className={styles.revokeBtn}
                disabled={revokingId === session.id}
                onClick={() => handleRevoke(session.id)}
              >
                {revokingId === session.id ? 'Revoking…' : 'Revoke'}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className={styles.closeBtn} onClick={onClose}>
        Close
      </button>
    </div>
  )
}
