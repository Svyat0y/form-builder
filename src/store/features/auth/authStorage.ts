import { IUser } from '@app-types/interfaces/user.interface'
import { STORAGE_KEYS } from '@store/features/auth/helpers/auth.constants'

export const validateToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiry = payload.exp * 1000
    return Date.now() < expiry
  } catch {
    return false
  }
}

export const authStorage = {
  // Getters
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },

  getUser(): IUser | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    return userStr ? JSON.parse(userStr) : null
  },

  // Setters
  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  },

  setUser(user: IUser): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  // Clear all auth data
  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken()

    if (!token) return false

    return validateToken(token)
  },

  // Get all stored auth data
  getAuthData(): { token: string | null; user: IUser | null } {
    return {
      token: this.getToken(),
      user: this.getUser(),
    }
  },
}
