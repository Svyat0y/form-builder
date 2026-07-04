import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import classNames from 'classnames'
import styles from './FeedbackDetail.module.scss'
import { Header } from '@/widgets/header'
import { ROUTES } from '@/shared/config/routes'
import {
  feedbackApi,
  Feedback,
  FeedbackStatus,
} from '@/features/feedback/model'
import { handleApiError, showSuccessAlert } from '@/features/auth/lib'
import { showSwalComponent } from '@/shared/lib/utils/sweetAlert'
import { DeleteFeedbackPopup } from './components/FeedbackTab/DeleteFeedbackPopup'

const STATUS_LABEL: Record<FeedbackStatus, string> = {
  NEW: 'New',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
}

const STATUS_ACTIONS: { status: FeedbackStatus; label: string }[] = [
  { status: 'NEW', label: 'Mark new' },
  { status: 'IN_PROGRESS', label: 'Mark in progress' },
  { status: 'RESOLVED', label: 'Mark resolved' },
]

export const FeedbackDetail: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    feedbackApi
      .getById(id)
      .then((response) => setFeedback(response.data))
      .catch((error) => {
        handleApiError(error, 'Failed to load feedback')
        navigate(ROUTES.admin, { state: { tab: 'feedback' } })
      })
      .finally(() => setIsLoading(false))
  }, [id, navigate])

  const handleSetStatus = async (status: FeedbackStatus) => {
    if (!id) return
    try {
      const response = await feedbackApi.updateStatus(id, status)
      setFeedback(response.data)
    } catch (error) {
      await handleApiError(error, 'Failed to update status')
    }
  }

  const handleDelete = () => {
    if (!id) return
    showSwalComponent(DeleteFeedbackPopup, {
      onConfirm: async () => {
        try {
          await feedbackApi.remove(id)
          await showSuccessAlert('Feedback deleted')
          navigate(ROUTES.admin, { state: { tab: 'feedback' } })
        } catch (error) {
          await handleApiError(error, 'Failed to delete feedback')
        }
      },
    })
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <button
          type="button"
          className={styles.backLink}
          onClick={() => navigate(ROUTES.admin, { state: { tab: 'feedback' } })}
        >
          ← Back to feedback
        </button>

        {isLoading ? (
          <div className={styles.empty}>Loading…</div>
        ) : !feedback ? (
          <div className={styles.empty}>Feedback not found.</div>
        ) : (
          <div className={styles.card}>
            <div className={styles.headerRow}>
              <div>
                <div className={styles.fromName}>
                  {feedback.user?.name || 'Unknown user'}
                </div>
                <div className={styles.fromEmail}>{feedback.user?.email}</div>
              </div>
              <span
                className={classNames(
                  styles.badge,
                  styles[`badge_${feedback.status}`],
                )}
              >
                {STATUS_LABEL[feedback.status]}
              </span>
            </div>

            <div className={styles.meta}>
              Submitted {new Date(feedback.createdAt).toLocaleString()}
              {feedback.handledByUser && feedback.status !== 'NEW' && (
                <> · handled by {feedback.handledByUser.name}</>
              )}
            </div>

            <p className={styles.message}>{feedback.message}</p>

            <div className={styles.actions}>
              {STATUS_ACTIONS.filter((a) => a.status !== feedback.status).map(
                (a) => (
                  <button
                    key={a.status}
                    type="button"
                    className={styles.statusBtn}
                    onClick={() => handleSetStatus(a.status)}
                  >
                    {a.label}
                  </button>
                ),
              )}
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
