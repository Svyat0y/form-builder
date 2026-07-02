import { CreateFormPayload, Form, UpdateFormPayload } from './types'
import { api } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/api/api.constants'

export const formsApi = {
  list: () => api.get<Form[]>(API_ENDPOINTS.FORMS.BASE),

  create: (payload: CreateFormPayload) =>
    api.post<Form>(API_ENDPOINTS.FORMS.BASE, payload),

  update: (id: string, payload: UpdateFormPayload) =>
    api.patch<Form>(`${API_ENDPOINTS.FORMS.BASE}/${id}`, payload),

  remove: (id: string) => api.delete(`${API_ENDPOINTS.FORMS.BASE}/${id}`),
}
