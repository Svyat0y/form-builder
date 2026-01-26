import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'

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
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  localStorage.removeItem('rememberMe')
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
