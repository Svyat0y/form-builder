import { FC, FormEvent, useState } from 'react'
import { Input } from '@/shared/ui/input'
import { validateForm } from '@/features/auth/lib'
import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'
import { SectionCard } from '../SectionCard/SectionCard'
import { KeyIcon, LaptopIcon, MobileIcon, InfoIcon } from '../icons'
import { passwordSchema, PasswordFields } from '../../settings.schemas'
import { SessionItem } from '../../types'
import styles from './SecuritySection.module.scss'

type PasswordErrors = Partial<Record<keyof PasswordFields, string>>

const emptyPassword: PasswordFields = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

interface SecuritySectionProps {
  sessions: SessionItem[]
  // false → social-only account (no local password); undefined → unknown, allow
  hasPassword?: boolean
}

export const SecuritySection: FC<SecuritySectionProps> = ({
  sessions: initialSessions,
  hasPassword,
}) => {
  // Only hide the change-password flow when we know there is no local password
  const canChangePassword = hasPassword !== false
  const [isFormOpen, setFormOpen] = useState(false)
  const [fields, setFields] = useState<PasswordFields>(emptyPassword)
  const [errors, setErrors] = useState<PasswordErrors>({})
  const [sessions, setSessions] = useState(initialSessions)

  const updateField = (key: keyof PasswordFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm(passwordSchema, fields)
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    // TODO: PATCH /auth/password { currentPassword, newPassword }
    setFields(emptyPassword)
    setFormOpen(false)
    showSimpleAlert(
      'success',
      'Password changed',
      'Your password has been updated.',
    )
  }

  const handleRevoke = (id: string) => {
    // TODO: DELETE /sessions/:id
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  const handleRevokeAll = () => {
    // TODO: POST /sessions/revoke-others
    setSessions((prev) => prev.filter((s) => s.current))
  }

  const hasOtherSessions = sessions.some((s) => !s.current)

  return (
    <>
      <SectionCard
        title="Password"
        description={
          canChangePassword
            ? 'Change the password you use to sign in.'
            : 'How you sign in to your account.'
        }
      >
        {!canChangePassword ? (
          <p className={styles.providerNote}>
            <InfoIcon />
            You signed in with a social account, so there&apos;s no password to
            change here.
          </p>
        ) : !isFormOpen ? (
          <button
            type="button"
            className={styles.changeBtn}
            onClick={() => setFormOpen(true)}
          >
            <KeyIcon />
            Change password
          </button>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              id="current-password"
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={fields.currentPassword}
              error={errors.currentPassword}
              onChange={(e) => updateField('currentPassword', e.target.value)}
            />
            <Input
              id="new-password"
              label="New password"
              type="password"
              autoComplete="new-password"
              value={fields.newPassword}
              error={errors.newPassword}
              onChange={(e) => updateField('newPassword', e.target.value)}
            />
            <Input
              id="confirm-password"
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              value={fields.confirmPassword}
              error={errors.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
            />
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setFormOpen(false)
                  setFields(emptyPassword)
                  setErrors({})
                }}
              >
                Cancel
              </button>
              <button type="submit" className={styles.saveBtn}>
                Update password
              </button>
            </div>
          </form>
        )}
      </SectionCard>

      <SectionCard
        title="Active sessions"
        description="Devices currently signed in to your account."
        headerAction={
          hasOtherSessions && (
            <button
              type="button"
              className={styles.revokeAllBtn}
              onClick={handleRevokeAll}
            >
              Revoke all others
            </button>
          )
        }
      >
        <ul className={styles.sessionList}>
          {sessions.map((session) => (
            <li key={session.id} className={styles.session}>
              <span className={styles.sessionIcon}>
                {session.type === 'mobile' ? <MobileIcon /> : <LaptopIcon />}
              </span>
              <div className={styles.sessionInfo}>
                <p className={styles.sessionDevice}>
                  {session.device} · {session.os}
                  {session.current && (
                    <span className={styles.currentBadge}>This device</span>
                  )}
                </p>
                <p className={styles.sessionMeta}>{session.lastActive}</p>
              </div>
              {!session.current && (
                <button
                  type="button"
                  className={styles.revokeBtn}
                  onClick={() => handleRevoke(session.id)}
                >
                  Revoke
                </button>
              )}
            </li>
          ))}
        </ul>
      </SectionCard>
    </>
  )
}
