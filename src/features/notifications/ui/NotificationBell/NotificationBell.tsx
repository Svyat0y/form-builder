import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NotificationBell.module.scss'
import { Dropdown } from '@/shared/ui/dropdown'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import {
  fetchNotifications,
  markNotificationRead,
  notificationsMarkedReadLocally,
  removeNotification,
  removeAllNotifications,
} from '@/features/notifications/model'
import {
  groupNotifications,
  GroupRow,
  NotificationRow,
} from '@/features/notifications/lib/groupNotifications'
import { formatRelativeTime } from '@/features/notifications/lib/formatRelativeTime'
import { NotificationItem } from '@/features/notifications/model/types'

export const NotificationBell: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items, unreadCount } = useAppSelector((state) => state.notifications)

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<NotificationRow | null>(null)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  const rows = groupNotifications(items)

  const openRow = (row: NotificationRow) => {
    setSelected(row)
    if (row.kind === 'single') {
      if (!row.notification.readAt)
        dispatch(markNotificationRead(row.notification.id))
    } else {
      const unreadIds = row.notifications
        .filter((n) => !n.readAt)
        .map((n) => n.id)
      unreadIds.forEach((id) => dispatch(markNotificationRead(id)))
      dispatch(notificationsMarkedReadLocally(unreadIds))
    }
  }

  const goBack = () => setSelected(null)

  const handleAction = (url: string) => {
    setIsOpen(false)
    if (/^https?:\/\//.test(url)) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      navigate(url)
    }
  }

  const handleDeleteSingle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    dispatch(removeNotification(id))
  }

  const handleDeleteGroup = (e: React.MouseEvent, group: GroupRow) => {
    e.stopPropagation()
    group.notifications.forEach((n) => dispatch(removeNotification(n.id)))
  }

  const handleClearAll = () => {
    dispatch(removeAllNotifications())
    setSelected(null)
  }

  const renderSingleRow = (notification: NotificationItem) => (
    <div
      key={notification.id}
      className={styles.row}
      onClick={() => openRow({ kind: 'single', notification })}
    >
      <span className={styles.rowIcon}>
        <BellDotIcon />
      </span>
      <div className={styles.rowBody}>
        <div className={styles.rowTop}>
          <span
            className={styles.rowTitle}
            style={{ fontWeight: notification.readAt ? 400 : 500 }}
          >
            {notification.title}
          </span>
          <span className={styles.rowTime}>
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        {notification.body && (
          <div className={styles.rowSnippet}>{notification.body}</div>
        )}
      </div>
      {!notification.readAt && <span className={styles.unreadDot} />}
      <button
        type="button"
        className={styles.rowDeleteBtn}
        aria-label="Delete notification"
        onClick={(e) => handleDeleteSingle(e, notification.id)}
      >
        Clear
      </button>
    </div>
  )

  const renderGroupRow = (group: GroupRow) => {
    const latest = group.notifications[0]
    return (
      <div
        key={group.formId}
        className={styles.row}
        onClick={() => openRow(group)}
      >
        <span className={styles.rowIcon}>
          <FileIcon />
        </span>
        <div className={styles.rowBody}>
          <div className={styles.rowTop}>
            <span
              className={styles.rowTitle}
              style={{ fontWeight: group.unreadCount > 0 ? 500 : 400 }}
            >
              {latest.title}
            </span>
            <span className={styles.rowTime}>
              {formatRelativeTime(latest.createdAt)}
            </span>
          </div>
          <div className={styles.rowSnippet}>
            {group.notifications.length} response
            {group.notifications.length === 1 ? '' : 's'}
          </div>
        </div>
        {group.unreadCount > 0 && <span className={styles.unreadDot} />}
        <button
          type="button"
          className={styles.rowDeleteBtn}
          aria-label="Delete all notifications for this form"
          onClick={(e) => handleDeleteGroup(e, group)}
        >
          Clear
        </button>
      </div>
    )
  }

  const renderDetail = () => {
    if (!selected) return null

    if (selected.kind === 'single') {
      const n = selected.notification
      return (
        <>
          <div className={styles.detailTitle}>{n.title}</div>
          <div className={styles.detailTime}>
            {formatRelativeTime(n.createdAt)} ago
          </div>
          {n.body && <div className={styles.detailBody}>{n.body}</div>}
          {n.data.actionUrl && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => handleAction(n.data.actionUrl!)}
            >
              {n.data.actionLabel || 'Open'}
            </button>
          )}
        </>
      )
    }

    return (
      <>
        <div className={styles.detailTitle}>
          {selected.notifications[0].title}
        </div>
        {selected.notifications.map((n) => (
          <div key={n.id} className={styles.threadEntry}>
            <span>{formatRelativeTime(n.createdAt)} ago</span>
            <button
              type="button"
              className={styles.threadDeleteBtn}
              aria-label="Delete this notification"
              onClick={(e) => handleDeleteSingle(e, n.id)}
            >
              Clear
            </button>
          </div>
        ))}
      </>
    )
  }

  return (
    <Dropdown
      isOpen={isOpen}
      onToggle={() => {
        setIsOpen((v) => !v)
        setSelected(null)
      }}
      onClose={() => {
        setIsOpen(false)
        setSelected(null)
      }}
      trigger={
        <button
          className={styles.bellBtn}
          aria-label="Notifications"
          aria-expanded={isOpen}
        >
          <BellIcon />
          {unreadCount > 0 && <span className={styles.badgeDot} />}
        </button>
      }
    >
      <div className={styles.panel}>
        <div
          className={styles.track}
          style={{
            transform: selected ? 'translateX(-320px)' : 'translateX(0)',
          }}
        >
          <div className={styles.pane}>
            <div className={styles.header}>
              <span>Notifications</span>
              {rows.length > 0 && (
                <button
                  type="button"
                  className={styles.clearAllBtn}
                  onClick={handleClearAll}
                >
                  Clear all
                </button>
              )}
            </div>
            <div className={styles.rows}>
              {rows.length === 0 ? (
                <div className={styles.empty}>You&apos;re all caught up.</div>
              ) : (
                rows.map((row) =>
                  row.kind === 'single'
                    ? renderSingleRow(row.notification)
                    : renderGroupRow(row),
                )
              )}
            </div>
          </div>

          <div className={styles.pane}>
            <div className={styles.detailHeader}>
              <button type="button" className={styles.backBtn} onClick={goBack}>
                <ArrowLeftIcon /> Back
              </button>
              {selected?.kind === 'group' && (
                <button
                  type="button"
                  className={styles.viewResponsesBtn}
                  onClick={() =>
                    handleAction(`/forms/${selected.formId}/responses`)
                  }
                >
                  View responses
                </button>
              )}
            </div>
            <div className={styles.detail}>{renderDetail()}</div>
          </div>
        </div>
      </div>
    </Dropdown>
  )
}

const BellIcon: FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
)

const BellDotIcon: FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
)

const FileIcon: FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v5h5" />
  </svg>
)

const ArrowLeftIcon: FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)
