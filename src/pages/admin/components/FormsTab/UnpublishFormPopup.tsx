import { FC } from 'react'
import styles from './UnpublishFormPopup.module.scss'

interface UnpublishFormPopupProps {
  formTitle: string
  onConfirm: () => void
  onClose?: () => void
}

// A misclick here takes someone else's form off its public link — worth a
// confirm even though, unlike delete, it can be undone with Publish.
export const UnpublishFormPopup: FC<UnpublishFormPopupProps> = ({
  formTitle,
  onConfirm,
  onClose,
}) => {
  return (
    <div className={styles.popup}>
      <h2 className={styles.title}>Unpublish &quot;{formTitle}&quot;?</h2>
      <p className={styles.text}>
        The form&apos;s public link will stop accepting new responses. You can
        publish it again later.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.confirmBtn}
          onClick={() => {
            onConfirm()
            onClose?.()
          }}
        >
          Unpublish
        </button>
      </div>
    </div>
  )
}
