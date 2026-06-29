// Local types for the Settings page

export type SettingsTabKey = 'profile' | 'security' | 'notifications' | 'danger'

export interface SettingsTab {
  key: SettingsTabKey
  label: string
}

export interface SettingsUser {
  name: string
  email: string
  avatar?: string | null
}

// UI shape for an active session row (backend `Session` is mapped to this)
export interface SessionItem {
  id: string
  device: string
  os: string
  lastActive: string
  current: boolean
  type: 'desktop' | 'mobile'
}
