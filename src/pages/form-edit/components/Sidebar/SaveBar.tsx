import { FC } from 'react'
import styles from './Sidebar.module.scss'
import { SaveStatus } from '@/features/form-builder/model'
import { FormStatus } from '@/features/forms/model'
import { CheckIcon, LoaderIcon, AlertIcon, EyeIcon } from '../icons'

interface SaveBarProps {
  saveStatus: SaveStatus
  onManualSave: () => void
  onPreview: () => void
  onPublishToggle: () => void
  status: FormStatus
  fieldsCount: number
  isPublishing: boolean
}

export const SaveBar: FC<SaveBarProps> = ({
  saveStatus,
  onManualSave,
  onPreview,
  onPublishToggle,
  status,
  fieldsCount,
  isPublishing,
}) => {
  const isActive = status === 'ACTIVE'
  // Unpublishing never needs fields — only *publishing* an empty form is
  // blocked (see docs/pages/form-editor.md decision #7).
  const publishDisabled = (!isActive && fieldsCount === 0) || isPublishing

  return (
    <div className={styles.saveBar}>
      <div className={styles.saveStatusRow}>
        <span className={styles.saveStatus}>
          {saveStatus === 'saving' && (
            <>
              <LoaderIcon /> Saving…
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <CheckIcon /> Saved
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <AlertIcon /> Error saving
            </>
          )}
          {saveStatus === 'idle' && 'Not saved yet'}
        </span>
        <button className={styles.saveNowBtn} onClick={onManualSave}>
          Save now
        </button>
      </div>

      <button className={styles.previewBtn} onClick={onPreview}>
        <EyeIcon /> Preview
      </button>

      <button
        className={`${styles.publishBtn} ${isActive ? styles.publishBtnActive : ''}`}
        disabled={publishDisabled}
        title={
          !isActive && fieldsCount === 0
            ? 'Добавьте хотя бы одно поле, чтобы опубликовать'
            : ''
        }
        onClick={onPublishToggle}
      >
        {isActive ? 'Unpublish' : 'Publish'}
      </button>
    </div>
  )
}
