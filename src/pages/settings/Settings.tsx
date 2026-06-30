import { FC, useState } from 'react'
import styles from './Settings.module.scss'
import { Header } from '@/widgets/header'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { SettingsTabs, TabConfig } from './components/SettingsTabs/SettingsTabs'
import { ProfileSection } from './components/ProfileSection/ProfileSection'
import { SecuritySection } from './components/SecuritySection/SecuritySection'
import { NotificationsSection } from './components/NotificationsSection/NotificationsSection'
import { DangerSection } from './components/DangerSection/DangerSection'
import { UserIcon, LockIcon, BellIcon, AlertIcon } from './components/icons'
import { SettingsTabKey, SettingsUser } from './types'
import { MOCK_USER } from './mock/settings.mock'

const TABS: TabConfig[] = [
  { key: 'profile', label: 'Profile', icon: <UserIcon /> },
  { key: 'security', label: 'Security', icon: <LockIcon /> },
  { key: 'notifications', label: 'Notifications', icon: <BellIcon /> },
  { key: 'danger', label: 'Danger zone', icon: <AlertIcon /> },
]

export const Settings: FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<SettingsTabKey>('profile')

  // Prefer the authenticated user; fall back to mock until fully wired
  const settingsUser: SettingsUser = user
    ? { name: user?.name, email: user?.email, avatar: user?.avatar }
    : MOCK_USER

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>Settings</h1>

        <SettingsTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        <div className={styles.panel}>
          {activeTab === 'profile' && <ProfileSection user={settingsUser} />}
          {activeTab === 'security' && (
            <SecuritySection hasPassword={user?.hasPassword} />
          )}
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'danger' && <DangerSection />}
        </div>
      </main>
    </div>
  )
}
