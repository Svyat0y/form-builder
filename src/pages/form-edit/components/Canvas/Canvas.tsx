import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import styles from './Canvas.module.scss'
import { FormField } from '@/features/forms/model'
import { MAX_FIELDS_PER_FORM } from '@/features/form-builder/model'
import { FieldCard } from '../FieldCard'
import { PlusIcon, TextFieldIcon, PencilIcon } from '../icons'

interface TitleFieldProps {
  value: string
  onSave: (value: string) => void
}

const TitleField: FC<TitleFieldProps> = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const commit = () => {
    const trimmed = draft.trim()
    setIsEditing(false)
    if (trimmed && trimmed !== value) onSave(trimmed)
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
        className={styles.titleInput}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        maxLength={120}
      />
    )
  }

  return (
    <div className={styles.titleRow}>
      <h1 className={styles.title}>{value || 'Untitled form'}</h1>
      <button
        className={styles.editBtn}
        aria-label="Edit form title"
        onClick={() => {
          setDraft(value)
          setIsEditing(true)
        }}
      >
        <PencilIcon />
      </button>
    </div>
  )
}

interface DescriptionFieldProps {
  value: string
  onSave: (value: string) => void
}

const DescriptionField: FC<DescriptionFieldProps> = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const commit = () => {
    const trimmed = draft.trim()
    setIsEditing(false)
    if (trimmed !== value) onSave(trimmed)
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

  const startEditing = () => {
    setDraft(value)
    setIsEditing(true)
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        className={styles.descriptionInput}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        placeholder="Subtitle"
        maxLength={300}
      />
    )
  }

  if (!value) {
    return (
      <button className={styles.addSubtitleBtn} onClick={startEditing}>
        <PlusIcon />
        Add subtitle
      </button>
    )
  }

  return (
    <div className={styles.descriptionRow}>
      <p className={styles.description}>{value}</p>
      <button
        className={styles.editBtn}
        aria-label="Edit form subtitle"
        onClick={startEditing}
      >
        <PencilIcon />
      </button>
    </div>
  )
}

interface CanvasProps {
  title: string
  description: string
  fields: FormField[]
  activeFieldId: string | null
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onSelectField: (id: string) => void
  onDuplicateField: (id: string) => void
  onDeleteField: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onAddQuestion: () => void
  // Mobile only — there's no side palette, so "Fields" opens the drawer.
  onOpenFields?: () => void
  // Mobile only — opens the drawer straight to this field's Settings.
  onEditField?: (id: string) => void
}

export const Canvas: FC<CanvasProps> = ({
  title,
  description,
  fields,
  activeFieldId,
  onTitleChange,
  onDescriptionChange,
  onSelectField,
  onDuplicateField,
  onDeleteField,
  onReorder,
  onAddQuestion,
  onOpenFields,
  onEditField,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = fields.findIndex((f) => f.id === active.id)
    const toIndex = fields.findIndex((f) => f.id === over.id)
    if (fromIndex === -1 || toIndex === -1) return
    onReorder(fromIndex, toIndex)
  }

  const atLimit = fields.length >= MAX_FIELDS_PER_FORM

  return (
    <div className={styles.wrapper}>
      <TitleField value={title} onSave={onTitleChange} />
      <DescriptionField value={description} onSave={onDescriptionChange} />

      {fields.length === 0 ? (
        <div className={styles.empty}>
          No questions yet — click a field type in the sidebar or &quot;Add
          question&quot; below.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={styles.list}>
              {fields.map((field) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  isActive={field.id === activeFieldId}
                  onSelect={onSelectField}
                  onDuplicate={onDuplicateField}
                  onDelete={onDeleteField}
                  onEdit={onEditField}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className={styles.actionsRow}>
        <button
          className={styles.addBtn}
          onClick={onAddQuestion}
          disabled={atLimit}
          title={atLimit ? 'Достигнут лимит полей' : ''}
        >
          <PlusIcon />
          Add question
        </button>

        {onOpenFields && (
          <button className={styles.fieldsBtn} onClick={onOpenFields}>
            <TextFieldIcon />
            Fields
          </button>
        )}
      </div>
      <div className={styles.limitNote}>
        {fields.length} / {MAX_FIELDS_PER_FORM} fields
      </div>
    </div>
  )
}
