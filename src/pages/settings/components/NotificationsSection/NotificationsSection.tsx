import { FC, useState } from 'react'
import { SectionCard } from '../SectionCard/SectionCard'
import { InfoIcon } from '../icons'
import styles from './NotificationsSection.module.scss'

export const NotificationsSection: FC = () => {
  const [enabled, setEnabled] = useState(true)

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
            // TODO: PATCH /users/me/notifications { newResponse }
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <span className={styles.track} />
        </label>
      </div>

      <p className={styles.note}>
        <InfoIcon />
        Depends on the forms/responses backend — wired once available.
      </p>
    </SectionCard>
  )
}
