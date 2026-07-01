import { FC } from 'react'
import styles from './FormsTab.module.scss'
import { FormsIcon } from '../icons'

interface FormsTabProps {
  // Set when navigated here via "View forms" on a specific user (from
  // UsersTab) — lets the placeholder simulate the future targeted view.
  targetUser?: { id: string; name: string } | null
}

// Placeholder — the forms/responses backend module doesn't exist yet.
// Layout: browse a user's forms, unpublish/delete them, preview (read-only).
export const FormsTab: FC<FormsTabProps> = ({ targetUser }) => {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>
        <FormsIcon />
      </div>
      <h2 className={styles.title}>
        {targetUser
          ? `Forms for ${targetUser.name}`
          : 'Forms management is coming soon'}
      </h2>
      <p className={styles.text}>
        Once the forms backend ships, admins will be able to browse
        {targetUser ? ` ${targetUser.name}'s` : ' any user’s'} forms here,
        unpublish or delete them, and preview them read-only.
      </p>
    </div>
  )
}
