import { FC, useState } from 'react'
import styles from './Sidebar.module.scss'
import { FieldType, FormField } from '@/features/forms/model'
import {
  CHOICE_FIELD_TYPES,
  FIELD_TYPE_META,
  MAX_FIELDS_PER_FORM,
} from '@/features/form-builder/model'
import { FIELD_ICONS } from '../icons'

interface FieldPaletteProps {
  onAdd: (type: FieldType) => void
  onImport: (fields: FormField[]) => void
  disabled: boolean
}

const ENABLED_TYPES = new Set(
  FIELD_TYPE_META.filter((meta) => meta.enabled).map((meta) => meta.type),
)

const newFieldId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `field-${Date.now()}-${Math.random().toString(16).slice(2)}`

// Validates and normalizes a pasted JSON field array: assigns fresh ids
// (never trust ids from pasted text), checks type/label are present and
// the type is one we support, and enforces the same 50-field cap as the
// canvas. Throws with a message meant to be shown inline, not as a toast
// (docs/pages/form-editor.md, decision #4).
function parseFieldsJson(raw: string): FormField[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Invalid JSON — check for a missing bracket or comma')
  }

  if (!Array.isArray(parsed)) {
    throw new Error('The schema must be an array of fields')
  }
  if (parsed.length > MAX_FIELDS_PER_FORM) {
    throw new Error(`A form can have at most ${MAX_FIELDS_PER_FORM} fields`)
  }

  return parsed.map((item, index) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Field ${index + 1} must be an object`)
    }
    const { type, label } = item as Record<string, unknown>
    if (typeof type !== 'string' || !ENABLED_TYPES.has(type as FieldType)) {
      throw new Error(`Field ${index + 1} has an unsupported type "${type}"`)
    }
    if (typeof label !== 'string' || !label.trim()) {
      throw new Error(`Field ${index + 1} is missing a label`)
    }

    const partial = item as Partial<FormField>
    return {
      ...partial,
      id: newFieldId(),
      type: type as FieldType,
      label,
      required: Boolean(partial.required),
      // Same default as adding from the palette: choice types start
      // opted into analytics unless the pasted schema says otherwise.
      trackStats: CHOICE_FIELD_TYPES.includes(type as FieldType)
        ? (partial.trackStats ?? true)
        : undefined,
    } as FormField
  })
}

export const FieldPalette: FC<FieldPaletteProps> = ({
  onAdd,
  onImport,
  disabled,
}) => {
  const [jsonInput, setJsonInput] = useState('')
  const [jsonError, setJsonError] = useState('')

  const handleApply = () => {
    if (!jsonInput.trim()) return
    try {
      const fields = parseFieldsJson(jsonInput)
      setJsonError('')
      setJsonInput('')
      onImport(fields)
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid schema')
    }
  }

  return (
    <div>
      <div className={styles.palette}>
        {FIELD_TYPE_META.map((meta) => {
          const Icon = FIELD_ICONS[meta.type]
          const isDisabled = !meta.enabled || disabled
          return (
            <button
              key={meta.type}
              className={styles.paletteItem}
              disabled={isDisabled}
              title={
                !meta.enabled
                  ? 'Coming soon'
                  : disabled
                    ? 'Field limit reached'
                    : undefined
              }
              onClick={() => meta.enabled && !disabled && onAdd(meta.type)}
            >
              <Icon />
              {meta.label}
              {!meta.enabled && <span className={styles.soonBadge}>Soon</span>}
            </button>
          )
        })}
      </div>

      <div className={styles.jsonImport}>
        <div className={styles.rowLabel}>Import JSON schema</div>
        <textarea
          className={styles.jsonTextarea}
          placeholder='[{"type":"text","label":"Your name"}]'
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value)
            if (jsonError) setJsonError('')
          }}
        />
        {jsonError && <div className={styles.jsonError}>{jsonError}</div>}
        <button
          type="button"
          className={styles.applyJsonBtn}
          disabled={!jsonInput.trim()}
          onClick={handleApply}
        >
          Apply — replaces all questions
        </button>
      </div>
    </div>
  )
}
