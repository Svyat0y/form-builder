import { LoginCredentials, RegisterData } from '@store/features/auth/types'
import { api } from '@api/index'

export const authApi = {
  register: (data: RegisterData) => api.post('/auth/register', data),

  login: (credentials: LoginCredentials) =>
    api.post('/auth/login', credentials),

  logout: () => api.post('/auth/logout'),

  refreshTokens: () => api.post('/auth/refresh', {}),

  getProfile: () => api.get('/users/me'),
}
