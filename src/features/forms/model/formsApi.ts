import {
  CreateFormPayload,
  Form,
  ListFormsParams,
  PaginatedForms,
  UpdateFormPayload,
} from './types'
import { api } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/api/api.constants'

export const formsApi = {
  list: (params: ListFormsParams = {}) =>
    api.get<PaginatedForms>(API_ENDPOINTS.FORMS.BASE, { params }),

  getOne: (id: string) => api.get<Form>(`${API_ENDPOINTS.FORMS.BASE}/${id}`),

  create: (payload: CreateFormPayload) =>
    api.post<Form>(API_ENDPOINTS.FORMS.BASE, payload),

  update: (id: string, payload: UpdateFormPayload) =>
    api.patch<Form>(`${API_ENDPOINTS.FORMS.BASE}/${id}`, payload),

  remove: (id: string) =>
    api.delete<{ message: string }>(`${API_ENDPOINTS.FORMS.BASE}/${id}`),

  publish: (id: string) =>
    api.post<Form>(`${API_ENDPOINTS.FORMS.BASE}/${id}/publish`),

  unpublish: (id: string) =>
    api.post<Form>(`${API_ENDPOINTS.FORMS.BASE}/${id}/unpublish`),

  // Admin Panel "Forms" tab — browsing/moderating another user's forms.
  // ADMIN can only act on regular USER accounts, SUPER_ADMIN on anyone's
  // (enforced server-side, mirrors the sessions admin endpoints).
  admin: {
    listForUser: (userId: string, params: ListFormsParams = {}) =>
      api.get<PaginatedForms>(
        `${API_ENDPOINTS.FORMS.BASE}/admin/users/${userId}`,
        { params },
      ),

    unpublish: (id: string) =>
      api.post<Form>(`${API_ENDPOINTS.FORMS.BASE}/admin/${id}/unpublish`),

    remove: (id: string) =>
      api.delete<{ message: string }>(
        `${API_ENDPOINTS.FORMS.BASE}/admin/${id}`,
      ),
  },
}
