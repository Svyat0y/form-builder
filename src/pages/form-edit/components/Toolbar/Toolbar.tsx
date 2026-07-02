import { FC } from 'react'
import styles from './Toolbar.module.scss'
import { ArrowLeftIcon } from '../icons'

interface ToolbarProps {
  onBack: () => void
}

export const Toolbar: FC<ToolbarProps> = ({ onBack }) => {
  return (
    <div className={styles.wrapper}>
      <button className={styles.backBtn} onClick={onBack}>
        <ArrowLeftIcon />
        Back to dashboard
      </button>

      <div className={styles.tabs}>
        <span className={`${styles.tab} ${styles.tabActive}`}>Edit</span>
        <span className={styles.tab} title="Coming soon">
          Responses
        </span>
      </div>

      <div className={styles.spacer} />
    </div>
  )
}
