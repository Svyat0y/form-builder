import { NotificationItem } from '../model/types'

export interface SingleRow {
  kind: 'single'
  notification: NotificationItem
}

export interface GroupRow {
  kind: 'group'
  formId: string
  notifications: NotificationItem[]
  unreadCount: number
}

export type NotificationRow = SingleRow | GroupRow

// Collapses every FORM_RESPONSE notification sharing a formId into a single
// row (regardless of interleaving with other notification types) so a form
// getting several responses in a row doesn't flood the list — the group's
// row sits at the position of its most recent member. See the confirmed
// mockup: opening a group swipes into a feed of its individual entries.
export function groupNotifications(
  items: NotificationItem[],
): NotificationRow[] {
  const rows: NotificationRow[] = []
  const groupsByFormId = new Map<string, GroupRow>()

  for (const item of items) {
    const formId = item.type === 'FORM_RESPONSE' ? item.data.formId : undefined

    if (formId) {
      let group = groupsByFormId.get(formId)
      if (!group) {
        group = { kind: 'group', formId, notifications: [], unreadCount: 0 }
        groupsByFormId.set(formId, group)
        rows.push(group)
      }
      group.notifications.push(item)
      if (!item.readAt) group.unreadCount += 1
    } else {
      rows.push({ kind: 'single', notification: item })
    }
  }

  return rows
}
