import { FC } from 'react'
import classNames from 'classnames'
import styles from './UserActionsPopup.module.scss'
import {
  ShieldIcon,
  UserMinusIcon,
  BellPlusIcon,
  FormsIcon,
  TrashIcon,
} from '../icons'

interface UserActionsPopupProps {
  userName: string
  targetRole: string
  canManageSessions: boolean
  canChangeRole: boolean
  canDelete: boolean
  isUpdatingRole: boolean
  onViewSessions: () => void
  onChangeRole: (newRole: 'USER' | 'ADMIN') => void
  onViewForms: () => void
  onDelete: () => void
  onClose?: () => void
}

export const UserActionsPopup: FC<UserActionsPopupProps> = ({
  userName,
  targetRole,
  canManageSessions,
  canChangeRole,
  canDelete,
  isUpdatingRole,
  onViewSessions,
  onChangeRole,
  onViewForms,
  onDelete,
  onClose,
}) => {
  return (
    <div className={styles.popup}>
      <h2 className={styles.title}>Actions</h2>
      <p className={styles.subtitle}>{userName}</p>

      <div className={styles.menu}>
        {canManageSessions && (
          <button className={styles.menuItem} onClick={onViewSessions}>
            <ShieldIcon /> View sessions
          </button>
        )}

        {canChangeRole &&
          (targetRole === 'USER' ? (
            <button
              className={styles.menuItem}
              disabled={isUpdatingRole}
              onClick={() => {
                onChangeRole('ADMIN')
                onClose?.()
              }}
            >
              <ShieldIcon /> Make admin
            </button>
          ) : (
            <button
              className={styles.menuItem}
              disabled={isUpdatingRole}
              onClick={() => {
                onChangeRole('USER')
                onClose?.()
              }}
            >
              <UserMinusIcon /> Make regular user
            </button>
          ))}

        <button
          className={styles.menuItem}
          onClick={() => {
            onViewForms()
            onClose?.()
          }}
        >
          <FormsIcon /> View forms
        </button>

        <button className={styles.menuItem} disabled>
          <BellPlusIcon /> Send notification
          <span className={styles.soonTag}>Soon</span>
        </button>

        {canDelete && (
          <>
            <div className={styles.menuDivider} />
            <button
              className={classNames(styles.menuItem, styles.menuItemDanger)}
              onClick={onDelete}
            >
              <TrashIcon /> Delete user
            </button>
          </>
        )}
      </div>

      <button type="button" className={styles.cancelBtn} onClick={onClose}>
        Cancel
      </button>
    </div>
  )
}
