import { PublicForm, SubmitResponsePayload } from './types'
import { api } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/api/api.constants'

// Anonymous endpoints — no auth header is required (the shared `api`
// instance attaches one if present, but the backend ignores it here).
// See docs/pages/public-form.md.
export const publicFormApi = {
  getOne: (id: string) =>
    api.get<PublicForm>(`${API_ENDPOINTS.FORMS.BASE}/${id}/public`),

  submit: (id: string, payload: SubmitResponsePayload) =>
    api.post<{ id: string; createdAt: string }>(
      `${API_ENDPOINTS.FORMS.BASE}/${id}/submit`,
      payload,
    ),
}
