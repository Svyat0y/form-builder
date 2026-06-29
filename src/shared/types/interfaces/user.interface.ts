export interface IUser {
  id: string
  email: string
  name: string
  createdAt: string
  role?: string
  avatar?: string | null
  // false for social-only accounts (Google/Facebook) with no local password
  hasPassword?: boolean
}
