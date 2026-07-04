import { FC, useState } from 'react'
import styles from './BroadcastPanel.module.scss'
import { Input } from '@/shared/ui/input/Input'
import { adminApi } from '@/features/auth/model'
import { handleApiError, showSuccessAlert } from '@/features/auth/lib'
import { showSwalComponent } from '@/shared/lib/utils/sweetAlert'
import { BroadcastConfirmPopup } from './BroadcastConfirmPopup'

export const BroadcastPanel: FC = () => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [showLink, setShowLink] = useState(false)
  const [actionLabel, setActionLabel] = useState('')
  const [actionUrl, setActionUrl] = useState('')
  const [isSending, setIsSending] = useState(false)

  const canSend =
    title.trim().length > 0 && body.trim().length > 0 && !isSending

  const reset = () => {
    setTitle('')
    setBody('')
    setShowLink(false)
    setActionLabel('')
    setActionUrl('')
    setOpen(false)
  }

  const send = async () => {
    setIsSending(true)
    try {
      const response = await adminApi.broadcastNotification(
        title.trim(),
        body.trim(),
        actionLabel.trim() || undefined,
        actionUrl.trim() || undefined,
      )
      await showSuccessAlert(response.data.message)
      reset()
    } catch (error) {
      await handleApiError(error, 'Failed to send broadcast')
    } finally {
      setIsSending(false)
    }
  }

  const handleSendClick = () => {
    showSwalComponent(BroadcastConfirmPopup, { onConfirm: send })
  }

  return (
    <div className={styles.panel}>
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={() => setOpen((v) => !v)}
      >
        Message all users
      </button>

      {open && (
        <div className={styles.form}>
          <Input
            id="broadcast-title"
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Scheduled maintenance"
            autoFocus
          />

          <label className={styles.bodyLabel} htmlFor="broadcast-body">
            Message
          </label>
          <textarea
            id="broadcast-body"
            className={styles.bodyInput}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="We'll be down briefly this Sunday at 2am UTC."
            rows={3}
            maxLength={2000}
          />

          {showLink ? (
            <div className={styles.linkFields}>
              <Input
                id="broadcast-action-label"
                label="Link text"
                type="text"
                value={actionLabel}
                onChange={(e) => setActionLabel(e.target.value)}
                placeholder="Send feedback"
              />
              <Input
                id="broadcast-action-url"
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
            <button type="button" className={styles.cancelBtn} onClick={reset}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.sendBtn}
              disabled={!canSend}
              onClick={handleSendClick}
            >
              {isSending ? 'Sending…' : 'Send to everyone'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
