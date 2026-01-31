import { FC, useState } from 'react'
import styles from './WelcomePage.module.scss'
import { formatTimeAgo } from '@/shared/lib/utils/dateHelpers'
import { formatDeviceName } from '@/shared/lib/utils/deviceHelpers'
import { adminApi, authApi } from '@/features/auth/model'
import { Session, User } from '@/features/auth/model/types'
import { useAppDispatch } from '@/shared/lib/hooks'
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector'
import { logout } from '@/features/auth/model'
import { ROUTES } from '@/shared/config/routes'

interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

export const WelcomePage: FC = () => {
  const [data, setData] = useState<UserProfile | null>(null)
  const [sessions, setSessions] = useState<Session[] | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [usersLoading, setUsersLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [deleteLoading, setLoadingDelete] = useState(false)
  const [roleLoading, setRoleLoading] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({})
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
    } catch {
      setSessions(null)
    } finally {
      setLoading(false)
    }
  }

  const getAllUsers = async () => {
    setUsersLoading(true)
    try {
      const response = await adminApi.getUsers()
      setUsers(response.data)
    } catch {
      // Error handled, users list not updated
    } finally {
      setUsersLoading(false)
    }
  }

  const onDeleteUser = async (targetUserId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    setLoadingDelete(true)
    try {
      await adminApi.deleteUser(targetUserId)
      alert('User deleted successfully')
      await getAllUsers()
    } catch {
      alert('Failed to delete user')
    } finally {
      setLoadingDelete(false)
    }
  }

  const onUpdateUserRole = async (targetUserId: string) => {
    const newRole = selectedRoles[targetUserId]
    if (!newRole) {
      alert('Please select a role')
      return
    }

    setRoleLoading(true)
    try {
      await adminApi.updateUserRole(targetUserId, newRole)
      await getAllUsers()
      setSelectedRoles({})
    } catch {
      alert('Failed to update user role')
    } finally {
      setRoleLoading(false)
    }
  }

  const onLogout = async () => {
    setLogoutLoading(true)
    try {
      await dispatch(logout())
      window.location.href = ROUTES.signIn
    } catch {
      window.location.href = ROUTES.signIn
    }
  }

  const currentUser = useAppSelector((state) => state.auth.user)
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'
  const isAdmin = currentUser?.role === 'ADMIN'

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

      <button
        onClick={getAllUsers}
        className={styles.button}
        disabled={usersLoading}
      >
        {usersLoading ? 'loading...' : 'Get Users'}
      </button>
      {users && users.length > 0 && (
        <div className={styles.sessionsList}>
          <h3 className={styles.sessionsTitle}>
            Active users ({users.length})
          </h3>
          {users.map((user) => (
            <div key={user.id} className={styles.sessionItem}>
              <div className={styles.sessionDevice}>
                <div>{user.name}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{user.id}</div>
                <div style={{ marginTop: '5px' }}>
                  Role: <strong>{user.role}</strong>
                </div>

                {isSuperAdmin && user.role !== 'SUPER_ADMIN' && (
                  <div
                    style={{
                      marginTop: '10px',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                    }}
                  >
                    <select
                      value={selectedRoles[user.id] || ''}
                      onChange={(e) =>
                        setSelectedRoles({
                          ...selectedRoles,
                          [user.id]: e.target.value,
                        })
                      }
                      style={{
                        padding: '8px',
                        background: 'transparent',
                        border: '1px solid white',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      <option value="" style={{ color: '#000' }}>
                        Select role
                      </option>
                      <option value="USER" style={{ color: '#000' }}>
                        USER
                      </option>
                      <option value="ADMIN" style={{ color: '#000' }}>
                        ADMIN
                      </option>
                    </select>
                    <button
                      onClick={() => onUpdateUserRole(user.id)}
                      disabled={roleLoading || !selectedRoles[user.id]}
                      style={{
                        padding: '8px 16px',
                        background: selectedRoles[user.id] ? '#4CAF50' : '#999',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: selectedRoles[user.id]
                          ? 'pointer'
                          : 'not-allowed',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {roleLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                )}
                {(isAdmin || isSuperAdmin) &&
                  user.id !== currentUser?.id &&
                  user?.role !== 'SUPER_ADMIN' && (
                    <div style={{ marginTop: '8px' }}>
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        disabled={deleteLoading}
                        style={{
                          padding: '8px 12px',
                          background: '#E53935',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
