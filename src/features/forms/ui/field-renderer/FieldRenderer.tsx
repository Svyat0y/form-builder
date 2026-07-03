import { FC } from 'react'
import classNames from 'classnames'
import styles from './FieldRenderer.module.scss'
import { FormField } from '../../model/types'

export type FieldValue = string | string[] | number | undefined

interface FieldRendererProps {
  field: FormField
  // Read-only preview (editor canvas, editor Preview modal) vs a real,
  // fillable public form (PublicForm page, phase 5).
  disabled?: boolean
  value?: FieldValue
  onChange?: (value: FieldValue) => void
}

// Renders a single FormField as an end-user would see it. Shared between the
// editor's Preview modal and the public form page — see
// docs/forms-realtime-architecture.md §14.
export const FieldRenderer: FC<FieldRendererProps> = ({
  field,
  disabled = true,
  value,
  onChange,
}) => {
  const interactiveClass = !disabled && styles.interactive

  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          className={classNames(styles.textarea, interactiveClass)}
          placeholder={field.placeholder}
          disabled={disabled}
          value={(value as string) ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )

    case 'radio':
      return (
        <div className={styles.optionList}>
          {(field.options || []).map((option) => (
            <label
              key={option}
              className={classNames(styles.optionRow, interactiveClass)}
            >
              <input
                type="radio"
                name={field.id}
                disabled={disabled}
                checked={value === option}
                onChange={() => onChange?.(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )

    case 'checkbox': {
      const selected = Array.isArray(value) ? value : []
      return (
        <div className={styles.optionList}>
          {(field.options || []).map((option) => (
            <label
              key={option}
              className={classNames(styles.optionRow, interactiveClass)}
            >
              <input
                type="checkbox"
                disabled={disabled}
                checked={selected.includes(option)}
                onChange={() => {
                  if (!onChange) return
                  onChange(
                    selected.includes(option)
                      ? selected.filter((o) => o !== option)
                      : [...selected, option],
                  )
                }}
              />
              {option}
            </label>
          ))}
        </div>
      )
    }

    case 'select':
      return (
        <select
          className={classNames(styles.select, interactiveClass)}
          disabled={disabled}
          value={(value as string) ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
        >
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
      const current = typeof value === 'number' ? value : 0
      return (
        <div className={classNames(styles.ratingRow, interactiveClass)}>
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <span
              key={n}
              className={classNames(styles.star, {
                [styles.starActive]: n <= current,
              })}
              onClick={disabled ? undefined : () => onChange?.(n)}
              role={disabled ? undefined : 'button'}
            >
              {n <= current ? '★' : '☆'}
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
                className={classNames(styles.scaleStep, interactiveClass, {
                  [styles.scaleStepActive]: value === step,
                })}
                disabled={disabled}
                onClick={() => onChange?.(step)}
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
          className={classNames(styles.input, interactiveClass)}
          type="date"
          min={field.minDate}
          max={field.maxDate}
          disabled={disabled}
          value={(value as string) ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )

    case 'file':
      return <div className={styles.fileStub}>File upload — coming soon</div>

    case 'text':
    default:
      return (
        <input
          className={classNames(styles.input, interactiveClass)}
          type="text"
          placeholder={field.placeholder}
          disabled={disabled}
          value={(value as string) ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )
  }
}
