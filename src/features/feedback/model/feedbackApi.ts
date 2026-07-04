import { api } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/api/api.constants'
import {
  Feedback,
  FeedbackStatus,
  ListFeedbackParams,
  PaginatedFeedback,
} from './types'

export const feedbackApi = {
  submit: (message: string) =>
    api.post(API_ENDPOINTS.FEEDBACK.BASE, { message }),

  list: (params: ListFeedbackParams) =>
    api.get<PaginatedFeedback>(API_ENDPOINTS.FEEDBACK.BASE, { params }),

  updateStatus: (id: string, status: FeedbackStatus) =>
    api.patch<Feedback>(`${API_ENDPOINTS.FEEDBACK.BASE}/${id}/status`, {
      status,
    }),

  remove: (id: string) => api.delete(`${API_ENDPOINTS.FEEDBACK.BASE}/${id}`),
}
