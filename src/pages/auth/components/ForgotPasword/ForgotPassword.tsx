import { ChangeEvent, FC, useState } from 'react'
import styles from './ForgotPassword.module.scss'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

interface ForgotPasswordProps {
  onClose?: () => void
}

export const ForgotPassword: FC<ForgotPasswordProps> = ({ onClose }) => {
  const [state, setState] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value)
  }

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault()
    if (onClose) {
      setTimeout(() => onClose(), 2000)
    }
  }

  return (
    <form className={styles.wrapper} onSubmit={handleReset}>
      <h2 className={styles.title}>Reset password</h2>
      <Input
        id="password"
        label="Email"
        value={state}
        onChange={handleChange}
        type="email"
        placeholder="Email address"
      />
      <div className={styles.navigation}>
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Continue
        </Button>
      </div>
    </form>
  )
}
