import { SessionItem, SettingsUser } from '../types'

// TODO: replace with real user from `state.auth` (useAuth)
export const MOCK_USER: SettingsUser = {
  name: 'John Doe',
  email: 'john@email.com',
  avatar: null,
}

// TODO: replace with GET /sessions
export const MOCK_SESSIONS: SessionItem[] = [
  {
    id: 's1',
    device: 'Chrome',
    os: 'macOS',
    lastActive: 'Active now',
    current: true,
    type: 'desktop',
  },
  {
    id: 's2',
    device: 'Safari',
    os: 'iPhone',
    lastActive: 'Last active 2 hours ago',
    current: false,
    type: 'mobile',
  },
  {
    id: 's3',
    device: 'Firefox',
    os: 'Windows',
    lastActive: 'Last active 3 days ago',
    current: false,
    type: 'desktop',
  },
]
