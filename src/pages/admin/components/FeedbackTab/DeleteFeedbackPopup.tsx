import { FC } from 'react'
import styles from '../UsersTab/DeleteUserPopup.module.scss'

interface DeleteFeedbackPopupProps {
  onConfirm: () => void
  onClose?: () => void
}

export const DeleteFeedbackPopup: FC<DeleteFeedbackPopupProps> = ({
  onConfirm,
  onClose,
}) => {
  return (
    <div className={styles.popup}>
      <h2 className={styles.title}>Delete this feedback?</h2>
      <p className={styles.text}>
        This permanently removes the message. This action cannot be undone.
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
          Delete
        </button>
      </div>
    </div>
  )
}
