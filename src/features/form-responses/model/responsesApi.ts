import { ListResponsesParams, PaginatedResponses, ResponseStats } from './types'
import { api } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/api/api.constants'

export const responsesApi = {
  list: (formId: string, params: ListResponsesParams = {}) =>
    api.get<PaginatedResponses>(
      `${API_ENDPOINTS.FORMS.BASE}/${formId}/responses`,
      { params },
    ),

  stats: (formId: string) =>
    api.get<ResponseStats>(
      `${API_ENDPOINTS.FORMS.BASE}/${formId}/responses/stats`,
    ),
}
