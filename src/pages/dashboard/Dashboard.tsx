import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Dashboard.module.scss'
import { showSwalComponent } from '@/shared/lib/utils/sweetAlert'
import { CreateFormPopup } from '@/features/forms/ui/create-form-popup'
import { Header } from '@/widgets/header'
import { FormCard } from './components/FormCard'
import { FormList } from './components/FormList'
import { EmptyState } from './components/EmptyState'
import { GridIcon, ListIcon, PlusIcon } from './components/icons'
import { FormItem, ViewMode } from './types'
import { MOCK_FORMS } from './mock/forms.mock'

export const Dashboard: FC = () => {
  const navigate = useNavigate()

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [forms, setForms] = useState<FormItem[]>(MOCK_FORMS)

  const handleEditForm = (id: string) => navigate(`/form-builder/${id}`)
  const handleViewResponses = (id: string) => navigate(`/forms/${id}/responses`)
  const handleCopyLink = (id: string) =>
    navigator.clipboard.writeText(`${window.location.origin}/forms/${id}`)

  const handleDeleteForm = (id: string) => {
    // TODO: dispatch delete action to API
    setForms((prev) => prev.filter((f) => f.id !== id))
  }

  const handleCreateForm = () => {
    showSwalComponent(CreateFormPopup, {
      onCreate: (title: string) => {
        // TODO: replace with API call POST /forms { title, status: 'DRAFT' }
        const newForm: FormItem = {
          id: String(Date.now()),
          title,
          status: 'draft',
          responses: 0,
          updated: 'Just now',
        }
        setForms((prev) => [newForm, ...prev])
      },
    })
  }

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

        {hasForms && (
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

        {!hasForms && (
          <EmptyState
            onCreateForm={handleCreateForm}
            createBtnClassName={styles.createBtn}
          />
        )}
      </main>
    </div>
  )
}
