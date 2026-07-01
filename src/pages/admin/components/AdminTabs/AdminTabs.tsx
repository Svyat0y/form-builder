import { FC, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './AdminTabs.module.scss'
import { AdminTabKey } from '../../types'

export interface AdminTabConfig {
  key: AdminTabKey
  label: string
  icon: ReactNode
}

interface AdminTabsProps {
  tabs: AdminTabConfig[]
  active: AdminTabKey
  onChange: (key: AdminTabKey) => void
}

export const AdminTabs: FC<AdminTabsProps> = ({ tabs, active, onChange }) => {
  return (
    <div className={styles.tabbar} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={active === tab.key}
          className={classNames(styles.tab, {
            [styles.tabActive]: active === tab.key,
          })}
          onClick={() => onChange(tab.key)}
        >
          <span className={styles.tabIcon}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
