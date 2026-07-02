import { FC } from 'react'
import styles from './PreviewModal.module.scss'
import { FormField } from '@/features/forms/model'

interface PreviewModalProps {
  title: string
  description: string
  fields: FormField[]
  onClose: () => void
}

export const PreviewModal: FC<PreviewModalProps> = ({
  title,
  description,
  fields,
  onClose,
}) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.badge}>Preview — read only</span>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.formShell}>
            <div className={styles.formHeader}>
              <h2 className={styles.title}>{title || 'Untitled form'}</h2>
              {description && (
                <p className={styles.description}>{description}</p>
              )}
            </div>

            {fields.length === 0 ? (
              <p className={styles.empty}>No questions to preview yet.</p>
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
                {fields.map((field) => (
                  <div key={field.id} className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor={field.id}>
                      {field.label}
                      {field.required && (
                        <span className={styles.required}>*</span>
                      )}
                    </label>
                    <input
                      id={field.id}
                      className={styles.fieldInput}
                      placeholder={field.placeholder}
                      disabled
                    />
                  </div>
                ))}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
