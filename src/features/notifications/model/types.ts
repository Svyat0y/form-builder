export type NotificationType = 'FORM_RESPONSE' | 'ADMIN_MESSAGE' | 'SYSTEM'

export interface NotificationData {
  formId?: string
  responseId?: string
  fromUserId?: string
  actionLabel?: string
  actionUrl?: string
}

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  body: string | null
  data: NotificationData
  readAt: string | null
  createdAt: string
}

export interface PaginatedNotifications {
  items: NotificationItem[]
  total: number
  page: number
  limit: number
  unreadCount: number
}
