import { FieldType } from '@/features/forms/model'

export interface FieldTypeMeta {
  type: FieldType
  label: string
  enabled: boolean
}

// `file` needs an object storage decision first (see docs/modules/users.md
// re: avatars) — stays disabled ("Soon") until that lands. Every other type
// is wired up: palette, per-type Settings, and FieldRenderer preview.
export const FIELD_TYPE_META: FieldTypeMeta[] = [
  { type: 'text', label: 'Text', enabled: true },
  { type: 'textarea', label: 'Textarea', enabled: true },
  { type: 'radio', label: 'Radio', enabled: true },
  { type: 'checkbox', label: 'Checkbox', enabled: true },
  { type: 'select', label: 'Select', enabled: true },
  { type: 'rating', label: 'Rating', enabled: true },
  { type: 'scale', label: 'Scale', enabled: true },
  { type: 'date', label: 'Date', enabled: true },
  { type: 'file', label: 'File', enabled: false },
]

// Choice-type fields support opt-in stats aggregation (trackStats) — see
// forms-realtime-architecture.md §5.1. Mirrors the backend's
// CHOICE_FIELD_TYPES (src/forms/form-field.types.ts).
export const CHOICE_FIELD_TYPES: FieldType[] = [
  'radio',
  'checkbox',
  'select',
  'rating',
  'scale',
]

export const MAX_FIELDS_PER_FORM = 50

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
