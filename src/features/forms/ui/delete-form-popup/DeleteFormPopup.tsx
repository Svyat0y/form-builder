import { FC } from 'react'
import styles from './DeleteFormPopup.module.scss'

interface DeleteFormPopupProps {
  formTitle: string
  onConfirm: () => void
  onClose?: () => void
}

export const DeleteFormPopup: FC<DeleteFormPopupProps> = ({
  formTitle,
  onConfirm,
  onClose,
}) => {
  return (
    <div className={styles.popup}>
      <h2 className={styles.title}>Delete &quot;{formTitle}&quot;?</h2>
      <p className={styles.text}>
        This permanently deletes the form and all of its responses. This action
        cannot be undone.
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
          Delete form
        </button>
      </div>
    </div>
  )
}
