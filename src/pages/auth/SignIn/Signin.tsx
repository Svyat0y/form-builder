import { FormEvent, MouseEvent, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ring } from 'react-spinners-css'
import styles from './Signin.module.scss'
import { Icons } from '@/shared/ui/icons'
import { Input } from '@/shared/ui/input'
import { Checkbox } from '@/shared/ui/checkbox'
import { Divider } from '@/shared/ui/divider'
import { Title } from '@/shared/ui/title'
import { Button } from '@/shared/ui/button'
import { Layout } from '@/shared/ui/layout'
import { Container } from '@/shared/ui/container'
import { onCallSwalWithComponent } from '@/shared/lib/utils/sweetAlert'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { login } from '@/features/auth/model'
import {
  loginSchema,
  validateForm,
  FormErrors,
  LoginFields,
} from '@/features/auth/lib'
import { ROUTES } from '@/shared/config/routes'
import { API_CONFIG } from '@/shared/api/api.constants'
import { SPINNER_COLOR } from '@/shared/config/constants'
import { Card } from '@/pages/auth/components/Card'
import { ForgotPassword } from '@/pages/auth/components/ForgotPasword'

export const Signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors<LoginFields>>({})
  const [isRedirecting, setIsRedirecting] = useState(false)
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.auth)

  const rememberMeRef = useRef<HTMLInputElement>(null)

  const handleClickRightLabel = (e: MouseEvent) => {
    e.preventDefault()
    onCallSwalWithComponent(ForgotPassword)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const fieldErrors = validateForm(loginSchema, { email, password })
    if (fieldErrors) {
      setErrors(fieldErrors)
      return
    }

    setErrors({})

    const result = await dispatch(
      login({
        email,
        password,
        rememberMe: rememberMeRef.current?.checked || false,
      }),
    )

    if (login.fulfilled.match(result)) {
      setIsRedirecting(true)
    }
  }

  return (
    <>
      {isRedirecting && (
        <div className={styles.redirectOverlay}>
          <Ring color={SPINNER_COLOR} />
        </div>
      )}

      <Layout>
        <Container>
          <Card>
            <Title as="h1">Sign in</Title>
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                error={errors.email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }))
                }}
              />
              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                autoComplete="current-password"
                isRightItemInLabel="Forgot your password?"
                handleClickRightLabel={handleClickRightLabel}
                error={errors.password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: undefined }))
                }}
              />
              <Checkbox label="Remember me" ref={rememberMeRef} />
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                className={isLoading ? styles.btnLoading : undefined}
              >
                {isLoading ? (
                  <Ring color="currentColor" size={20} />
                ) : (
                  'Sign in'
                )}
              </Button>

              <p className={styles.question}>
                Don&apos;t have an account?
                <span>
                  <Link to={ROUTES.signUp}>Sign up</Link>
                </span>
              </p>
            </form>
            <Divider label="or" />
            <Button
              variant="secondary"
              icon={<Icons.Google />}
              onClick={() => {
                window.location.href = API_CONFIG.OAUTH_GOOGLE_URL
              }}
            >
              Sign in with Google
            </Button>
          </Card>
        </Container>
      </Layout>
    </>
  )
}
