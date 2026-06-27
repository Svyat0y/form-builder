import { FC, useCallback, useState } from 'react'
import styles from './FormCard.module.scss'
import { Dropdown } from '@/shared/ui/dropdown'
import { FormItem, STATUS_LABELS } from '../../types'
import {
  DotsIcon,
  FileIcon,
  EditIcon,
  EyeIcon,
  LinkIcon,
  TrashIcon,
} from '../icons'

interface FormCardProps {
  form: FormItem
  onEdit: (id: string) => void
  onResponses: (id: string) => void
  onCopy: (id: string) => void
  onDelete: (id: string) => void
}

export const FormCard: FC<FormCardProps> = ({
  form,
  onEdit,
  onResponses,
  onCopy,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleToggle = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setMenuOpen((v) => !v)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <div className={`${styles.card} ${menuOpen ? styles.cardMenuOpen : ''}`}>
      <div className={styles.cardTop}>
        <span className={`${styles.badge} ${styles[`badge_${form.status}`]}`}>
          {STATUS_LABELS[form.status]}
        </span>

        <Dropdown
          isOpen={menuOpen}
          onToggle={handleToggle}
          onClose={close}
          trigger={
            <button className={styles.dotsBtn} aria-label="Form options">
              <DotsIcon />
            </button>
          }
        >
          <div className={styles.menu}>
            <button
              className={styles.menuItem}
              onClick={() => {
                onEdit(form.id)
                close()
              }}
            >
              <EditIcon /> Edit
            </button>
            <button
              className={styles.menuItem}
              onClick={() => {
                onResponses(form.id)
                close()
              }}
            >
              <EyeIcon /> View responses
            </button>
            <button
              className={styles.menuItem}
              onClick={() => {
                onCopy(form.id)
                close()
              }}
            >
              <LinkIcon /> Copy link
            </button>
            <div className={styles.menuDivider} />
            <button
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              onClick={() => {
                onDelete(form.id)
                close()
              }}
            >
              <TrashIcon /> Delete
            </button>
          </div>
        </Dropdown>
      </div>

      <h3 className={styles.cardTitle}>{form.title}</h3>

      <div className={styles.cardFooter}>
        <div className={styles.cardResponses}>
          <FileIcon />
          <span className={styles.cardResponseCount}>{form.responses}</span>
          <span>responses</span>
        </div>
        <div className={styles.cardDate}>Updated {form.updated}</div>
      </div>
    </div>
  )
}
