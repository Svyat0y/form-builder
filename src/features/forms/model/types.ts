export type FormStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'rating'
  | 'scale'
  | 'date'
  | 'file'

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  min?: number
  max?: number
  minLabel?: string
  maxLabel?: string
  minDate?: string
  maxDate?: string
  trackStats?: boolean
}

export interface FormSettings {
  successMessage?: string
  allowMultipleResponses?: boolean
}

export interface Form {
  id: string
  ownerId: string
  title: string
  description: string
  status: FormStatus
  fields: FormField[]
  settings: FormSettings
  responsesCount: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateFormPayload {
  title: string
}
