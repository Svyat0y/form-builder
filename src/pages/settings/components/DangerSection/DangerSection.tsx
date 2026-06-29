import { FC } from 'react'
import {
  showSwalComponent,
  showSimpleAlert,
} from '@/shared/lib/utils/sweetAlert'
import { SectionCard } from '../SectionCard/SectionCard'
import { TrashIcon } from '../icons'
import { DeleteAccountPopup } from './DeleteAccountPopup'
import styles from './DangerSection.module.scss'

export const DangerSection: FC = () => {
  const handleDelete = () => {
    showSwalComponent(DeleteAccountPopup, {
      onConfirm: () => {
        // TODO: DELETE /users/me, then log out
        showSimpleAlert(
          'info',
          'Not available yet',
          'Account deletion will be wired to the backend later.',
        )
      },
    })
  }

  return (
    <SectionCard
      danger
      title="Delete account"
      description="Permanently delete your account, forms and responses. This cannot be undone."
      headerAction={
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={handleDelete}
        >
          <TrashIcon />
          Delete
        </button>
      }
    />
  )
}
