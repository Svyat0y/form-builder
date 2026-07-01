import { AdminSession } from '@/features/auth/model'
import { formatTimeAgo } from '@/shared/lib/utils/dateHelpers'
import { parseUserAgent } from '@/pages/settings/lib/parseUserAgent'
import { AdminSessionItem } from '../types'

export const mapAdminSession = (session: AdminSession): AdminSessionItem => {
  const { device, os, type } = parseUserAgent(session.deviceInfo)

  return {
    id: session.id,
    device,
    os,
    type,
    lastActive: `Last active ${formatTimeAgo(session.lastUsed)}`,
  }
}
