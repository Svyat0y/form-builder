import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authStorage } from './authStorage'
import { authApi } from './authApi'
import { LoginCredentials, RegisterData } from './types'
import { IUser } from '@app-types/interfaces/user.interface'
import { ALERT_MESSAGES } from '@store/features/auth/helpers/auth.constants'
import {
  handleApiError,
  showSuccessAlert,
} from '@store/features/auth/helpers/auth.helpers'

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

      // Extract user data and token
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      }

      const token = user.accessToken

      // Save to localStorage
      authStorage.setToken(token)
      authStorage.setUser(userData)

      return {
        user: userData,
        token,
      }
    } catch (error: any) {
      const errorMessage = await handleApiError(
        error,
        ALERT_MESSAGES.LOGIN_FAILED,
      )
      return rejectWithValue(errorMessage)
    }
  },
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { token: storedToken, user: storedUser } = authStorage.getAuthData()

      if (storedToken && authStorage.isAuthenticated()) {
        if (storedUser) {
          return { token: storedToken, user: storedUser }
        } else {
          try {
            const profileResponse = await authApi.getProfile()
            const userData = {
              id: profileResponse.data.id,
              email: profileResponse.data.email,
              name: profileResponse.data.name,
              createdAt: profileResponse.data.createdAt,
            }

            authStorage.setUser(userData)

            return { token: storedToken, user: userData }
          } catch (profileError) {
            console.log('Failed to get profile:', profileError)
          }
        }
      }

      const refreshResponse = await authApi.refreshTokens()
      const { user: refreshedUser } = refreshResponse.data

      const userData = {
        id: refreshedUser.id,
        email: refreshedUser.email,
        name: refreshedUser.name,
        createdAt: refreshedUser.createdAt,
      }

      const newToken = refreshedUser.accessToken

      authStorage.setToken(newToken)
      authStorage.setUser(userData)

      return { token: newToken, user: userData }
    } catch (error: any) {
      console.log('Auth check completely failed:', error)

      authStorage.clear()
      return rejectWithValue('Authentication required')
    }
  },
)

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
