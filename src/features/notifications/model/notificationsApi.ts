import { api } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/api/api.constants'
import { PaginatedNotifications } from './types'

export const notificationsApi = {
  list: (params: { page?: number; limit?: number }) =>
    api.get<PaginatedNotifications>(API_ENDPOINTS.NOTIFICATIONS.BASE, {
      params,
    }),

  markRead: (id: string) =>
    api.patch(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${id}/read`),

  remove: (id: string) =>
    api.delete(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${id}`),

  removeAll: () => api.delete(API_ENDPOINTS.NOTIFICATIONS.BASE),
}
