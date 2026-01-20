export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CHECK_SESSION: '/auth/check-session',
  },

  USERS: {
    ME: '/users/me',
    ALL: '/users',
    DELETE: '/users/delete',
  },
} as const

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  WITH_CREDENTIALS: true,
} as const

export type ApiEndpoint =
  | (typeof API_ENDPOINTS.AUTH)[keyof typeof API_ENDPOINTS.AUTH]
  | (typeof API_ENDPOINTS.USERS)[keyof typeof API_ENDPOINTS.USERS]
