import { FC, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './AdminPanel.module.scss'
import { Header } from '@/widgets/header'
import { User } from '@/features/auth/model'
import { AdminTabs, AdminTabConfig } from './components/AdminTabs/AdminTabs'
import { UsersTab } from './components/UsersTab/UsersTab'
import { FormsTab } from './components/FormsTab/FormsTab'
import { FeedbackTab } from './components/FeedbackTab/FeedbackTab'
import { BroadcastPanel } from './components/BroadcastPanel/BroadcastPanel'
import { UsersIcon, FormsIcon, FeedbackIcon } from './components/icons'
import { AdminTabKey } from './types'

const TABS: AdminTabConfig[] = [
  { key: 'users', label: 'Users', icon: <UsersIcon /> },
  { key: 'forms', label: 'Forms', icon: <FormsIcon /> },
  { key: 'feedback', label: 'Feedback', icon: <FeedbackIcon /> },
]

export const AdminPanel: FC = () => {
  const location = useLocation()
  // FeedbackDetail navigates back here with { state: { tab: 'feedback' } }
  // so returning from a feedback entry lands back on the right tab.
  const initialTab =
    (location.state as { tab?: AdminTabKey } | null)?.tab ?? 'users'
  const [activeTab, setActiveTab] = useState<AdminTabKey>(initialTab)
  // Set via "View forms" for a specific user (from UsersTab). Persists across
  // tab switches within the session — switching to Users and back to Forms
  // keeps showing the same user's context until another "View forms" is used.
  const [formsTarget, setFormsTarget] = useState<{
    id: string
    name: string
  } | null>(null)

  const handleViewForms = (user: User) => {
    setFormsTarget({ id: user.id, name: user.name })
    setActiveTab('forms')
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>Admin Panel</h1>

        <BroadcastPanel />

        <AdminTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {activeTab === 'users' && <UsersTab onViewForms={handleViewForms} />}
        {activeTab === 'forms' && <FormsTab targetUser={formsTarget} />}
        {activeTab === 'feedback' && <FeedbackTab />}
      </main>
    </div>
  )
}
