import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ring } from 'react-spinners-css'
import styles from './Dashboard.module.scss'
import { showSwalComponent } from '@/shared/lib/utils/sweetAlert'
import { formatTimeAgo } from '@/shared/lib/utils/dateHelpers'
import {
  useAppDispatch,
  useAppSelector,
  useDebouncedValue,
} from '@/shared/lib/hooks'
import { SPINNER_COLOR, STORAGE_KEYS } from '@/shared/config/constants'
import { CreateFormPopup } from '@/features/forms/ui/create-form-popup'
import {
  createForm,
  deleteForm,
  fetchForms,
  updateForm,
  Form,
} from '@/features/forms/model'
import { Header } from '@/widgets/header'
import { FormCard } from './components/FormCard'
import { FormList } from './components/FormList'
import { EmptyState } from './components/EmptyState'
import { GridIcon, ListIcon, PlusIcon, SearchIcon } from './components/icons'
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
  const { items, total, page, limit, hasMore, isLoading, isLoadingMore } =
    useAppSelector((state) => state.forms)

  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.DASHBOARD_VIEW_MODE)
    return stored === 'grid' || stored === 'list' ? stored : 'grid'
  })
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 350)

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode)
    localStorage.setItem(STORAGE_KEYS.DASHBOARD_VIEW_MODE, mode)
  }

  // Any change to the debounced search term starts over at page 1.
  useEffect(() => {
    dispatch(
      fetchForms({ page: 1, limit, search: debouncedSearch || undefined }),
    )
  }, [dispatch, debouncedSearch, limit])

  // A plain useRef sentinel misses its target: this effect would run once on
  // mount, find the div not yet rendered (still behind the isLoading gate)
  // and bail out, with nothing to re-trigger it once the div appears. A
  // state-backed callback ref makes the node itself a dependency, so the
  // observer (re)attaches whenever the sentinel mounts or unmounts.
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null)
  const loadMoreState = useRef({
    hasMore,
    isLoading,
    isLoadingMore,
    items,
    limit,
    debouncedSearch,
  })
  loadMoreState.current = {
    hasMore,
    isLoading,
    isLoadingMore,
    items,
    limit,
    debouncedSearch,
  }

  useEffect(() => {
    if (!sentinelNode) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const current = loadMoreState.current
        if (current.isLoading || current.isLoadingMore || !current.hasMore)
          return
        const nextPage = Math.floor(current.items.length / current.limit) + 1
        dispatch(
          fetchForms({
            page: nextPage,
            limit: current.limit,
            search: current.debouncedSearch || undefined,
          }),
        )
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinelNode)
    return () => observer.disconnect()
  }, [dispatch, sentinelNode])

  const handleEditForm = (id: string) => navigate(`/forms/${id}/edit`)
  const handleViewResponses = (id: string) => navigate(`/forms/${id}/responses`)
  const handleCopyLink = (id: string) =>
    navigator.clipboard.writeText(`${window.location.origin}/forms/${id}`)

  const handleDeleteForm = (id: string) => {
    dispatch(deleteForm(id))
  }

  const handleRenameForm = (id: string, title: string) => {
    dispatch(updateForm({ id, payload: { title } }))
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
  const isSearching = debouncedSearch.trim().length > 0
  const countLabel = total > 0 ? `${total} form${total !== 1 ? 's' : ''}` : ''

  // page > 0 means at least one fetch has resolved. Everything below this
  // point — search box, view toggle — mounts once and stays mounted from
  // then on; only the results area under it swaps between spinner / empty
  // state / grid / list as isLoading and isLoadingMore change. Nesting the
  // search input itself inside an `!isLoading` check unmounts and remounts
  // it on every search-triggered refetch, which drops focus mid-keystroke.
  const hasLoadedOnce = page > 0

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

        {!hasLoadedOnce && isLoading && (
          <div className={styles.loading}>
            <Ring color={SPINNER_COLOR} />
          </div>
        )}

        {hasLoadedOnce && (
          <>
            <div className={styles.viewToggleRow}>
              <label className={styles.searchBox}>
                <SearchIcon />
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="Search forms by title"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>

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

            {isLoading ? (
              <div className={styles.loading}>
                <Ring color={SPINNER_COLOR} />
              </div>
            ) : !hasForms ? (
              isSearching ? (
                <p className={styles.noResults}>
                  No forms match &quot;{debouncedSearch}&quot;.
                </p>
              ) : (
                <EmptyState
                  onCreateForm={handleCreateForm}
                  createBtnClassName={styles.createBtn}
                />
              )
            ) : (
              <>
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
                        onRename={handleRenameForm}
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
                    onRename={handleRenameForm}
                  />
                )}

                <div ref={setSentinelNode} className={styles.sentinel} />
                {isLoadingMore && (
                  <div className={styles.loadingMore}>
                    <Ring color={SPINNER_COLOR} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
