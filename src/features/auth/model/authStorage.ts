import { IUser } from '@/shared/types/interfaces/user.interface'
import { STORAGE_KEYS } from '@/shared/config/constants'

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },

  getUser(): IUser | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    return userStr ? JSON.parse(userStr) : null
  },

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  },

  setUser(user: IUser): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  clear() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
  },
}
