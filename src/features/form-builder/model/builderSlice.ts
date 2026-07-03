import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { formsApi } from '@/features/forms/model'
import { FieldType, Form, FormField, FormStatus } from '@/features/forms/model'
import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'
import { CHOICE_FIELD_TYPES, MAX_FIELDS_PER_FORM, SaveStatus } from './types'

interface BuilderState {
  formId: string | null
  title: string
  description: string
  status: FormStatus
  fields: FormField[]
  activeFieldId: string | null
  isDirty: boolean
  saveStatus: SaveStatus
  isLoading: boolean
  // 'forbidden' | 'not-found' drive a redirect in the page component
  loadError: 'forbidden' | 'not-found' | 'unknown' | null
}

const initialState: BuilderState = {
  formId: null,
  title: '',
  description: '',
  status: 'DRAFT',
  fields: [],
  activeFieldId: null,
  isDirty: false,
  saveStatus: 'idle',
  isLoading: false,
  loadError: null,
}

const newFieldId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `field-${Date.now()}-${Math.random().toString(16).slice(2)}`

const defaultField = (type: FieldType): FormField => {
  const base: FormField = {
    id: newFieldId(),
    type,
    label: 'Untitled question',
    placeholder: '',
    required: false,
  }

  if (CHOICE_FIELD_TYPES.includes(type)) {
    base.trackStats = true
  }

  switch (type) {
    case 'radio':
    case 'checkbox':
    case 'select':
      base.options = ['Option 1', 'Option 2']
      break
    case 'rating':
      base.min = 1
      base.max = 5
      break
    case 'scale':
      base.min = 1
      base.max = 10
      base.minLabel = ''
      base.maxLabel = ''
      break
    default:
      break
  }

  return base
}

export const fetchFormForEdit = createAsyncThunk(
  'formBuilder/fetchFormForEdit',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await formsApi.getOne(id)
      return response.data
    } catch (error: any) {
      const status = error.response?.status
      if (status === 403) return rejectWithValue('forbidden')
      if (status === 404) return rejectWithValue('not-found')
      return rejectWithValue('unknown')
    }
  },
)

export const saveFormChanges = createAsyncThunk(
  'formBuilder/saveFormChanges',
  async (
    {
      id,
      title,
      description,
      fields,
    }: { id: string; title: string; description: string; fields: FormField[] },
    { rejectWithValue },
  ) => {
    try {
      const response = await formsApi.update(id, { title, description, fields })
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save form'
      return rejectWithValue(message)
    }
  },
)

export const publishForm = createAsyncThunk(
  'formBuilder/publishForm',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await formsApi.publish(id)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to publish form'
      await showSimpleAlert('error', 'Error', message)
      return rejectWithValue(message)
    }
  },
)

export const unpublishForm = createAsyncThunk(
  'formBuilder/unpublishForm',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await formsApi.unpublish(id)
      return response.data
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to unpublish form'
      await showSimpleAlert('error', 'Error', message)
      return rejectWithValue(message)
    }
  },
)

const applyForm = (state: BuilderState, form: Form) => {
  state.formId = form.id
  state.title = form.title
  state.description = form.description
  state.status = form.status
  state.fields = form.fields
}

const builderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    resetBuilder: () => initialState,

    setTitle: (state, action: { payload: string }) => {
      state.title = action.payload
      state.isDirty = true
    },

    setDescription: (state, action: { payload: string }) => {
      state.description = action.payload
      state.isDirty = true
    },

    addField: (state, action: { payload: FieldType }) => {
      if (state.fields.length >= MAX_FIELDS_PER_FORM) return
      const field = defaultField(action.payload)
      state.fields.push(field)
      state.activeFieldId = field.id
      state.isDirty = true
    },

    updateField: (
      state,
      action: { payload: { id: string; patch: Partial<FormField> } },
    ) => {
      const field = state.fields.find((f) => f.id === action.payload.id)
      if (!field) return
      Object.assign(field, action.payload.patch)
      state.isDirty = true
    },

    deleteField: (state, action: { payload: string }) => {
      state.fields = state.fields.filter((f) => f.id !== action.payload)
      if (state.activeFieldId === action.payload) state.activeFieldId = null
      state.isDirty = true
    },

    duplicateField: (state, action: { payload: string }) => {
      const index = state.fields.findIndex((f) => f.id === action.payload)
      if (index === -1 || state.fields.length >= MAX_FIELDS_PER_FORM) return
      const copy: FormField = { ...state.fields[index], id: newFieldId() }
      state.fields.splice(index + 1, 0, copy)
      state.activeFieldId = copy.id
      state.isDirty = true
    },

    reorderFields: (
      state,
      action: { payload: { fromIndex: number; toIndex: number } },
    ) => {
      const { fromIndex, toIndex } = action.payload
      const [moved] = state.fields.splice(fromIndex, 1)
      state.fields.splice(toIndex, 0, moved)
      state.isDirty = true
    },

    selectField: (state, action: { payload: string | null }) => {
      state.activeFieldId = action.payload
    },

    // JSON import (Fields tab) — replaces the whole schema wholesale, same
    // as pasting a new form definition. Caller validates shape/limit first.
    setFields: (state, action: { payload: FormField[] }) => {
      state.fields = action.payload
      state.activeFieldId = null
      state.isDirty = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormForEdit.pending, (state) => {
        state.isLoading = true
        state.loadError = null
      })
      .addCase(fetchFormForEdit.fulfilled, (state, action) => {
        state.isLoading = false
        applyForm(state, action.payload)
        state.isDirty = false
        state.saveStatus = 'idle'
      })
      .addCase(fetchFormForEdit.rejected, (state, action) => {
        state.isLoading = false
        state.loadError =
          (action.payload as BuilderState['loadError']) || 'unknown'
      })

    builder
      .addCase(saveFormChanges.pending, (state) => {
        state.saveStatus = 'saving'
      })
      .addCase(saveFormChanges.fulfilled, (state, action) => {
        state.saveStatus = 'saved'
        state.isDirty = false
        state.status = action.payload.status
      })
      .addCase(saveFormChanges.rejected, (state) => {
        state.saveStatus = 'error'
      })

    builder
      .addCase(publishForm.fulfilled, (state, action) => {
        state.status = action.payload.status
      })
      .addCase(unpublishForm.fulfilled, (state, action) => {
        state.status = action.payload.status
      })
  },
})

export const {
  resetBuilder,
  setTitle,
  setDescription,
  addField,
  updateField,
  deleteField,
  duplicateField,
  reorderFields,
  selectField,
  setFields,
} = builderSlice.actions

export default builderSlice.reducer
