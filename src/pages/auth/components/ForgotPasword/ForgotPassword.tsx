import { ChangeEvent, FC, FormEvent, useState } from 'react'
import styles from './ForgotPassword.module.scss'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { authApi } from '@/features/auth/model'

interface ForgotPasswordProps {
  onClose?: () => void
}

const validateEmail = (value: string) => {
  if (!value) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return 'Please enter a valid email'
  return ''
}

export const ForgotPassword: FC<ForgotPasswordProps> = ({ onClose }) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailError(validateEmail(e.target.value))
    setServerError('')
  }

  const handleReset = async (e: FormEvent) => {
    e.preventDefault()

    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      return
    }

    setIsLoading(true)
    setServerError('')

    try {
      await authApi.forgotPassword(email)
      setIsSuccess(true)
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Check your email</h2>
        <p className={styles.successText}>
          If <strong>{email}</strong> is registered, you will receive a password
          reset link shortly. The link expires in 1 hour.
        </p>
        <div className={styles.navigation}>
          <Button variant="primary" type="button" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form className={styles.wrapper} onSubmit={handleReset}>
      <h2 className={styles.title}>Reset password</h2>
      <Input
        id="email"
        label="Email"
        value={email}
        onChange={handleChange}
        type="email"
        placeholder="Email address"
        error={emailError || serverError}
      />
      <div className={styles.navigation}>
        <Button
          variant="secondary"
          type="button"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Continue'}
        </Button>
      </div>
    </form>
  )
}
