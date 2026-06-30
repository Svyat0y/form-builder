import { Session } from '@/features/auth/model'
import { formatTimeAgo } from '@/shared/lib/utils/dateHelpers'
import { parseUserAgent } from './parseUserAgent'
import { SessionItem } from '../types'

export const mapSession = (session: Session): SessionItem => {
  const { device, os, type } = parseUserAgent(session.deviceInfo)

  return {
    id: session.id,
    device,
    os,
    type,
    current: session.current,
    lastActive: session.current
      ? 'Active now'
      : `Last active ${formatTimeAgo(session.lastUsed)}`,
  }
}
