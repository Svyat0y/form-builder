import { FC } from 'react'
import styles from './FormPageToolbar.module.scss'
import { ArrowLeftIcon } from './icons'

export type FormPageTab = 'edit' | 'responses'

interface FormPageToolbarProps {
  active: FormPageTab
  onBack: () => void
  onNavigate: (tab: FormPageTab) => void
}

// Shared between /forms/:id/edit and /forms/:id/responses — the
// Edit/Responses tab switch each page needs, see docs/pages/form-editor.md
// ("Между страницами — переключатель/табы в шапке страницы").
export const FormPageToolbar: FC<FormPageToolbarProps> = ({
  active,
  onBack,
  onNavigate,
}) => {
  return (
    <div className={styles.wrapper}>
      <button className={styles.backBtn} onClick={onBack}>
        <ArrowLeftIcon />
        <span>Back to dashboard</span>
      </button>

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
