import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ring } from 'react-spinners-css'
import styles from './Dashboard.module.scss'
import { showSwalComponent } from '@/shared/lib/utils/sweetAlert'
import { formatTimeAgo } from '@/shared/lib/utils/dateHelpers'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { SPINNER_COLOR } from '@/shared/config/constants'
import { CreateFormPopup } from '@/features/forms/ui/create-form-popup'
import {
  createForm,
  deleteForm,
  fetchForms,
  Form,
} from '@/features/forms/model'
import { Header } from '@/widgets/header'
import { FormCard } from './components/FormCard'
import { FormList } from './components/FormList'
import { EmptyState } from './components/EmptyState'
import { GridIcon, ListIcon, PlusIcon } from './components/icons'
import { FormItem, FormStatus, ViewMode } from './types'

const STATUS_MAP: Record<Form['status'], FormStatus> = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  CLOSED: 'closed',
}

const toFormItem = (form: Form): FormItem => ({
  id: form.id,
  title: form.title,
  status: STATUS_MAP[form.status],
  responses: form.responsesCount,
  updated: formatTimeAgo(form.updatedAt),
})

export const Dashboard: FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, isLoading } = useAppSelector((state) => state.forms)

  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  useEffect(() => {
    dispatch(fetchForms())
  }, [dispatch])

  const handleEditForm = (id: string) => navigate(`/form-builder/${id}`)
  const handleViewResponses = (id: string) => navigate(`/forms/${id}/responses`)
  const handleCopyLink = (id: string) =>
    navigator.clipboard.writeText(`${window.location.origin}/forms/${id}`)

  const handleDeleteForm = (id: string) => {
    dispatch(deleteForm(id))
  }

  const handleCreateForm = () => {
    showSwalComponent(CreateFormPopup, {
      onCreate: (title: string) => {
        dispatch(createForm({ title }))
      },
    })
  }

  const forms = items.map(toFormItem)
  const hasForms = forms.length > 0
  const countLabel = hasForms
    ? `${forms.length} form${forms.length !== 1 ? 's' : ''}`
    : ''

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            {countLabel && <p className={styles.subtitle}>{countLabel}</p>}
          </div>
          <button className={styles.createBtn} onClick={handleCreateForm}>
            <PlusIcon />
            Create Form
          </button>
        </div>

        {isLoading && items.length === 0 && (
          <div className={styles.loading}>
            <Ring color={SPINNER_COLOR} />
          </div>
        )}

        {!isLoading && hasForms && (
          <>
            <div className={styles.viewToggleRow}>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <GridIcon />
                </button>
                <button
                  className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <ListIcon />
                </button>
              </div>
            </div>

            {viewMode === 'grid' && (
              <div className={styles.grid}>
                {forms.map((form) => (
                  <FormCard
                    key={form.id}
                    form={form}
                    onEdit={handleEditForm}
                    onResponses={handleViewResponses}
                    onCopy={handleCopyLink}
                    onDelete={handleDeleteForm}
                  />
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <FormList
                forms={forms}
                onEdit={handleEditForm}
                onResponses={handleViewResponses}
                onCopy={handleCopyLink}
                onDelete={handleDeleteForm}
              />
            )}
          </>
        )}

        {!isLoading && !hasForms && (
          <EmptyState
            onCreateForm={handleCreateForm}
            createBtnClassName={styles.createBtn}
          />
        )}
      </main>
    </div>
  )
}
