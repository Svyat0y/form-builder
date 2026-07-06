import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './FormEditPage.module.scss'
import { Header } from '@/widgets/header'
import { ROUTES } from '@/shared/config/routes'
import {
  useAppDispatch,
  useAppSelector,
  useMediaQuery,
} from '@/shared/lib/hooks'
import {
  showSimpleAlert,
  showSwalComponent,
} from '@/shared/lib/utils/sweetAlert'
import { FieldType, FormField } from '@/features/forms/model'
import {
  addField,
  deleteField,
  duplicateField,
  fetchFormForEdit,
  publishForm,
  reorderFields,
  resetBuilder,
  saveFormChanges,
  selectField,
  setDescription,
  setFields,
  setTitle,
  unpublishForm,
  updateField,
} from '@/features/form-builder/model'
import { DeleteFieldPopup } from '@/features/form-builder/ui/delete-field-popup'
import { FormPageToolbar } from '@/widgets/form-page-toolbar'
import { Sidebar, SidebarTab } from './components/Sidebar'
import { Canvas } from './components/Canvas'
import { PreviewModal } from './components/PreviewModal'

const AUTOSAVE_DELAY_MS = 1500

export const FormEditPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const {
    formId,
    title,
    description,
    status,
    fields,
    activeFieldId,
    isDirty,
    saveStatus,
    isLoading,
    loadError,
  } = useAppSelector((state) => state.formBuilder)

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mobileSidebarTab, setMobileSidebarTab] = useState<SidebarTab>('fields')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const isFirstLoad = useRef(true)
  const autosaveTimer = useRef<ReturnType<typeof setTimeout>>()

  // Latest editor state, readable from unmount cleanup without re-running
  // the effect — used to flush a pending debounced save on SPA navigation
  // (beforeunload only covers tab close, not client-side route changes)
  const latest = useRef({ formId, title, description, fields, isDirty })
  latest.current = { formId, title, description, fields, isDirty }

  useEffect(() => {
    if (!id) return
    dispatch(fetchFormForEdit(id))
    return () => {
      const pending = latest.current
      if (pending.isDirty && pending.formId) {
        dispatch(
          saveFormChanges({
            id: pending.formId,
            title: pending.title,
            description: pending.description,
            fields: pending.fields,
          }),
        )
      }
      dispatch(resetBuilder())
    }
  }, [id, dispatch])

  useEffect(() => {
    if (!loadError) return
    const message =
      loadError === 'forbidden'
        ? 'You do not have access to this form.'
        : loadError === 'not-found'
          ? 'Form not found.'
          : 'Failed to load form.'
    showSimpleAlert('error', 'Error', message)
    navigate(ROUTES.dashboard)
  }, [loadError, navigate])

  // Autosave — debounce 1.5s after any change, skip the initial load.
  useEffect(() => {
    if (isFirstLoad.current) {
      if (!isLoading && formId) isFirstLoad.current = false
      return
    }
    if (!isDirty || !formId) return

    clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => {
      dispatch(saveFormChanges({ id: formId, title, description, fields }))
    }, AUTOSAVE_DELAY_MS)

    return () => clearTimeout(autosaveTimer.current)
  }, [title, description, fields, isDirty, formId, isLoading, dispatch])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const activeField = fields.find((f) => f.id === activeFieldId) || null
  const atLimit = fields.length >= 50

  const handleManualSave = () => {
    if (!formId) return
    clearTimeout(autosaveTimer.current)
    dispatch(saveFormChanges({ id: formId, title, description, fields }))
  }

  const handleAddField = (type: FieldType) => {
    dispatch(addField(type))
    setMobileSidebarOpen(false)
  }

  // "Fields" button — always opens the palette, regardless of any
  // previously selected field, so the user knows they're about to add one.
  const handleOpenFieldsDrawer = () => {
    setMobileSidebarTab('fields')
    setMobileSidebarOpen(true)
  }

  // Pencil on a field card — jumps straight to that field's Settings.
  const handleEditFieldMobile = (fieldId: string) => {
    dispatch(selectField(fieldId))
    setMobileSidebarTab('settings')
    setMobileSidebarOpen(true)
  }

  // Deleting the last field of a published form should pull it off ACTIVE —
  // an empty form can't legitimately stay live (Publish is disabled at 0
  // fields for the same reason, see docs/pages/form-editor.md decision #7).
  const deleteFieldAndMaybeUnpublish = (fieldId: string) => {
    dispatch(deleteField(fieldId))
    const remaining = fields.filter((f) => f.id !== fieldId).length
    if (remaining === 0 && status === 'ACTIVE' && formId) {
      dispatch(unpublishForm(formId))
      showSimpleAlert(
        'info',
        'Form unpublished',
        'The form had no questions left, so it was taken off ACTIVE.',
      )
    }
  }

  const handleDeleteField = (fieldId: string) => {
    const target = fields.find((f) => f.id === fieldId)
    showSwalComponent(DeleteFieldPopup, {
      fieldLabel: target?.label || 'this question',
      onConfirm: () => deleteFieldAndMaybeUnpublish(fieldId),
    })
  }

  const handlePublishToggle = async () => {
    if (!formId) return
    setIsPublishing(true)
    if (status === 'ACTIVE') {
      await dispatch(unpublishForm(formId))
    } else {
      await dispatch(publishForm(formId))
    }
    setIsPublishing(false)
  }

  // Shared between the persistent desktop sidebar and the mobile drawer —
  // the drawer additionally gets onClose/initialTab below.
  const sidebarProps = {
    activeField,
    fieldsCount: fields.length,
    atLimit,
    onAddField: handleAddField,
    onImportFields: (importedFields: FormField[]) =>
      dispatch(setFields(importedFields)),
    onFieldChange: (patch: Partial<FormField>) => {
      if (activeField) dispatch(updateField({ id: activeField.id, patch }))
    },
    saveStatus,
    onManualSave: handleManualSave,
    onPreview: () => setPreviewOpen(true),
    onPublishToggle: handlePublishToggle,
    status,
    isPublishing,
  }

  if (isLoading && !formId) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>Loading…</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Header />

      <FormPageToolbar
        active="edit"
        onBack={() => navigate(ROUTES.dashboard)}
        onNavigate={(tab) =>
          tab === 'responses' &&
          formId &&
          navigate(`/forms/${formId}/responses`)
        }
      />

      <div className={styles.body}>
        <Canvas
          title={title}
          description={description}
          fields={fields}
          activeFieldId={activeFieldId}
          onTitleChange={(value) => dispatch(setTitle(value))}
          onDescriptionChange={(value) => dispatch(setDescription(value))}
          onSelectField={(fieldId) => dispatch(selectField(fieldId))}
          onDuplicateField={(fieldId) => dispatch(duplicateField(fieldId))}
          onDeleteField={handleDeleteField}
          onReorder={(fromIndex, toIndex) =>
            dispatch(reorderFields({ fromIndex, toIndex }))
          }
          onAddQuestion={() => handleAddField('text')}
          onOpenFields={isDesktop ? undefined : handleOpenFieldsDrawer}
          onEditField={isDesktop ? undefined : handleEditFieldMobile}
        />

        {isDesktop && <Sidebar {...sidebarProps} />}
      </div>

      {!isDesktop && mobileSidebarOpen && (
        <div className={styles.drawerOverlay}>
          <div className={styles.drawer}>
            <Sidebar
              {...sidebarProps}
              onClose={() => setMobileSidebarOpen(false)}
              initialTab={mobileSidebarTab}
            />
          </div>
        </div>
      )}

      {previewOpen && (
        <PreviewModal
          title={title}
          description={description}
          fields={fields}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  )
}
