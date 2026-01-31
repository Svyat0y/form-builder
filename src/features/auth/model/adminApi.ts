import { User } from './types'
import { api } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/api/api.constants'

export const adminApi = {
  getUsers: () => api.get<User[]>(API_ENDPOINTS.USERS.ALL),

  deleteUser: (userId: string) =>
    api.post(API_ENDPOINTS.USERS.DELETE, { userId }),

  updateUserRole: (userId: string, role: string) =>
    api.patch(API_ENDPOINTS.USERS.UPDATE_ROLE, { userId, role }),
}
