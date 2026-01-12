import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, LoginCredentials, RegisterData } from '@api/auth.service'
import { IUser } from '@app-types/interfaces/user.interface'
import { showSimpleAlert } from '../utils/sweetAlert'
import { Ring } from 'react-spinners-css'
import {
  clearAuthStorage,
  getAuthFromStorage,
  saveAuthToStorage,
  validateToken,
} from './helpers/auth.helpers'
import {
  ALERT_MESSAGES,
  LOADING_STYLE,
  SPINNER_COLOR,
  STORAGE_KEYS,
} from './helpers/auth.constants'

interface IAuthContext {
  user: IUser | null
  token: string | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  fetchProfile: () => Promise<void>
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined)

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const clearAuthData = () => {
    clearAuthStorage()
    setToken(null)
    setUser(null)
  }

  const saveAuthData = (newToken: string, newUser: IUser) => {
    saveAuthToStorage(newToken, newUser)
    setToken(newToken)
    setUser(newUser)
  }

  const fetchProfile = async () => {
    try {
      const userProfile = await authService.getProfile()
      if (userProfile) {
        setUser(userProfile)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile))
      }
    } catch (error) {
      console.log('Failed to fetch user profile', error)
    }
  }

  const handleAuthError = async (error: any, defaultMessage: string) => {
    const errorMessage = error.response?.data?.message || defaultMessage
    await showSimpleAlert('error', 'Error', errorMessage)
    throw error
  }

  const checkStoredAuth = async () => {
    const { token: storedToken, user: storedUser } = getAuthFromStorage()

    if (storedToken && storedUser && validateToken(storedToken)) {
      setToken(storedToken)
      setUser(storedUser)
      return true
    }

    return false
  }

  const attemptRefresh = async () => {
    try {
      const refreshResult = await authService.refreshTokens()

      if (refreshResult?.accessToken) {
        const newToken = refreshResult.accessToken
        setToken(newToken)
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken)

        const userProfile = await authService.getProfile()
        if (userProfile) {
          setUser(userProfile)
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile))
        }
        return true
      }
    } catch (error) {
      console.log('Refresh failed:', error)
    }

    return false
  }

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const result = await authService.login(credentials)
      await fetchProfile()
      saveAuthData(result.user.accessToken, result.user)

      await showSimpleAlert('success', 'Success', ALERT_MESSAGES.LOGIN_SUCCESS)
      navigate('/')
    } catch (error: any) {
      await handleAuthError(error, ALERT_MESSAGES.LOGIN_FAILED)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      await authService.register(data)
      await showSimpleAlert(
        'success',
        'Success',
        ALERT_MESSAGES.REGISTER_SUCCESS,
      )
      navigate('/signin')
    } catch (error: any) {
      await handleAuthError(error, ALERT_MESSAGES.REGISTER_FAILED)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      clearAuthData()
      await showSimpleAlert('success', 'Success', ALERT_MESSAGES.LOGOUT_SUCCESS)
      navigate('/signin')
    } catch (error: any) {
      await showSimpleAlert('error', 'Error', ALERT_MESSAGES.LOGOUT_FAILED)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const hasValidStoredAuth = await checkStoredAuth()
        if (hasValidStoredAuth) {
          setIsLoading(false)
          return
        }

        const refreshed = await attemptRefresh()
        if (!refreshed) {
          clearAuthData()
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const value: IAuthContext = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    fetchProfile,
  }

  if (isLoading) {
    return (
      <div style={LOADING_STYLE}>
        <Ring color={SPINNER_COLOR} />
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
