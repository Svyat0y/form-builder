import { FC, useState } from 'react'
import styles from './CreateFormPopup.module.scss'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

interface CreateFormPopupProps {
  onClose?: () => void
  onCreate?: (title: string) => void
}

export const CreateFormPopup: FC<CreateFormPopupProps> = ({
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onCreate?.(trimmed)
    onClose?.()
  }

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <h2 className={styles.title}>New form</h2>
      <Input
        type="form_name"
        id="form-title"
        label="Form name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter form name"
        autoFocus
      />
      <div className={styles.actions}>
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={!title.trim()}>
          Create
        </Button>
      </div>
    </form>
  )
}
