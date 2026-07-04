import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { notificationsApi } from './notificationsApi'
import { NotificationItem } from './types'

interface NotificationsState {
  items: NotificationItem[]
  total: number
  unreadCount: number
  isLoading: boolean
  error: string | null
}

const initialState: NotificationsState = {
  items: [],
  total: 0,
  unreadCount: 0,
  isLoading: false,
  error: null,
}

// A flat fetch of the most recent notifications — grouping (e.g. collapsing
// FORM_RESPONSE rows by formId) happens client-side in the bell UI, not here.
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.list({ limit: 50 })
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load notifications',
      )
    }
  },
)

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationsApi.markRead(id)
      return id
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark notification as read',
      )
    }
  },
)

export const removeNotification = createAsyncThunk(
  'notifications/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationsApi.remove(id)
      return id
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete notification',
      )
    }
  },
)

export const removeAllNotifications = createAsyncThunk(
  'notifications/removeAll',
  async (_, { rejectWithValue }) => {
    try {
      await notificationsApi.removeAll()
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear notifications',
      )
    }
  },
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Marks every notification in a form-response group read at once, when
    // the group's detail thread is opened — see NotificationBell.
    notificationsMarkedReadLocally: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      const ids = new Set(action.payload)
      let cleared = 0
      state.items.forEach((item) => {
        if (ids.has(item.id) && !item.readAt) {
          item.readAt = new Date().toISOString()
          cleared += 1
        }
      })
      state.unreadCount = Math.max(0, state.unreadCount - cleared)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.unreadCount = action.payload.unreadCount
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder.addCase(markNotificationRead.fulfilled, (state, action) => {
      const item = state.items.find((n) => n.id === action.payload)
      if (item && !item.readAt) {
        item.readAt = new Date().toISOString()
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    })

    builder.addCase(removeNotification.fulfilled, (state, action) => {
      const item = state.items.find((n) => n.id === action.payload)
      if (item && !item.readAt) {
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
      state.items = state.items.filter((n) => n.id !== action.payload)
      state.total = Math.max(0, state.total - 1)
    })

    builder.addCase(removeAllNotifications.fulfilled, (state) => {
      state.items = []
      state.total = 0
      state.unreadCount = 0
    })
  },
})

export const { notificationsMarkedReadLocally } = notificationsSlice.actions

export default notificationsSlice.reducer
