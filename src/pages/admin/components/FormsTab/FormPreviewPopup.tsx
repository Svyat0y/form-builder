import { FC } from 'react'
import styles from './FormPreviewPopup.module.scss'
import { Form } from '@/features/forms/model'
import { FieldRenderer } from '@/features/forms/ui/field-renderer'

interface FormPreviewPopupProps {
  form: Form
  onClose?: () => void
}

// Read-only admin preview — reuses the same FieldRenderer as the editor's
// Preview modal and the public form page, just laid out inside a popup
// instead of a dedicated full-screen overlay.
export const FormPreviewPopup: FC<FormPreviewPopupProps> = ({ form }) => {
  return (
    <div className={styles.popup}>
      <div className={styles.formHeader}>
        <h2 className={styles.title}>{form.title || 'Untitled form'}</h2>
        {form.description && (
          <p className={styles.description}>{form.description}</p>
        )}
      </div>

      {form.fields.length === 0 ? (
        <p className={styles.empty}>This form has no questions.</p>
      ) : (
        <div>
          {form.fields.map((field) => (
            <div key={field.id} className={styles.field}>
              <div className={styles.fieldLabel}>
                {field.label}
                {field.required && <span className={styles.required}>*</span>}
              </div>
              <FieldRenderer field={field} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
