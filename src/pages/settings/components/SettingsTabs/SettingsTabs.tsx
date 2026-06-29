import { FC, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './SettingsTabs.module.scss'
import { SettingsTabKey } from '../../types'

export interface TabConfig {
  key: SettingsTabKey
  label: string
  icon: ReactNode
}

interface SettingsTabsProps {
  tabs: TabConfig[]
  active: SettingsTabKey
  onChange: (key: SettingsTabKey) => void
}

export const SettingsTabs: FC<SettingsTabsProps> = ({
  tabs,
  active,
  onChange,
}) => {
  return (
    <div className={styles.tabbar} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={active === tab.key}
          className={classNames(styles.tab, {
            [styles.tabActive]: active === tab.key,
            [styles.tabDanger]: tab.key === 'danger',
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
