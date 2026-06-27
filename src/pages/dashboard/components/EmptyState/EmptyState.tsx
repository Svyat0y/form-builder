import { FC } from 'react'
import styles from './EmptyState.module.scss'
import { PlusIcon } from '../icons'

interface EmptyStateProps {
  onCreateForm: () => void
  createBtnClassName: string
}

export const EmptyState: FC<EmptyStateProps> = ({
  onCreateForm,
  createBtnClassName,
}) => (
  <div className={styles.wrap}>
    <div className={styles.illustration}>
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-color-secondary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
      </svg>
    </div>
    <h2 className={styles.title}>No forms yet</h2>
    <p className={styles.text}>
      Create your first form to start collecting responses from your audience.
    </p>
    <button className={createBtnClassName} onClick={onCreateForm}>
      <PlusIcon />
      Create your first form
    </button>
  </div>
)
