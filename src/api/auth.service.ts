import { api } from '@api/axiosInstance'
import { StorageKey } from '@app-types/enums'
import { IUser } from '@app-types/interfaces/user.interface'

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

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data)

    return response.data
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    const { user } = response.data

    this.setAccessTokenToLS(user.accessToken)
    this.setUserToLs({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    })

    return response.data
  }

  async refreshTokens(): Promise<{ accessToken: string } | null> {
    try {
      const response = await api.post('/auth/refresh', {})

      if (response.data.user?.accessToken) {
        this.setAccessTokenToLS(response.data.user.accessToken)
        this.setUserToLs(response.data.user)
      }

      return {
        accessToken: response.data.user.accessToken,
      }
    } catch (error) {
      console.log('Refresh failed - no valid refresh token', error)
      this.clearTokensFromLS()
      return null
    }
  }

  async getProfile(): Promise<IUser | null> {
    try {
      const response = await api.get('/users/me')
      return {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        createdAt: response.data.createdAt,
      }
    } catch (error) {
      console.log('Failed to get user profile', error)
      return null
    }
  }

  logout(): void {
    this.clearTokensFromLS()
    api.post('/auth/logout').catch(() => {})
  }

  // getters
  getAccessTokenFromLS(): string | null {
    return localStorage.getItem(StorageKey.AccessToken)
  }

  getUserFormLS(): IUser | null {
    const userStr = localStorage.getItem(StorageKey.User)
    return userStr ? JSON.parse(userStr) : null
  }

  // setters
  setAccessTokenToLS(token: string): void {
    localStorage.setItem(StorageKey.AccessToken, token)
  }

  setUserToLs(user: IUser): void {
    localStorage.setItem(StorageKey.User, JSON.stringify(user))
  }

  clearTokensFromLS(): void {
    localStorage.removeItem(StorageKey.AccessToken)
    localStorage.removeItem(StorageKey.User)
  }
}

export const authService = new AuthService()
