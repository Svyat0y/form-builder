import { FC } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styles from './FieldCard.module.scss'
import { FormField } from '@/features/forms/model'
import {
  FIELD_ICONS,
  GripIcon,
  CopyIcon,
  TrashIcon,
  PencilIcon,
} from '../icons'

interface FieldCardProps {
  field: FormField
  isActive: boolean
  onSelect: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  // Mobile only — jumps straight to this field's Settings in the drawer,
  // since there's no always-visible sidebar to show it in automatically.
  onEdit?: (id: string) => void
}

export const FieldCard: FC<FieldCardProps> = ({
  field,
  isActive,
  onSelect,
  onDuplicate,
  onDelete,
  onEdit,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id })

  const Icon = FIELD_ICONS[field.type]

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
      onClick={() => onSelect(field.id)}
    >
      <button
        className={styles.grip}
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripIcon />
      </button>

      <span className={styles.icon}>
        <Icon />
      </span>

      <span className={styles.label}>
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
      </span>

      <span className={styles.type}>{field.type}</span>

      {onEdit && (
        <button
          className={styles.actionBtn}
          aria-label="Edit question settings"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(field.id)
          }}
        >
          <PencilIcon />
        </button>
      )}

      <button
        className={styles.actionBtn}
        aria-label="Duplicate question"
        onClick={(e) => {
          e.stopPropagation()
          onDuplicate(field.id)
        }}
      >
        <CopyIcon />
      </button>

      <button
        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
        aria-label="Delete question"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(field.id)
        }}
      >
        <TrashIcon />
      </button>
    </div>
  )
}
