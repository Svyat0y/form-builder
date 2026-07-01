import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import styles from './UsersTab.module.scss'
import { adminApi, User } from '@/features/auth/model'
import { handleApiError, showSuccessAlert } from '@/features/auth/lib'
import { useAuth } from '@/shared/lib/hooks'
import { showSwalComponent } from '@/shared/lib/utils/sweetAlert'
import { useDebouncedValue } from '../../lib/useDebouncedValue'
import { DeleteUserPopup } from './DeleteUserPopup'
import { SessionsPopup } from './SessionsPopup'
import { UserActionsPopup } from './UserActionsPopup'
import { SearchIcon, DotsIcon } from '../icons'

const PAGE_SIZE = 20

interface UsersTabProps {
  onViewForms: (user: User) => void
}

export const UsersTab: FC<UsersTabProps> = ({ onViewForms }) => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null)

  const debouncedSearch = useDebouncedValue(search, 300)

  useEffect(() => {
    adminApi
      .getUsers()
      .then((response) => setUsers(response.data))
      .catch((error) => handleApiError(error, 'Failed to load users'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  // Filtering/pagination happen client-side — GET /users has no query params yet.
  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()
    if (!query) return users
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query),
    )
  }, [users, debouncedSearch])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const canManageSessions = useCallback(
    (target: User) => isSuperAdmin || target.role === 'USER',
    [isSuperAdmin],
  )

  const canDelete = useCallback(
    (target: User) =>
      target.id !== currentUser?.id && (isSuperAdmin || target.role === 'USER'),
    [isSuperAdmin, currentUser?.id],
  )

  const canChangeRole = useCallback(
    (target: User) =>
      isSuperAdmin &&
      target.id !== currentUser?.id &&
      target.role !== 'SUPER_ADMIN',
    [isSuperAdmin, currentUser?.id],
  )

  const handleChangeRole = async (target: User, newRole: 'USER' | 'ADMIN') => {
    setUpdatingRoleId(target.id)
    try {
      await adminApi.updateUserRole(target.id, newRole)
      setUsers((prev) =>
        prev.map((u) => (u.id === target.id ? { ...u, role: newRole } : u)),
      )
      await showSuccessAlert(`${target.name} is now ${newRole.toLowerCase()}`)
    } catch (error) {
      await handleApiError(error, 'Failed to update role')
    } finally {
      setUpdatingRoleId(null)
    }
  }

  const handleDelete = (target: User) => {
    showSwalComponent(DeleteUserPopup, {
      userName: target.name,
      onConfirm: async () => {
        try {
          await adminApi.deleteUser(target.id)
          setUsers((prev) => prev.filter((u) => u.id !== target.id))
          await showSuccessAlert(`${target.name} has been deleted`)
        } catch (error) {
          await handleApiError(error, 'Failed to delete user')
        }
      },
    })
  }

  const handleViewSessions = (target: User) => {
    showSwalComponent(SessionsPopup, {
      userId: target.id,
      userName: target.name,
    })
  }

  const handleOpenActions = (target: User) => {
    showSwalComponent(UserActionsPopup, {
      userName: target.name,
      targetRole: target.role,
      canManageSessions: canManageSessions(target),
      canChangeRole: canChangeRole(target),
      canDelete: canDelete(target),
      isUpdatingRole: updatingRoleId === target.id,
      onViewSessions: () => handleViewSessions(target),
      onChangeRole: (newRole) => handleChangeRole(target, newRole),
      onViewForms: () => onViewForms(target),
      onDelete: () => handleDelete(target),
    })
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
          <input
            className={styles.searchInput}
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.wrap}>
        <div className={styles.table}>
          <div className={styles.header}>
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Registered</div>
            <div />
          </div>

          {isLoading ? (
            <div className={styles.empty}>Loading users…</div>
          ) : paginated.length === 0 ? (
            <div className={styles.empty}>No users found.</div>
          ) : (
            paginated.map((target) => (
              <div key={target.id} className={styles.row}>
                <div className={styles.name}>{target.name}</div>
                <div className={styles.email}>{target.email}</div>
                <div>
                  <span
                    className={classNames(
                      styles.badge,
                      styles[`badge_${target.role}`],
                    )}
                  >
                    {target.role}
                  </span>
                </div>
                <div className={styles.date}>
                  {new Date(target.createdAt).toLocaleDateString()}
                </div>
                <div className={styles.actionsCell}>
                  <button
                    className={styles.dotsBtn}
                    aria-label="User options"
                    onClick={() => handleOpenActions(target)}
                  >
                    <DotsIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={classNames(styles.pageBtn, {
                [styles.pageBtnActive]: n === page,
              })}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
