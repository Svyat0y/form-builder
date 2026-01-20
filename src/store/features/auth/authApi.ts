import { LoginCredentials, RegisterData } from '@store/features/auth/types'
import { api } from '@api/index'
import { API_ENDPOINTS } from '@api/api.constants'

export const authApi = {
  register: (data: RegisterData) => api.post(API_ENDPOINTS.AUTH.REGISTER, data),

  login: (credentials: LoginCredentials) =>
    api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),

  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),

  refreshTokens: () => api.post(API_ENDPOINTS.AUTH.REFRESH, {}),

  getProfile: () => api.get(API_ENDPOINTS.USERS.ME),
}
