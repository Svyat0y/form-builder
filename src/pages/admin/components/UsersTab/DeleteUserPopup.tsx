import { FC } from 'react'
import styles from './DeleteUserPopup.module.scss'

interface DeleteUserPopupProps {
  userName: string
  onConfirm: () => void
  onClose?: () => void
}

export const DeleteUserPopup: FC<DeleteUserPopupProps> = ({
  userName,
  onConfirm,
  onClose,
}) => {
  return (
    <div className={styles.popup}>
      <h2 className={styles.title}>Delete {userName}?</h2>
      <p className={styles.text}>
        This permanently deletes the user&apos;s account, all their forms and
        responses. This action cannot be undone.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => {
            onConfirm()
            onClose?.()
          }}
        >
          Delete user
        </button>
      </div>
    </div>
  )
}
