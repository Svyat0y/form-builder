export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CHECK_SESSION: '/auth/check-session',
    GOOGLE: '/auth/google',
    FACEBOOK: '/auth/facebook',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  USERS: {
    ME: '/users/me',
    ALL: '/users',
    DELETE: '/users/delete',
    UPDATE_ROLE: '/users/update-role',
    SESSIONS: '/users/me/sessions',
  },
} as const

const normalizeUrl = (url: string): string => {
  return url?.endsWith('/') ? url.slice(0, -1) : url
}

const BASE_URL = normalizeUrl(process.env.REACT_APP_BACKEND_URL || '')

export const API_CONFIG = {
  BASE_URL,
  OAUTH_GOOGLE_URL: `${BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE}`,
  OAUTH_FACEBOOK_URL: `${BASE_URL}${API_ENDPOINTS.AUTH.FACEBOOK}`,
  TIMEOUT: 30000,
  WITH_CREDENTIALS: true,
} as const

export type ApiEndpoint =
  | (typeof API_ENDPOINTS.AUTH)[keyof typeof API_ENDPOINTS.AUTH]
  | (typeof API_ENDPOINTS.USERS)[keyof typeof API_ENDPOINTS.USERS]
