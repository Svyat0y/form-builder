import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { formsApi } from './formsApi'
import { CreateFormPayload, Form } from './types'
import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'

interface FormsState {
  items: Form[]
  isLoading: boolean
  error: string | null
}

const initialState: FormsState = {
  items: [],
  isLoading: false,
  error: null,
}

export const fetchForms = createAsyncThunk(
  'forms/fetchForms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await formsApi.list()
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to load forms'
      return rejectWithValue(message)
    }
  },
)

export const createForm = createAsyncThunk(
  'forms/createForm',
  async (payload: CreateFormPayload, { rejectWithValue }) => {
    try {
      const response = await formsApi.create(payload)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create form'
      await showSimpleAlert('error', 'Error', message)
      return rejectWithValue(message)
    }
  },
)

export const deleteForm = createAsyncThunk(
  'forms/deleteForm',
  async (id: string, { rejectWithValue }) => {
    try {
      await formsApi.remove(id)
      return id
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete form'
      await showSimpleAlert('error', 'Error', message)
      return rejectWithValue(message)
    }
  },
)

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForms.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder.addCase(createForm.fulfilled, (state, action) => {
      state.items.unshift(action.payload)
    })

    builder.addCase(deleteForm.fulfilled, (state, action) => {
      state.items = state.items.filter((form) => form.id !== action.payload)
    })
  },
})

export default formsSlice.reducer
