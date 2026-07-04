import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@/features/auth/model'
import { formsReducer } from '@/features/forms/model'
import { formBuilderReducer } from '@/features/form-builder/model'
import { formResponsesReducer } from '@/features/form-responses/model'
import { notificationsReducer } from '@/features/notifications/model'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forms: formsReducer,
    formBuilder: formBuilderReducer,
    formResponses: formResponsesReducer,
    notifications: notificationsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
