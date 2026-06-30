import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { showSwalComponent } from '@/shared/lib/utils/sweetAlert'
import { authApi, clearCredentials } from '@/features/auth/model'
import { handleApiError } from '@/features/auth/lib'
import { useAppDispatch } from '@/shared/lib/hooks'
import { ROUTES } from '@/shared/config/routes'
import { SectionCard } from '../SectionCard/SectionCard'
import { TrashIcon } from '../icons'
import { DeleteAccountPopup } from './DeleteAccountPopup'
import styles from './DangerSection.module.scss'

export const DangerSection: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleDelete = () => {
    showSwalComponent(DeleteAccountPopup, {
      onConfirm: async () => {
        try {
          await authApi.deleteAccount()
          dispatch(clearCredentials())
          navigate(ROUTES.signIn)
        } catch (error) {
          await handleApiError(error, 'Failed to delete account')
        }
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
