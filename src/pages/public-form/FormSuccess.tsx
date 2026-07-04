import { FC } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import styles from './PublicForm.module.scss'
import { PublicFormLayout } from './components/PublicFormLayout/PublicFormLayout'
import { ROUTES } from '@/shared/config/routes'
import { clearSubmitted } from './lib/submittedGuard'

interface SuccessState {
  successMessage?: string
  allowMultipleResponses?: boolean
}

export const FormSuccess: FC = () => {
  const { uuid } = useParams<{ uuid: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as SuccessState) || {}

  const handleSubmitAnother = () => {
    if (!uuid) return
    clearSubmitted(uuid)
    navigate(ROUTES.publicForm.replace(':uuid', uuid))
  }

  return (
    <PublicFormLayout>
      <div className={styles.shell}>
        <div className={styles.statusIcon}>✅</div>
        <h1 className={styles.statusTitle}>Thank you!</h1>
        <p className={styles.statusText}>
          {state.successMessage || 'Your response has been submitted.'}
        </p>
        {state.allowMultipleResponses && (
          <button className={styles.linkBtn} onClick={handleSubmitAnother}>
            Submit another response
          </button>
        )}
      </div>
    </PublicFormLayout>
  )
}
