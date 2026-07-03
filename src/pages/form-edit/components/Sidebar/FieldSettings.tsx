import { FC } from 'react'
import styles from './Sidebar.module.scss'
import { FormField } from '@/features/forms/model'

interface FieldSettingsProps {
  field: FormField | null
  onChange: (patch: Partial<FormField>) => void
}

export const FieldSettings: FC<FieldSettingsProps> = ({ field, onChange }) => {
  if (!field) {
    return (
      <div className={styles.settingsEmpty}>
        Select a field on the canvas to edit its settings.
      </div>
    )
  }

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.rowLabel}>Label</div>
        <input
          className={styles.input}
          type="text"
          value={field.label}
          onChange={(e) => onChange({ label: e.target.value })}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.rowLabel}>Placeholder</div>
        <input
          className={styles.input}
          type="text"
          value={field.placeholder || ''}
          onChange={(e) => onChange({ placeholder: e.target.value })}
        />
      </div>

      <div className={styles.toggleRow}>
        <span>Required</span>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onChange({ required: e.target.checked })}
          />
          <span className={styles.switchTrack} />
        </label>
      </div>
    </div>
  )
}
