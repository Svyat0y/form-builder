import { FC } from 'react'
import styles from './AnswerModal.module.scss'
import { Button } from '@/shared/ui/button'

interface AnswerModalProps {
  label: string
  answer: string
  onClose?: () => void
}

// Full, untruncated view of one textarea answer — opened from a table cell
// that would otherwise ellipsis-clip a long response. See responses page
// review notes (point 2 / 3rd round).
export const AnswerModal: FC<AnswerModalProps> = ({
  label,
  answer,
  onClose,
}) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{label}</h2>
      <p className={styles.answer}>{answer}</p>
      <div className={styles.actions}>
        <Button variant="primary" type="button" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}
