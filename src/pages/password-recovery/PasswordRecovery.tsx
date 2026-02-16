import { FormEvent, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import styles from './PasswordRecovery.module.scss'

import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Title } from '@/shared/ui/title'
import { Layout } from '@/shared/ui/layout'
import { Container } from '@/shared/ui/container'
import { Card } from '@/pages/auth/components/Card'
import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'
import { ROUTES } from '@/shared/config/routes'
import { authApi } from '@/features/auth/model'

const passwordSchema = z
  .string()
  .min(6, 'At least 6 characters')
  .max(16, 'Maximum 16 characters')
  .regex(/(?=.*[a-z])/, 'Needs a lowercase letter')
  .regex(/(?=.*[A-Z])/, 'Needs an uppercase letter')
  .regex(/(?=.*\d)/, 'Needs a number')

export const PasswordRecovery = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')

  const validatePassword = (value: string) => {
    const result = passwordSchema.safeParse(value)
    return result.success
      ? ''
      : result.error.issues[0]?.message || 'Invalid password'
  }

  const isPasswordValid = password.length > 0 && !validatePassword(password)

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setPasswordError(validatePassword(value))

    if (validatePassword(value)) {
      setConfirmError('')
    }
  }

  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value)

    if (isPasswordValid) {
      setConfirmError(
        value && value !== password ? 'Passwords do not match' : '',
      )
    } else {
      setConfirmError('')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const pwdError = validatePassword(password)
    setPasswordError(pwdError)

    if (pwdError || !token) {
      if (!token) showSimpleAlert('error', 'Error', 'Reset token is missing')
      return
    }

    const confError =
      confirmPassword !== password ? 'Passwords do not match' : ''
    setConfirmError(confError)

    if (confError) return

    setIsLoading(true)

    try {
      await authApi.resetPassword(token, password)
      setIsSuccess(true)
      setTimeout(() => navigate(ROUTES.signIn), 2200)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to reset password'
      showSimpleAlert('error', 'Error', msg)
      if (err.response?.status === 401) {
        setTimeout(() => navigate(ROUTES.signIn), 1800)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const canSubmit = () =>
    isPasswordValid && confirmPassword.length > 0 && !confirmError && !isLoading

  if (isSuccess) {
    return (
      <Layout>
        <Container>
          <Card>
            <div className={styles.success}>
              <Title as="h6">Password Reset Successful!</Title>
              <Button variant="primary" onClick={() => navigate(ROUTES.signIn)}>
                Go to Login
              </Button>
            </div>
          </Card>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container>
        <Card>
          <Title as="h4">Set new password</Title>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <Input
              id="new-password"
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              autoComplete="new-password"
              placeholder="Enter new password"
              error={passwordError}
            />

            <Input
              id="confirm-password"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => handleConfirmChange(e.target.value)}
              disabled={!isPasswordValid}
              autoComplete="new-password"
              placeholder={
                isPasswordValid
                  ? 'Re-enter password'
                  : 'Fix password above first'
              }
              error={confirmError}
              success={
                isPasswordValid &&
                confirmPassword &&
                confirmPassword === password
                  ? 'Passwords match'
                  : ''
              }
            />

            <Button
              type="submit"
              variant="primary"
              disabled={!canSubmit()}
              className={styles.submitBtn}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </Card>
      </Container>
    </Layout>
  )
}
