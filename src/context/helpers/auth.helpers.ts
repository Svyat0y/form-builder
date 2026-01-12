export const validateToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiry = payload.exp * 1000
    return Date.now() < expiry
  } catch {
    return false
  }
}

export const clearAuthStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
}

export const saveAuthToStorage = (accessToken: string, user: any) => {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('user', JSON.stringify(user))
}

export const getAuthFromStorage = () => {
  const token = localStorage.getItem('accessToken')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  return { token, user }
}
