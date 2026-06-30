import { LoginCredentials, RegisterData, Session } from './types'
import { api } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/api/api.constants'

export const authApi = {
  register: (data: RegisterData) => api.post(API_ENDPOINTS.AUTH.REGISTER, data),

  login: (credentials: LoginCredentials) =>
    api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),

  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),

  refreshTokens: () => api.post(API_ENDPOINTS.AUTH.REFRESH, {}),

  getProfile: () => api.get(API_ENDPOINTS.USERS.ME),

  updateProfile: (name: string) => api.patch(API_ENDPOINTS.USERS.ME, { name }),

  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post<{ avatar: string }>(API_ENDPOINTS.USERS.AVATAR, formData)
  },

  deleteAvatar: () => api.delete(API_ENDPOINTS.USERS.AVATAR),

  getSessions: () => api.get<Session[]>(API_ENDPOINTS.USERS.SESSIONS),

  forgotPassword: (email: string) =>
    api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

  resetPassword: (token: string, password: string) =>
    api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password }),
}
