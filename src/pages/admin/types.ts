// Local types for the Admin Panel page

export type AdminTabKey = 'users' | 'forms'

export interface AdminTab {
  key: AdminTabKey
  label: string
}

// UI shape for a session row in the "manage sessions" popup
export interface AdminSessionItem {
  id: string
  device: string
  os: string
  lastActive: string
  type: 'desktop' | 'mobile'
}
