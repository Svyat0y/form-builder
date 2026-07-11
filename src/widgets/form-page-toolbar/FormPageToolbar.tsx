import { FC } from 'react'
import styles from './FormPageToolbar.module.scss'
import { BackButton } from '@/shared/ui/backButton'

export type FormPageTab = 'edit' | 'responses'

interface FormPageToolbarProps {
  active: FormPageTab
  onBack: () => void
  onNavigate: (tab: FormPageTab) => void
}

// Shared between /forms/:id/edit and /forms/:id/responses — the
// Edit/Responses tab switch each page needs, see docs/pages/form-editor.md
export const FormPageToolbar: FC<FormPageToolbarProps> = ({
  active,
  onBack,
  onNavigate,
}) => {
  return (
    <div className={styles.wrapper}>
      <BackButton labelBtn="Back to dashboard" onBack={onBack} />

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${active === 'edit' ? styles.tabActive : ''}`}
          onClick={() => onNavigate('edit')}
        >
          Edit
        </button>
        <button
          className={`${styles.tab} ${active === 'responses' ? styles.tabActive : ''}`}
          onClick={() => onNavigate('responses')}
        >
          Responses
        </button>
      </div>

      <div className={styles.spacer} />
    </div>
  )
}
