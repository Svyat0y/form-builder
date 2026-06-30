import { FC, FormEvent, useEffect, useState } from 'react'
import { Input } from '@/shared/ui/input'
import { validateForm, handleApiError } from '@/features/auth/lib'
import { authApi, updateUser } from '@/features/auth/model'
import { useAppDispatch } from '@/shared/lib/hooks'
import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'
import { SectionCard } from '../SectionCard/SectionCard'
import { KeyIcon, LaptopIcon, MobileIcon } from '../icons'
import {
  passwordSchema,
  PasswordFields,
  setPasswordSchema,
  SetPasswordFields,
} from '../../settings.schemas'
import { SessionItem } from '../../types'
import { mapSession } from '../../lib/mapSession'
import styles from './SecuritySection.module.scss'

type PasswordErrors = Partial<Record<keyof PasswordFields, string>>
type SetPasswordErrors = Partial<Record<keyof SetPasswordFields, string>>

const emptyPassword: PasswordFields = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const emptySetPassword: SetPasswordFields = {
  newPassword: '',
  confirmPassword: '',
}

interface SecuritySectionProps {
  // false → social-only account (no local password); undefined → unknown, allow
  hasPassword?: boolean
}

export const SecuritySection: FC<SecuritySectionProps> = ({ hasPassword }) => {
  const dispatch = useAppDispatch()
  // Only hide the change-password flow when we know there is no local password
  const canChangePassword = hasPassword !== false
  const [isFormOpen, setFormOpen] = useState(false)
  const [fields, setFields] = useState<PasswordFields>(emptyPassword)
  const [errors, setErrors] = useState<PasswordErrors>({})
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  const [isSetFormOpen, setSetFormOpen] = useState(false)
  const [newPwFields, setNewPwFields] =
    useState<SetPasswordFields>(emptySetPassword)
  const [newPwErrors, setNewPwErrors] = useState<SetPasswordErrors>({})
  const [isSettingPassword, setIsSettingPassword] = useState(false)

  const [sessions, setSessions] = useState<SessionItem[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [isRevokingAll, setIsRevokingAll] = useState(false)

  useEffect(() => {
    let cancelled = false

    authApi
      .getSessions()
      .then((response) => {
        if (cancelled) return
        setSessions(response.data.map(mapSession))
      })
      .catch((error) => handleApiError(error, 'Failed to load sessions'))
      .finally(() => {
        if (!cancelled) setIsLoadingSessions(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const updateField = (key: keyof PasswordFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const updateSetField = (key: keyof SetPasswordFields, value: string) => {
    setNewPwFields((prev) => ({ ...prev, [key]: value }))
    if (newPwErrors[key])
      setNewPwErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSetSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm(setPasswordSchema, newPwFields)
    if (validationErrors) {
      setNewPwErrors(validationErrors)
      return
    }
    setNewPwErrors({})

    setIsSettingPassword(true)
    try {
      await authApi.setPassword(newPwFields.newPassword)
      dispatch(updateUser({ hasPassword: true }))
      setNewPwFields(emptySetPassword)
      setSetFormOpen(false)
      await showSimpleAlert(
        'success',
        'Password set',
        'You can now sign in with your email and password too.',
      )
    } catch (error) {
      await handleApiError(error, 'Failed to set password')
    } finally {
      setIsSettingPassword(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm(passwordSchema, fields)
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }
    setErrors({})

    setIsSavingPassword(true)
    try {
      await authApi.changePassword(fields.currentPassword, fields.newPassword)
      setFields(emptyPassword)
      setFormOpen(false)
      await showSimpleAlert(
        'success',
        'Password changed',
        'Your password has been updated.',
      )
    } catch (error) {
      await handleApiError(error, 'Failed to change password')
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleRevoke = async (id: string) => {
    setRevokingId(id)
    try {
      await authApi.revokeSession(id)
      setSessions((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      await handleApiError(error, 'Failed to revoke session')
    } finally {
      setRevokingId(null)
    }
  }

  const handleRevokeAll = async () => {
    setIsRevokingAll(true)
    try {
      await authApi.revokeOtherSessions()
      setSessions((prev) => prev.filter((s) => s.current))
    } catch (error) {
      await handleApiError(error, 'Failed to revoke other sessions')
    } finally {
      setIsRevokingAll(false)
    }
  }

  const hasOtherSessions = sessions.some((s) => !s.current)

  return (
    <>
      <SectionCard
        title="Password"
        description={
          canChangePassword
            ? 'Change the password you use to sign in.'
            : 'Add a password so you can also sign in with your email, not just Google.'
        }
      >
        {!canChangePassword ? (
          !isSetFormOpen ? (
            <button
              type="button"
              className={styles.changeBtn}
              onClick={() => setSetFormOpen(true)}
            >
              <KeyIcon />
              Set password
            </button>
          ) : (
            <form className={styles.form} onSubmit={handleSetSubmit}>
              <Input
                id="set-new-password"
                label="New password"
                type="password"
                autoComplete="new-password"
                value={newPwFields.newPassword}
                error={newPwErrors.newPassword}
                onChange={(e) => updateSetField('newPassword', e.target.value)}
              />
              <Input
                id="set-confirm-password"
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                value={newPwFields.confirmPassword}
                error={newPwErrors.confirmPassword}
                onChange={(e) =>
                  updateSetField('confirmPassword', e.target.value)
                }
              />
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setSetFormOpen(false)
                    setNewPwFields(emptySetPassword)
                    setNewPwErrors({})
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={isSettingPassword}
                >
                  {isSettingPassword ? 'Setting…' : 'Set password'}
                </button>
              </div>
            </form>
          )
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
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={isSavingPassword}
              >
                {isSavingPassword ? 'Updating…' : 'Update password'}
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
              disabled={isRevokingAll}
              onClick={handleRevokeAll}
            >
              {isRevokingAll ? 'Revoking…' : 'Revoke all others'}
            </button>
          )
        }
      >
        {isLoadingSessions ? (
          <p className={styles.sessionMeta}>Loading sessions…</p>
        ) : (
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
                    disabled={revokingId === session.id}
                    onClick={() => handleRevoke(session.id)}
                  >
                    {revokingId === session.id ? 'Revoking…' : 'Revoke'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </>
  )
}
