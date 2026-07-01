export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: {
    id: string
    email: string
    name: string
    createdAt: string
    role: string
    accessToken: string
    avatar?: string | null
    // false for social-only accounts (Google/Facebook) with no local password
    hasPassword?: boolean
  }
}

export interface Session {
  id: string
  deviceInfo: string | null
  deviceFingerprint: string | null
  lastUsed: string
  createdAt: string
  expiresAt: string
  revoked: boolean
  current: boolean
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  role: string
  avatar?: string | null
  // false for social-only accounts (Google/Facebook) with no local password
  hasPassword?: boolean
}

// A session as seen by an admin inspecting another user's account —
// there is no "current device" concept here, unlike the self-service `Session`.
export interface AdminSession {
  id: string
  deviceInfo: string | null
  deviceFingerprint: string | null
  lastUsed: string
  createdAt: string
  expiresAt: string
  revoked: boolean
}
