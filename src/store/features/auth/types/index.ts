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
    accessToken: string
  }
}
