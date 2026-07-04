import { FC, useState } from 'react'
import styles from './Feedback.module.scss'
import { Header } from '@/widgets/header'
import { Button } from '@/shared/ui/button/Button'
import { feedbackApi } from '@/features/feedback/model'
import { handleApiError, showSuccessAlert } from '@/features/auth/lib'

export const Feedback: FC = () => {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = message.trim().length > 0 && !isSubmitting

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await feedbackApi.submit(message.trim())
      setMessage('')
      await showSuccessAlert('Thanks — your feedback has been sent.')
    } catch (error) {
      await handleApiError(error, 'Failed to send feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>Feedback</h1>
        <p className={styles.subtitle}>
          Tell us what&apos;s working, what&apos;s not, or what you&apos;d like
          to see. Bug reports are welcome too.
        </p>

        <textarea
          className={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          rows={8}
          maxLength={3000}
        />

        <div className={styles.actions}>
          <Button
            variant="primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Sending…' : 'Send feedback'}
          </Button>
        </div>
      </main>
    </div>
  )
}
