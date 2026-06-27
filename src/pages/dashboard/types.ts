export type ViewMode = 'grid' | 'list'
export type FormStatus = 'active' | 'draft' | 'closed'

export interface FormItem {
  id: string
  title: string
  status: FormStatus
  responses: number
  updated: string
}

export const STATUS_LABELS: Record<FormStatus, string> = {
  active: 'Active',
  draft: 'Draft',
  closed: 'Closed',
}

export const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN']
