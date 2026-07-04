import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react'
import styles from './EditableTitle.module.scss'
import { EditIcon } from '../icons'

interface EditableTitleProps {
  value: string
  onSave: (value: string) => void
  as?: 'h3' | 'span'
  className?: string
}

export const EditableTitle: FC<EditableTitleProps> = ({
  value,
  onSave,
  as: Tag = 'span',
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDraft(value)
    setIsEditing(true)
  }

  const commit = () => {
    const trimmed = draft.trim()
    setIsEditing(false)
    if (trimmed && trimmed !== value) {
      onSave(trimmed)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setDraft(value)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        className={`${styles.input} ${className}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        maxLength={120}
      />
    )
  }

  return (
    <Tag className={styles.wrap}>
      <span className={`${styles.text} ${className}`}>{value}</span>
      <button
        type="button"
        className={styles.editBtn}
        onClick={startEditing}
        aria-label="Rename"
        title="Rename"
      >
        <EditIcon />
      </button>
    </Tag>
  )
}
