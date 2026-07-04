import { FC, useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './FeedbackTab.module.scss'
import {
  feedbackApi,
  Feedback,
  FeedbackStatus,
} from '@/features/feedback/model'
import { handleApiError, showSuccessAlert } from '@/features/auth/lib'
import { showSwalComponent } from '@/shared/lib/utils/sweetAlert'
import { FeedbackActionsPopup } from './FeedbackActionsPopup'
import { DotsIcon } from '../icons'

const STATUS_LABEL: Record<FeedbackStatus, string> = {
  NEW: 'New',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
}

export const FeedbackTab: FC = () => {
  const [items, setItems] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC')

  const load = async (sortOrder: 'ASC' | 'DESC') => {
    setIsLoading(true)
    try {
      const response = await feedbackApi.list({ sort: sortOrder, limit: 100 })
      setItems(response.data.items)
    } catch (error) {
      await handleApiError(error, 'Failed to load feedback')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load(sort)
  }, [sort])

  const handleSetStatus = async (id: string, status: FeedbackStatus) => {
    try {
      const response = await feedbackApi.updateStatus(id, status)
      setItems((prev) => prev.map((f) => (f.id === id ? response.data : f)))
    } catch (error) {
      await handleApiError(error, 'Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await feedbackApi.remove(id)
      setItems((prev) => prev.filter((f) => f.id !== id))
      await showSuccessAlert('Feedback deleted')
    } catch (error) {
      await handleApiError(error, 'Failed to delete feedback')
    }
  }

  const handleOpenActions = (entry: Feedback) => {
    showSwalComponent(FeedbackActionsPopup, {
      status: entry.status,
      onSetStatus: (status) => handleSetStatus(entry.id, status),
      onDelete: () => handleDelete(entry.id),
    })
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <button
          className={styles.sortBtn}
          onClick={() => setSort((s) => (s === 'DESC' ? 'ASC' : 'DESC'))}
        >
          Date {sort === 'DESC' ? '↓ newest' : '↑ oldest'}
        </button>
      </div>

      <div className={styles.wrap}>
        <div className={styles.table}>
          <div className={styles.header}>
            <div>From</div>
            <div>Message</div>
            <div>Status</div>
            <div>Date</div>
            <div />
          </div>

          {isLoading ? (
            <div className={styles.empty}>Loading feedback…</div>
          ) : items.length === 0 ? (
            <div className={styles.empty}>No feedback yet.</div>
          ) : (
            items.map((entry) => (
              <div key={entry.id} className={styles.row}>
                <div className={styles.from}>
                  <div className={styles.fromName}>
                    {entry.user?.name || 'Unknown user'}
                  </div>
                  <div className={styles.fromEmail}>{entry.user?.email}</div>
                </div>
                <div className={styles.message}>{entry.message}</div>
                <div>
                  <span
                    className={classNames(
                      styles.badge,
                      styles[`badge_${entry.status}`],
                    )}
                  >
                    {STATUS_LABEL[entry.status]}
                  </span>
                  {entry.handledByUser && entry.status !== 'NEW' && (
                    <div className={styles.handledBy}>
                      by {entry.handledByUser.name}
                    </div>
                  )}
                </div>
                <div className={styles.date}>
                  {new Date(entry.createdAt).toLocaleDateString()}
                </div>
                <div className={styles.actionsCell}>
                  <button
                    className={styles.dotsBtn}
                    aria-label="Feedback options"
                    onClick={() => handleOpenActions(entry)}
                  >
                    <DotsIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
