import { FieldType } from '@/features/forms/model'

export interface FieldTypeMeta {
  type: FieldType
  label: string
  enabled: boolean
}

// Only `text` is wired up for now (phase 3, first cut). The rest render in
// the palette as disabled "Soon" tiles until their settings/renderer land —
// see docs/pages/form-editor.md.
export const FIELD_TYPE_META: FieldTypeMeta[] = [
  { type: 'text', label: 'Text', enabled: true },
  { type: 'textarea', label: 'Textarea', enabled: false },
  { type: 'radio', label: 'Radio', enabled: false },
  { type: 'checkbox', label: 'Checkbox', enabled: false },
  { type: 'select', label: 'Select', enabled: false },
  { type: 'rating', label: 'Rating', enabled: false },
  { type: 'scale', label: 'Scale', enabled: false },
  { type: 'date', label: 'Date', enabled: false },
  { type: 'file', label: 'File', enabled: false },
]

export const MAX_FIELDS_PER_FORM = 50

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
