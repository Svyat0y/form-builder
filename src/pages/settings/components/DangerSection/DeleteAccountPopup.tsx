import { FC } from 'react'
import styles from './DeleteAccountPopup.module.scss'

interface DeleteAccountPopupProps {
  onConfirm: () => void
  onClose?: () => void
}

export const DeleteAccountPopup: FC<DeleteAccountPopupProps> = ({
  onConfirm,
  onClose,
}) => {
  return (
    <div className={styles.popup}>
      <h2 className={styles.title}>Delete account?</h2>
      <p className={styles.text}>
        This permanently deletes your account, all your forms and their
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
          Delete account
        </button>
      </div>
    </div>
  )
}
