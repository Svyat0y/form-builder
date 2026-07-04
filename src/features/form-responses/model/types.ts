import { FieldType } from '@/features/forms/model'

// Mirrors backend src/responses/response.entity.ts.
export interface FormResponseItem {
  id: string
  formId: string
  answers: Record<string, string | string[] | number>
  createdAt: string
}

export interface ListResponsesParams {
  page?: number
  limit?: number
}

export interface PaginatedResponses {
  items: FormResponseItem[]
  total: number
  page: number
  limit: number
}

// Mirrors backend src/responses/stats.types.ts — GET /:id/responses/stats.
export interface FieldStats {
  fieldId: string
  type: FieldType
  distribution?: Record<string, number>
  average?: number
  latest?: string[]
}

export interface ResponseStats {
  total: number
  today: number
  completionRate: number
  fields: FieldStats[]
}
