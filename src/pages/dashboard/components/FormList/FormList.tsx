import { FC } from 'react'
import styles from './FormList.module.scss'
import { FormItem, STATUS_LABELS } from '../../types'
import { EditIcon, EyeIcon, LinkIcon, TrashIcon } from '../icons'

interface FormListProps {
  forms: FormItem[]
  onEdit: (id: string) => void
  onResponses: (id: string) => void
  onCopy: (id: string) => void
  onDelete: (id: string) => void
}

export const FormList: FC<FormListProps> = ({
  forms,
  onEdit,
  onResponses,
  onCopy,
  onDelete,
}) => (
  <div className={styles.wrap}>
    <div className={styles.table}>
      <div className={styles.header}>
        <div>Form</div>
        <div>Status</div>
        <div>Responses</div>
        <div>Last updated</div>
        <div />
      </div>

      {forms.map((form) => (
        <div key={form.id} className={styles.row}>
          <div className={styles.title}>{form.title}</div>
          <div>
            <span
              className={`${styles.badge} ${styles[`badge_${form.status}`]}`}
            >
              {STATUS_LABELS[form.status]}
            </span>
          </div>
          <div className={styles.meta}>{form.responses} responses</div>
          <div className={styles.meta}>Updated {form.updated}</div>
          <div className={styles.actions}>
            <button
              className={styles.actionBtn}
              aria-label="Edit"
              title="Edit"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(form.id)
              }}
            >
              <EditIcon />
            </button>
            <button
              className={styles.actionBtn}
              aria-label="View responses"
              title="View responses"
              onClick={(e) => {
                e.stopPropagation()
                onResponses(form.id)
              }}
            >
              <EyeIcon />
            </button>
            <button
              className={styles.actionBtn}
              aria-label="Copy link"
              title="Copy link"
              onClick={(e) => {
                e.stopPropagation()
                onCopy(form.id)
              }}
            >
              <LinkIcon />
            </button>
            <button
              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
              aria-label="Delete"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(form.id)
              }}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)
