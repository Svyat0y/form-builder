import { FC } from 'react'
import styles from './Sidebar.module.scss'
import { FormField } from '@/features/forms/model'
import { CHOICE_FIELD_TYPES } from '@/features/form-builder/model'
import { OptionsEditor } from './OptionsEditor'

interface FieldSettingsProps {
  field: FormField | null
  onChange: (patch: Partial<FormField>) => void
}

const OPTION_TYPES: FormField['type'][] = ['radio', 'checkbox', 'select']

export const FieldSettings: FC<FieldSettingsProps> = ({ field, onChange }) => {
  if (!field) {
    return (
      <div className={styles.settingsEmpty}>
        Select a field on the canvas to edit its settings.
      </div>
    )
  }

  const showPlaceholder = field.type === 'text' || field.type === 'textarea'
  const showOptions = OPTION_TYPES.includes(field.type)
  const showTrackStats = CHOICE_FIELD_TYPES.includes(field.type)

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

      {showPlaceholder && (
        <div className={styles.row}>
          <div className={styles.rowLabel}>Placeholder</div>
          <input
            className={styles.input}
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => onChange({ placeholder: e.target.value })}
          />
        </div>
      )}

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

      {showTrackStats && (
        <div className={styles.toggleRow}>
          <span>Show in analytics</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={field.trackStats ?? false}
              onChange={(e) => onChange({ trackStats: e.target.checked })}
            />
            <span className={styles.switchTrack} />
          </label>
        </div>
      )}

      {showOptions && (
        <OptionsEditor
          options={field.options || []}
          onChange={(options) => onChange({ options })}
        />
      )}

      {field.type === 'rating' && (
        <>
          <div className={styles.row}>
            <div className={styles.rowLabel}>Min</div>
            <input
              className={styles.input}
              type="number"
              value={field.min ?? 1}
              onChange={(e) => onChange({ min: Number(e.target.value) })}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>Max</div>
            <input
              className={styles.input}
              type="number"
              value={field.max ?? 5}
              onChange={(e) => onChange({ max: Number(e.target.value) })}
            />
          </div>
        </>
      )}

      {field.type === 'scale' && (
        <>
          <div className={styles.row}>
            <div className={styles.rowLabel}>Min</div>
            <input
              className={styles.input}
              type="number"
              value={field.min ?? 1}
              onChange={(e) => onChange({ min: Number(e.target.value) })}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>Max</div>
            <input
              className={styles.input}
              type="number"
              value={field.max ?? 10}
              onChange={(e) => onChange({ max: Number(e.target.value) })}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>Min label</div>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Not likely"
              value={field.minLabel || ''}
              onChange={(e) => onChange({ minLabel: e.target.value })}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>Max label</div>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Very likely"
              value={field.maxLabel || ''}
              onChange={(e) => onChange({ maxLabel: e.target.value })}
            />
          </div>
        </>
      )}

      {field.type === 'date' && (
        <>
          <div className={styles.row}>
            <div className={styles.rowLabel}>Min date</div>
            <input
              className={styles.input}
              type="date"
              value={field.minDate || ''}
              onChange={(e) => onChange({ minDate: e.target.value })}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>Max date</div>
            <input
              className={styles.input}
              type="date"
              value={field.maxDate || ''}
              onChange={(e) => onChange({ maxDate: e.target.value })}
            />
          </div>
        </>
      )}
    </div>
  )
}
