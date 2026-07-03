import { FC } from 'react'
import styles from './FieldRenderer.module.scss'
import { FormField } from '../../model/types'

interface FieldRendererProps {
  field: FormField
  // Read-only preview (editor canvas, editor Preview modal) vs a real,
  // fillable public form — the latter lands with phase 5's PublicForm page.
  disabled?: boolean
}

// Renders a single FormField as an end-user would see it. Shared between the
// editor's Preview modal today and the public form page later (phase 5) —
// see docs/forms-realtime-architecture.md §14.
export const FieldRenderer: FC<FieldRendererProps> = ({
  field,
  disabled = true,
}) => {
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          className={styles.textarea}
          placeholder={field.placeholder}
          disabled={disabled}
        />
      )

    case 'radio':
      return (
        <div className={styles.optionList}>
          {(field.options || []).map((option) => (
            <label key={option} className={styles.optionRow}>
              <input type="radio" name={field.id} disabled={disabled} />
              {option}
            </label>
          ))}
        </div>
      )

    case 'checkbox':
      return (
        <div className={styles.optionList}>
          {(field.options || []).map((option) => (
            <label key={option} className={styles.optionRow}>
              <input type="checkbox" disabled={disabled} />
              {option}
            </label>
          ))}
        </div>
      )

    case 'select':
      return (
        <select className={styles.select} disabled={disabled} defaultValue="">
          <option value="" disabled>
            Select an option
          </option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )

    case 'rating': {
      const max = field.max ?? 5
      return (
        <div className={styles.ratingRow}>
          {Array.from({ length: max }, (_, i) => (
            <span key={i} className={styles.star}>
              ☆
            </span>
          ))}
        </div>
      )
    }

    case 'scale': {
      const min = field.min ?? 1
      const max = field.max ?? 10
      const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i)
      return (
        <div className={styles.scaleWrap}>
          {(field.minLabel || field.maxLabel) && (
            // A single explainer line instead of labels pinned to the first/
            // last button — with enough steps the row wraps onto multiple
            // lines and end-anchored labels drift away from the buttons
            // they're meant to describe (see docs/pages/form-editor.md).
            <div className={styles.scaleHint}>
              {field.minLabel && (
                <span>
                  {min} = {field.minLabel}
                </span>
              )}
              {field.minLabel && field.maxLabel && <span> · </span>}
              {field.maxLabel && (
                <span>
                  {max} = {field.maxLabel}
                </span>
              )}
            </div>
          )}
          <div className={styles.scaleRow}>
            {steps.map((step) => (
              <button
                key={step}
                type="button"
                className={styles.scaleStep}
                disabled={disabled}
              >
                {step}
              </button>
            ))}
          </div>
        </div>
      )
    }

    case 'date':
      return (
        <input
          className={styles.input}
          type="date"
          min={field.minDate}
          max={field.maxDate}
          disabled={disabled}
        />
      )

    case 'file':
      return <div className={styles.fileStub}>File upload — coming soon</div>

    case 'text':
    default:
      return (
        <input
          className={styles.input}
          type="text"
          placeholder={field.placeholder}
          disabled={disabled}
        />
      )
  }
}
