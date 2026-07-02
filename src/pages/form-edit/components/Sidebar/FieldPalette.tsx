import { FC } from 'react'
import styles from './Sidebar.module.scss'
import { FieldType } from '@/features/forms/model'
import { FIELD_TYPE_META } from '@/features/form-builder/model'
import { FIELD_ICONS } from '../icons'

interface FieldPaletteProps {
  onAdd: (type: FieldType) => void
  disabled: boolean
}

export const FieldPalette: FC<FieldPaletteProps> = ({ onAdd, disabled }) => {
  return (
    <div className={styles.palette}>
      {FIELD_TYPE_META.map((meta) => {
        const Icon = FIELD_ICONS[meta.type]
        const isDisabled = !meta.enabled || disabled
        return (
          <button
            key={meta.type}
            className={styles.paletteItem}
            disabled={isDisabled}
            title={
              !meta.enabled
                ? 'Скоро'
                : disabled
                  ? 'Достигнут лимит полей'
                  : undefined
            }
            onClick={() => meta.enabled && !disabled && onAdd(meta.type)}
          >
            <Icon />
            {meta.label}
            {!meta.enabled && <span className={styles.soonBadge}>Soon</span>}
          </button>
        )
      })}
    </div>
  )
}
