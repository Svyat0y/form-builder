import { createSlice } from '@reduxjs/toolkit'
import { IUser } from '@app-types/interfaces/user.interface'

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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: () => {},
})

// export const {} = authSlice.actions
export default authSlice.reducer
