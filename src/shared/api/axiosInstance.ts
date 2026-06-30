import axios from 'axios'
import { API_CONFIG, API_ENDPOINTS } from './api.constants'
import { STORAGE_KEYS } from '../config/constants'
import { ROUTES } from '../config/routes'

const clearAuthStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
}

// Session is gone (token revoked/expired AND refresh failed). Wipe local auth,
// hard-redirect to sign-in, and halt the request chain with a never-resolving
// promise so no stale error UI flashes before the page unloads.
const forceLogout = (): Promise<never> => {
  clearAuthStorage()
  if (window.location.pathname !== ROUTES.signIn) {
    window.location.assign(ROUTES.signIn)
    return new Promise<never>(() => {})
  }
  return Promise.reject(new Error('Session expired'))
}

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
    if (config.data instanceof FormData) {
      // Let the browser set the multipart Content-Type with its boundary;
      // the instance default ('application/json') would otherwise stick.
      delete config.headers['Content-Type']
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
        clearAuthStorage()
        return Promise.reject(error)
      }

      // A 401 without a stored session (e.g. wrong login credentials) is a
      // legitimate API response, not an expired session — pass it through so
      // the caller can show the real message instead of forcing a logout.
      const hadSession = !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      if (!hadSession) {
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
        } catch {
          // Refresh failed — the session was revoked or fully expired.
          return forceLogout()
        }
      } else {
        return forceLogout()
      }
    }

    return Promise.reject(error)
  },
)

export { api }
