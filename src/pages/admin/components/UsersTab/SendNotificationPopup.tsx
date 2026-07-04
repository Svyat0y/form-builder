import { FC, useState } from 'react'
import styles from './SendNotificationPopup.module.scss'
import { Input } from '@/shared/ui/input/Input'

interface SendNotificationPopupProps {
  userName: string
  onConfirm: (
    title: string,
    body: string,
    actionLabel?: string,
    actionUrl?: string,
  ) => void
  onClose?: () => void
}

export const SendNotificationPopup: FC<SendNotificationPopupProps> = ({
  userName,
  onConfirm,
  onClose,
}) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [showLink, setShowLink] = useState(false)
  const [actionLabel, setActionLabel] = useState('')
  const [actionUrl, setActionUrl] = useState('')

  const canSend = title.trim().length > 0 && body.trim().length > 0

  return (
    <div className={styles.popup}>
      <h2 className={styles.title}>Send notification to {userName}</h2>

      <Input
        id="notification-title"
        label="Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Heads up"
        autoFocus
      />

      <label className={styles.bodyLabel} htmlFor="notification-body">
        Message
      </label>
      <textarea
        id="notification-body"
        className={styles.bodyInput}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Your account was reviewed."
        rows={4}
        maxLength={2000}
      />

      {showLink ? (
        <div className={styles.linkFields}>
          <Input
            id="notification-action-label"
            label="Link text"
            type="text"
            value={actionLabel}
            onChange={(e) => setActionLabel(e.target.value)}
            placeholder="Send feedback"
          />
          <Input
            id="notification-action-url"
            label="Link URL"
            type="text"
            value={actionUrl}
            onChange={(e) => setActionUrl(e.target.value)}
            placeholder="/feedback"
          />
        </div>
      ) : (
        <button
          type="button"
          className={styles.addLinkBtn}
          onClick={() => setShowLink(true)}
        >
          Add a link
        </button>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.sendBtn}
          disabled={!canSend}
          onClick={() => {
            onConfirm(
              title.trim(),
              body.trim(),
              actionLabel.trim() || undefined,
              actionUrl.trim() || undefined,
            )
            onClose?.()
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
