import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'
import { STORAGE_KEYS } from '@/shared/config/constants'

export const handleApiError = async (
  error: any,
  defaultMessage: string,
): Promise<string> => {
  const errorMessage = error.response?.data?.message || defaultMessage
  await showSimpleAlert('error', 'Error', errorMessage)
  return errorMessage
}

export const showSuccessAlert = async (message: string) => {
  await showSimpleAlert('success', 'Success', message)
}

export const cleanupAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000
    const now = Date.now()

    return now >= exp - 30000
  } catch {
    return true
  }
}
