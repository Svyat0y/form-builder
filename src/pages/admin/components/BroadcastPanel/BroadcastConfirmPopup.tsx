import { FC } from 'react'
import styles from '../UsersTab/DeleteUserPopup.module.scss'

interface BroadcastConfirmPopupProps {
  onConfirm: () => void
  onClose?: () => void
}

export const BroadcastConfirmPopup: FC<BroadcastConfirmPopupProps> = ({
  onConfirm,
  onClose,
}) => {
  return (
    <div className={styles.popup}>
      <h2 className={styles.title}>Send to every user?</h2>
      <p className={styles.text}>
        This message goes out to every account on the platform right away. This
        can&apos;t be undone.
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
          Send to everyone
        </button>
      </div>
    </div>
  )
}
