import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { responsesApi } from './responsesApi'
import { ListResponsesParams, PaginatedResponses, ResponseStats } from './types'

interface ResponsesState {
  items: PaginatedResponses['items']
  total: number
  page: number
  limit: number
  stats: ResponseStats | null
  isLoading: boolean // table page
  isLoadingStats: boolean
  // 'forbidden' | 'not-found' drive a redirect in the page component, same
  // convention as features/form-builder/model/builderSlice.
  loadError: 'forbidden' | 'not-found' | 'unknown' | null
}

const initialState: ResponsesState = {
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  stats: null,
  isLoading: false,
  isLoadingStats: false,
  loadError: null,
}

export const fetchResponses = createAsyncThunk(
  'formResponses/fetchResponses',
  async (
    { formId, params }: { formId: string; params?: ListResponsesParams },
    { rejectWithValue },
  ) => {
    try {
      const response = await responsesApi.list(formId, params)
      return response.data
    } catch (error: any) {
      const status = error.response?.status
      if (status === 403) return rejectWithValue('forbidden')
      if (status === 404) return rejectWithValue('not-found')
      return rejectWithValue('unknown')
    }
  },
)

export const fetchStats = createAsyncThunk(
  'formResponses/fetchStats',
  async (formId: string, { rejectWithValue }) => {
    try {
      const response = await responsesApi.stats(formId)
      return response.data
    } catch (error: any) {
      const status = error.response?.status
      if (status === 403) return rejectWithValue('forbidden')
      if (status === 404) return rejectWithValue('not-found')
      return rejectWithValue('unknown')
    }
  },
)

const responsesSlice = createSlice({
  name: 'formResponses',
  initialState,
  reducers: {
    resetResponses: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponses.pending, (state) => {
        state.isLoading = true
        state.loadError = null
      })
      .addCase(fetchResponses.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchResponses.rejected, (state, action) => {
        state.isLoading = false
        state.loadError = action.payload as ResponsesState['loadError']
      })

      .addCase(fetchStats.pending, (state) => {
        state.isLoadingStats = true
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isLoadingStats = false
        state.stats = action.payload
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.isLoadingStats = false
        if (!state.loadError) {
          state.loadError = action.payload as ResponsesState['loadError']
        }
      })
  },
})

export const { resetResponses } = responsesSlice.actions
export default responsesSlice.reducer
