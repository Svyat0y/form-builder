import { ChangeEvent, FC, FormEvent, useRef, useState } from 'react'
import { Input } from '@/shared/ui/input'
import { validateForm, handleApiError } from '@/features/auth/lib'
import { authApi, updateUser } from '@/features/auth/model'
import { useAppDispatch } from '@/shared/lib/hooks'
import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'
import { SectionCard } from '../SectionCard/SectionCard'
import { UploadIcon, TrashIcon } from '../icons'
import { profileSchema } from '../../settings.schemas'
import { SettingsUser } from '../../types'
import styles from './ProfileSection.module.scss'

const MAX_AVATAR_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_AVATAR_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

interface ProfileSectionProps {
  user: SettingsUser
}

export const ProfileSection: FC<ProfileSectionProps> = ({ user }) => {
  const dispatch = useAppDispatch()
  const [name, setName] = useState(user.name)
  const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null)
  const [nameError, setNameError] = useState<string>()
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errors = validateForm(profileSchema, { name })
    if (errors) {
      setNameError(errors.name)
      return
    }
    setNameError(undefined)

    setIsSaving(true)
    try {
      const response = await authApi.updateProfile(name)
      dispatch(updateUser({ name: response.data.name }))
      await showSimpleAlert(
        'success',
        'Saved',
        'Your profile has been updated.',
      )
    } catch (error) {
      await handleApiError(error, 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePickFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      await showSimpleAlert(
        'error',
        'Error',
        'Only JPEG, PNG, WEBP, or GIF images are allowed',
      )
      return
    }
    if (file.size > MAX_AVATAR_SIZE) {
      await showSimpleAlert('error', 'Error', 'Image must be smaller than 5MB')
      return
    }

    setIsUploadingAvatar(true)
    try {
      const response = await authApi.uploadAvatar(file)
      setAvatar(response.data.avatar)
      dispatch(updateUser({ avatar: response.data.avatar }))
    } catch (error) {
      await handleApiError(error, 'Failed to upload avatar')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true)
    try {
      await authApi.deleteAvatar()
      setAvatar(null)
      dispatch(updateUser({ avatar: null }))
    } catch (error) {
      await handleApiError(error, 'Failed to remove avatar')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    <SectionCard title="Profile" description="Update your name and avatar.">
      <div className={styles.avatarRow}>
        <div className={styles.avatar}>
          {avatar ? (
            <img src={avatar} alt="Avatar" />
          ) : (
            <span>{getInitials(name) || 'U'}</span>
          )}
        </div>
        <div className={styles.avatarActions}>
          <button
            type="button"
            className={styles.uploadBtn}
            disabled={isUploadingAvatar}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon />
            Upload
          </button>
          {avatar && (
            <button
              type="button"
              className={styles.removeBtn}
              disabled={isUploadingAvatar}
              onClick={handleRemoveAvatar}
            >
              <TrashIcon />
              Remove
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            onChange={handlePickFile}
          />
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldRow}>
          <Input
            id="profile-name"
            label="Name"
            type="text"
            value={name}
            error={nameError}
            onChange={(e) => {
              setName(e.target.value)
              if (nameError) setNameError(undefined)
            }}
          />
          <div className={styles.saveCol}>
            {/* Mirrors the Input label row so the button aligns with the box */}
            <span aria-hidden="true" className={styles.saveSpacer}>
              &nbsp;
            </span>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={isSaving}
            >
              {isSaving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        <div className={styles.emailField}>
          <Input
            id="profile-email"
            label="Email"
            type="email"
            value={user.email}
            disabled
          />
          <p className={styles.hint}>Email cannot be changed.</p>
        </div>
      </form>
    </SectionCard>
  )
}
