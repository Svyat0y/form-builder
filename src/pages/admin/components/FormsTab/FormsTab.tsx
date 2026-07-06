import { FC, useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './FormsTab.module.scss'
import { Form, formsApi } from '@/features/forms/model'
import { DeleteFormPopup } from '@/features/forms/ui/delete-form-popup'
import { handleApiError, showSuccessAlert } from '@/features/auth/lib'
import { showSwalComponent } from '@/shared/lib/utils/sweetAlert'
import { useDebouncedValue } from '@/shared/lib/hooks'
import { formatTimeAgo } from '@/shared/lib/utils/dateHelpers'
import { FormPreviewPopup } from './FormPreviewPopup'
import { UnpublishFormPopup } from './UnpublishFormPopup'
import {
  FormsIcon,
  SearchIcon,
  EyeIcon,
  EyeOffIcon,
  PublishIcon,
  TrashIcon,
} from '../icons'

const PAGE_SIZE = 20

interface FormsTabProps {
  // Set when navigated here via "View forms" on a specific user (from
  // UsersTab) — the tab has no meaning without a target, admins browse one
  // user's forms at a time, not a global list across every user.
  targetUser?: { id: string; name: string } | null
}

export const FormsTab: FC<FormsTabProps> = ({ targetUser }) => {
  const [forms, setForms] = useState<Form[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const debouncedSearch = useDebouncedValue(search, 300)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
    setSearch('')
  }, [targetUser?.id])

  useEffect(() => {
    if (!targetUser) return
    let cancelled = false
    setIsLoading(true)

    formsApi.admin
      .listForUser(targetUser.id, {
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
      })
      .then((response) => {
        if (cancelled) return
        setForms(response.data.items)
        setTotal(response.data.total)
      })
      .catch((error) => handleApiError(error, 'Failed to load forms'))
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [targetUser, page, debouncedSearch])

  const handlePreview = (form: Form) => {
    showSwalComponent(FormPreviewPopup, { form }, { width: '760px' })
  }

  const handlePublish = async (form: Form) => {
    setBusyId(form.id)
    try {
      await formsApi.admin.publish(form.id)
      setForms((prev) =>
        prev.map((f) => (f.id === form.id ? { ...f, status: 'ACTIVE' } : f)),
      )
      await showSuccessAlert(`"${form.title}" has been published`)
    } catch (error) {
      await handleApiError(error, 'Failed to publish form')
    } finally {
      setBusyId(null)
    }
  }

  // Taking someone else's form offline by mistake (misclick on the crossed-
  // out eye icon) used to be a single, unconfirmed click — worth a popup
  // even though Publish can now undo it.
  const handleUnpublish = (form: Form) => {
    showSwalComponent(UnpublishFormPopup, {
      formTitle: form.title,
      onConfirm: async () => {
        setBusyId(form.id)
        try {
          await formsApi.admin.unpublish(form.id)
          setForms((prev) =>
            prev.map((f) =>
              f.id === form.id ? { ...f, status: 'CLOSED' } : f,
            ),
          )
          await showSuccessAlert(`"${form.title}" has been unpublished`)
        } catch (error) {
          await handleApiError(error, 'Failed to unpublish form')
        } finally {
          setBusyId(null)
        }
      },
    })
  }

  const handleDelete = (form: Form) => {
    showSwalComponent(DeleteFormPopup, {
      formTitle: form.title,
      onConfirm: async () => {
        try {
          await formsApi.admin.remove(form.id)
          setForms((prev) => prev.filter((f) => f.id !== form.id))
          setTotal((prev) => Math.max(0, prev - 1))
          await showSuccessAlert(`"${form.title}" has been deleted`)
        } catch (error) {
          await handleApiError(error, 'Failed to delete form')
        }
      },
    })
  }

  if (!targetUser) {
    return (
      <div className={styles.empty}>
        <div className={styles.icon}>
          <FormsIcon />
        </div>
        <h2 className={styles.title}>Select a user to browse their forms</h2>
        <p className={styles.text}>
          Open the Users tab, click the ⋮ menu on a user and choose &quot;View
          forms&quot; to preview, unpublish or delete their forms here.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>Forms for {targetUser.name}</h2>
        <div className={styles.search}>
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
          <input
            className={styles.searchInput}
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.wrap}>
        <div className={styles.table}>
          <div className={styles.header}>
            <div>Form</div>
            <div>Status</div>
            <div>Responses</div>
            <div>Last updated</div>
            <div />
          </div>

          {isLoading ? (
            <div className={styles.emptyRow}>Loading forms…</div>
          ) : forms.length === 0 ? (
            <div className={styles.emptyRow}>
              {debouncedSearch
                ? `No forms match "${debouncedSearch}".`
                : `${targetUser.name} has no forms yet.`}
            </div>
          ) : (
            forms.map((form) => (
              <div key={form.id} className={styles.row}>
                <div className={styles.name}>{form.title}</div>
                <div>
                  <span
                    className={classNames(
                      styles.badge,
                      styles[`badge_${form.status}`],
                    )}
                  >
                    {form.status}
                  </span>
                </div>
                <div className={styles.meta}>{form.responsesCount}</div>
                <div className={styles.meta}>
                  {formatTimeAgo(form.updatedAt)}
                </div>
                <div className={styles.actionsCell}>
                  <button
                    className={styles.actionBtn}
                    aria-label="Preview form"
                    title="Preview"
                    onClick={() => handlePreview(form)}
                  >
                    <EyeIcon />
                  </button>
                  {form.status === 'ACTIVE' ? (
                    <button
                      className={styles.actionBtn}
                      aria-label="Unpublish form"
                      title="Unpublish"
                      disabled={busyId === form.id}
                      onClick={() => handleUnpublish(form)}
                    >
                      <EyeOffIcon />
                    </button>
                  ) : (
                    <button
                      className={styles.actionBtn}
                      aria-label="Publish form"
                      title="Publish"
                      disabled={busyId === form.id || form.fields.length === 0}
                      onClick={() => handlePublish(form)}
                    >
                      <PublishIcon />
                    </button>
                  )}
                  <button
                    className={classNames(
                      styles.actionBtn,
                      styles.actionBtnDanger,
                    )}
                    aria-label="Delete form"
                    title="Delete"
                    onClick={() => handleDelete(form)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={classNames(styles.pageBtn, {
                [styles.pageBtnActive]: n === page,
              })}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
