export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'user',
} as const

export const ALERT_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGIN_FAILED: 'Login failed',
  REGISTER_SUCCESS: 'Registration completed successfully. You can now log in.',
  REGISTER_FAILED: 'Registration failed',
  LOGOUT_SUCCESS: 'Logged out successfully',
  LOGOUT_FAILED: 'Logout failed',
} as const

export const LOADING_STYLE = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
} as const

export const SPINNER_COLOR = 'hsl(210, 100%, 35%)'
