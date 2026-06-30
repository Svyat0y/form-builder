import { SettingsUser } from '../types'

// Fallback while the authenticated user is still loading
export const MOCK_USER: SettingsUser = {
  name: 'John Doe',
  email: 'john@email.com',
  avatar: null,
}
