import { FC, useEffect, useState } from 'react'
import styles from './Sidebar.module.scss'
import { FieldType, FormField, FormStatus } from '@/features/forms/model'
import { SaveStatus } from '@/features/form-builder/model'
import { FieldPalette } from './FieldPalette'
import { FieldSettings } from './FieldSettings'
import { SaveBar } from './SaveBar'

export type SidebarTab = 'fields' | 'settings'

interface SidebarProps {
  activeField: FormField | null
  fieldsCount: number
  atLimit: boolean
  onAddField: (type: FieldType) => void
  onImportFields: (fields: FormField[]) => void
  onFieldChange: (patch: Partial<FormField>) => void
  saveStatus: SaveStatus
  onManualSave: () => void
  onPreview: () => void
  onPublishToggle: () => void
  status: FormStatus
  isPublishing: boolean
  // Set only when rendered inside the mobile full-screen drawer — the caller
  // decides which tab it opens on (Fields button vs. per-field edit pencil),
  // rather than us guessing from the currently active field.
  onClose?: () => void
  initialTab?: SidebarTab
}

export const Sidebar: FC<SidebarProps> = ({
  activeField,
  fieldsCount,
  atLimit,
  onAddField,
  onImportFields,
  onFieldChange,
  saveStatus,
  onManualSave,
  onPreview,
  onPublishToggle,
  status,
  isPublishing,
  onClose,
  initialTab,
}) => {
  const [activeTab, setTab] = useState<SidebarTab>(initialTab ?? 'fields')
  const isDrawer = !!onClose

  // Desktop only: the sidebar stays mounted permanently, so selecting a new
  // field on the canvas jumps it to Settings — the user can still click back
  // to Fields afterwards. The mobile drawer is explicit instead (Fields
  // button vs. per-field edit pencil decide the tab via `initialTab`), since
  // it remounts fresh each time and guessing from stale selection state was
  // the source of the "always lands on Settings" bug.
  useEffect(() => {
    if (isDrawer) return
    if (activeField) setTab('settings')
  }, [activeField?.id, isDrawer])

  return (
    <div className={`${styles.wrapper} ${onClose ? styles.wrapperDrawer : ''}`}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'fields' ? styles.tabActive : ''}`}
          onClick={() => setTab('fields')}
        >
          Fields
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'settings' ? styles.tabActive : ''}`}
          onClick={() => setTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className={styles.panel}>
        {activeTab === 'fields' ? (
          <FieldPalette
            onAdd={onAddField}
            onImport={onImportFields}
            disabled={atLimit}
          />
        ) : (
          <FieldSettings field={activeField} onChange={onFieldChange} />
        )}
      </div>

      <SaveBar
        saveStatus={saveStatus}
        onManualSave={onManualSave}
        onPreview={onPreview}
        onPublishToggle={onPublishToggle}
        status={status}
        fieldsCount={fieldsCount}
        isPublishing={isPublishing}
      />

      {onClose && (
        <button className={styles.closeDrawerBtn} onClick={onClose}>
          Close
        </button>
      )}
    </div>
  )
}
