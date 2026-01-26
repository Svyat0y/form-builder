import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authStorage } from './authStorage'
import { authApi } from './authApi'
import { LoginCredentials, RegisterData } from './types'
import { IUser } from '@/shared/types/interfaces/user.interface'
import { ALERT_MESSAGES } from '../lib/auth.constants'
import {
  cleanupAuth,
  handleApiError,
  isTokenExpired,
  showSuccessAlert,
} from '../lib/auth.helpers'
import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'
import { STORAGE_KEYS } from '@/shared/config/constants'

interface AuthState {
  user: IUser | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
}

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData)
      await showSuccessAlert(ALERT_MESSAGES.REGISTER_SUCCESS)
      return response.data
    } catch (error: any) {
      const errorMessage = await handleApiError(
        error,
        ALERT_MESSAGES.REGISTER_FAILED,
      )
      return rejectWithValue(errorMessage)
    }
  },
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)
      const { user } = response.data

      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      }

      const token = user.accessToken

      authStorage.setToken(token)
      authStorage.setUser(userData)

      if (credentials.rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true')
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
      }

      return {
        user: userData,
        token,
      }
    } catch (error: any) {
      let errorMessage = 'Login failed'

      if (!error.response) {
        if (
          error.code === 'ERR_NETWORK' ||
          error.message?.includes('Network Error')
        ) {
          errorMessage =
            'Cannot connect to server. Please check your connection and server URL.'
        } else if (error.message?.includes('CORS')) {
          errorMessage =
            'CORS error: Server is not configured to accept requests from this origin.'
        } else {
          errorMessage = `Connection error: ${error.message || 'Unable to reach server'}`
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password'
      } else if (error.response?.status === 0) {
        errorMessage =
          'Network error: Cannot connect to server. Check if server is running and CORS is configured.'
      } else {
        errorMessage =
          error.response?.data?.message ||
          `Login failed (${error.response?.status})`
      }

      await showSimpleAlert('error', 'Error', errorMessage)

      return rejectWithValue(errorMessage)
    }
  },
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = authStorage.getToken()
      const user = authStorage.getUser()

      if (!token) {
        try {
          const response = await authApi.refreshTokens()
          const { user } = response.data
          const newToken = user.accessToken

          authStorage.setToken(newToken)
          authStorage.setUser(user)

          return { token: newToken, user }
        } catch (error) {
          console.log(error)
          cleanupAuth()
          return rejectWithValue('Session expired')
        }
      }

      if (isTokenExpired(token)) {
        try {
          const response = await authApi.refreshTokens()
          const { user: newUser } = response.data
          const newToken = newUser.accessToken

          authStorage.setToken(newToken)
          authStorage.setUser(newUser)

          return { token: newToken, user: newUser }
        } catch (error) {
          console.log(error)
          return { token, user }
        }
      }

      return { token, user }
    } catch (error: any) {
      console.log('Auth check failed:', error)
      return rejectWithValue('Authentication check failed')
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout()
  } catch (error) {
    console.log('Logout API error:', error)
  } finally {
    cleanupAuth()
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: IUser; token: string }>,
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null
      authStorage.setToken(action.payload.token)
      authStorage.setUser(action.payload.user)
    },

    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.error = null
      authStorage.clear()
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        authStorage.setUser(state.user)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
      })
  },
})

export const {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
  updateUser,
} = authSlice.actions

export default authSlice.reducer
