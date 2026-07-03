import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { formsApi } from './formsApi'
import {
  CreateFormPayload,
  Form,
  ListFormsParams,
  UpdateFormPayload,
} from './types'
import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'

const DEFAULT_LIMIT = 20

interface FormsState {
  items: Form[]
  total: number
  page: number
  limit: number
  search: string
  hasMore: boolean
  isLoading: boolean // first page (initial load or new search)
  isLoadingMore: boolean // subsequent pages (infinite scroll)
  error: string | null
  // Tracks the requestId of the latest page-1 fetch (fresh list / new
  // search term). A slow page-1 response that resolves after a newer one
  // — e.g. fast typing outracing the network — is dropped instead of
  // clobbering the already-current list. Page>1 (load-more) requests don't
  // need this: isLoadingMore already serializes them one at a time.
  latestListRequestId: string | null
}

const initialState: FormsState = {
  items: [],
  total: 0,
  page: 0,
  limit: DEFAULT_LIMIT,
  search: '',
  hasMore: true,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  latestListRequestId: null,
}

export const fetchForms = createAsyncThunk(
  'forms/fetchForms',
  async (params: ListFormsParams, { rejectWithValue }) => {
    try {
      const response = await formsApi.list(params)
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

export const updateForm = createAsyncThunk(
  'forms/updateForm',
  async (
    { id, payload }: { id: string; payload: UpdateFormPayload },
    { rejectWithValue },
  ) => {
    try {
      const response = await formsApi.update(id, payload)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update form'
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
      .addCase(fetchForms.pending, (state, action) => {
        const page = action.meta.arg.page ?? 1
        if (page === 1) {
          state.isLoading = true
          state.latestListRequestId = action.meta.requestId
        } else {
          state.isLoadingMore = true
        }
        state.error = null
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        const { items, total, page, limit } = action.payload
        state.isLoading = false
        state.isLoadingMore = false

        // A page-1 response that isn't the latest one in flight is stale —
        // apply its loading-flag reset above, but not its data.
        if (page === 1 && action.meta.requestId !== state.latestListRequestId) {
          return
        }

        state.total = total
        state.page = page
        state.limit = limit
        state.search = action.meta.arg.search ?? ''
        state.items = page === 1 ? items : [...state.items, ...items]
        state.hasMore = state.items.length < total
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.isLoading = false
        state.isLoadingMore = false
        state.error = action.payload as string
      })

    builder.addCase(createForm.fulfilled, (state, action) => {
      state.items.unshift(action.payload)
      state.total += 1
    })

    builder.addCase(updateForm.fulfilled, (state, action) => {
      const index = state.items.findIndex((f) => f.id === action.payload.id)
      if (index !== -1) state.items[index] = action.payload
    })

    builder.addCase(deleteForm.fulfilled, (state, action) => {
      state.items = state.items.filter((form) => form.id !== action.payload)
      state.total = Math.max(0, state.total - 1)
    })
  },
})

export default formsSlice.reducer
