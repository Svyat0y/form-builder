import axios from 'axios'
import { API_CONFIG, API_ENDPOINTS } from './api.constants'
import { STORAGE_KEYS } from '../config/constants'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      const url = originalRequest.url || ''

      if (
        url.includes(API_ENDPOINTS.AUTH.REFRESH) ||
        url.includes(API_ENDPOINTS.AUTH.LOGOUT)
      ) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
        return Promise.reject(error)
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshResponse = await api.post(API_ENDPOINTS.AUTH.REFRESH)
          const newToken = refreshResponse.data.user.accessToken

          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken)

          originalRequest.headers.Authorization = `Bearer ${newToken}`

          return api(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
          return Promise.reject(refreshError)
        }
      } else {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export { api }
