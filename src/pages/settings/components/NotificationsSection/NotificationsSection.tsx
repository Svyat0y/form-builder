import { FC, useState } from 'react'
import { authApi, updateUser } from '@/features/auth/model'
import { useAppDispatch } from '@/shared/lib/hooks'
import { handleApiError } from '@/features/auth/lib'
import { SectionCard } from '../SectionCard/SectionCard'
import styles from './NotificationsSection.module.scss'

interface NotificationsSectionProps {
  emailOnResponse?: boolean
}

export const NotificationsSection: FC<NotificationsSectionProps> = ({
  emailOnResponse,
}) => {
  const dispatch = useAppDispatch()
  const [enabled, setEnabled] = useState(emailOnResponse ?? true)
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = async (checked: boolean) => {
    const previous = enabled
    setEnabled(checked)
    setIsSaving(true)
    try {
      const response = await authApi.updateNotificationPrefs(checked)
      dispatch(updateUser({ emailOnResponse: response.data.emailOnResponse }))
    } catch (error) {
      setEnabled(previous)
      await handleApiError(error, 'Failed to update notification preferences')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SectionCard
      title="Notifications"
      description="Choose what we email you about."
    >
      <div className={styles.row}>
        <div>
          <p className={styles.rowTitle}>New response emails</p>
          <p className={styles.rowDesc}>
            Email me when one of my forms receives a new response.
          </p>
        </div>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={enabled}
            disabled={isSaving}
            onChange={(e) => handleToggle(e.target.checked)}
          />
          <span className={styles.track} />
        </label>
      </div>
    </SectionCard>
  )
}
