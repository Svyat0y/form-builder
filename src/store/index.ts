import { configureStore } from '@reduxjs/toolkit'
import authSlice from '@store/features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
