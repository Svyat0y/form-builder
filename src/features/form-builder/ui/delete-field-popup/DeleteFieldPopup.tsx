import { FC } from 'react'
import styles from './DeleteFieldPopup.module.scss'

interface DeleteFieldPopupProps {
  fieldLabel: string
  onConfirm: () => void
  onClose?: () => void
}

export const DeleteFieldPopup: FC<DeleteFieldPopupProps> = ({
  fieldLabel,
  onConfirm,
  onClose,
}) => {
  return (
    <div className={styles.popup}>
      <h2 className={styles.title}>Delete &quot;{fieldLabel}&quot;?</h2>
      <p className={styles.text}>
        This removes the question from the form. Any existing responses for it
        are kept, but it will no longer accept new answers. This action cannot
        be undone.
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
          Delete question
        </button>
      </div>
    </div>
  )
}
