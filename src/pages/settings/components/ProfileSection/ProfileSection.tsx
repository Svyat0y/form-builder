import { ChangeEvent, FC, FormEvent, useRef, useState } from 'react'
import { Input } from '@/shared/ui/input'
import { validateForm } from '@/features/auth/lib'
import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'
import { SectionCard } from '../SectionCard/SectionCard'
import { UploadIcon, TrashIcon } from '../icons'
import { profileSchema } from '../../settings.schemas'
import { SettingsUser } from '../../types'
import styles from './ProfileSection.module.scss'

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
  const [name, setName] = useState(user.name)
  const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null)
  const [nameError, setNameError] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errors = validateForm(profileSchema, { name })
    if (errors) {
      setNameError(errors.name)
      return
    }
    setNameError(undefined)
    // TODO: PATCH /users/me { name }
    showSimpleAlert('success', 'Saved', 'Your profile has been updated.')
  }

  const handlePickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // TODO: upload to backend; for now preview locally
    setAvatar(URL.createObjectURL(file))
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
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon />
            Upload
          </button>
          {avatar && (
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => setAvatar(null)}
            >
              <TrashIcon />
              Remove
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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
            <button type="submit" className={styles.saveBtn}>
              Save
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
