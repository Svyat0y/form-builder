import { FC } from 'react'
import styles from '../UsersTab/UserActionsPopup.module.scss'
import { FeedbackStatus } from '@/features/feedback/model'
import { TrashIcon } from '../icons'

interface FeedbackActionsPopupProps {
  status: FeedbackStatus
  onSetStatus: (status: FeedbackStatus) => void
  onDelete: () => void
  onClose?: () => void
}

export const FeedbackActionsPopup: FC<FeedbackActionsPopupProps> = ({
  status,
  onSetStatus,
  onDelete,
  onClose,
}) => {
  return (
    <div className={styles.popup}>
      <h2 className={styles.title}>Actions</h2>

      <div className={styles.menu}>
        {status !== 'IN_PROGRESS' && (
          <button
            className={styles.menuItem}
            onClick={() => {
              onSetStatus('IN_PROGRESS')
              onClose?.()
            }}
          >
            Mark in progress
          </button>
        )}

        {status !== 'RESOLVED' && (
          <button
            className={styles.menuItem}
            onClick={() => {
              onSetStatus('RESOLVED')
              onClose?.()
            }}
          >
            Mark resolved
          </button>
        )}

        {status !== 'NEW' && (
          <button
            className={styles.menuItem}
            onClick={() => {
              onSetStatus('NEW')
              onClose?.()
            }}
          >
            Mark new
          </button>
        )}

        <div className={styles.menuDivider} />

        <button
          className={`${styles.menuItem} ${styles.menuItemDanger}`}
          onClick={() => {
            onDelete()
            onClose?.()
          }}
        >
          <TrashIcon /> Delete
        </button>
      </div>

      <button type="button" className={styles.cancelBtn} onClick={onClose}>
        Cancel
      </button>
    </div>
  )
}
