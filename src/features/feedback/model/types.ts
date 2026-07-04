export type FeedbackStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED'

export interface Feedback {
  id: string
  userId: string
  message: string
  status: FeedbackStatus
  handledByUserId: string | null
  handledAt: string | null
  createdAt: string
  user?: { id: string; name: string; email: string }
  handledByUser?: { id: string; name: string } | null
}

export interface PaginatedFeedback {
  items: Feedback[]
  total: number
  page: number
  limit: number
}

export interface ListFeedbackParams {
  page?: number
  limit?: number
  status?: FeedbackStatus
  sort?: 'ASC' | 'DESC'
}
