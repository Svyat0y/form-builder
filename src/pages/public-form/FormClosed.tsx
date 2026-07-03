import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './PublicForm.module.scss'
import { PublicFormLayout } from './components/PublicFormLayout/PublicFormLayout'
import { ROUTES } from '@/shared/config/routes'

export const FormClosed: FC = () => {
  const navigate = useNavigate()

  return (
    <PublicFormLayout>
      <div className={styles.shell}>
        <div className={styles.statusIcon}>🔒</div>
        <h1 className={styles.statusTitle}>This form is not available</h1>
        <p className={styles.statusText}>
          The form you&apos;re looking for is closed or doesn&apos;t exist.
        </p>
        <button
          className={styles.linkBtn}
          onClick={() => navigate(ROUTES.home)}
        >
          ← Go to home
        </button>
      </div>
    </PublicFormLayout>
  )
}
