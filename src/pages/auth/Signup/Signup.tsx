import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Signup.module.scss'
import { Icons } from '@/shared/ui/icons'
import { Title } from '@/shared/ui/title'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Divider } from '@/shared/ui/divider'
import { Layout } from '@/shared/ui/layout'
import { Container } from '@/shared/ui/container'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { register } from '@/features/auth/model'
import {
  registerSchema,
  validateForm,
  FormErrors,
  RegisterFields,
} from '@/features/auth/lib'
import { ROUTES } from '@/shared/config/routes'
import { API_CONFIG } from '@/shared/api/api.constants'
import { Card } from '@/pages/auth/components/Card'

export const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors<RegisterFields>>({})
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.auth)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const fieldErrors = validateForm(registerSchema, { name, email, password })
    if (fieldErrors) {
      setErrors(fieldErrors)
      return
    }

    setErrors({})

    const result = await dispatch(register({ name, email, password }))

    if (register.fulfilled.match(result)) {
      navigate(ROUTES.signIn)
    }
  }

  return (
    <Layout>
      <Container>
        <Card>
          <Title as="h1">Sign up</Title>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              id="name"
              label="Name"
              type="text"
              autoComplete="name"
              value={name}
              error={errors.name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: undefined }))
              }}
            />
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
              autoComplete="new-password"
              value={password}
              error={errors.password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }))
              }}
            />
            <Button variant="primary" type="submit" disabled={isLoading}>
              Sign up
            </Button>

            <p className={styles.question}>
              Already have an account?
              <span>
                <Link to={ROUTES.signIn}>Sign in</Link>
              </span>
            </p>
          </form>
          <Divider label="or" />
          <Button
            variant="secondary"
            icon={<Icons.Google width={24} height={24} />}
            onClick={() => {
              window.location.href = API_CONFIG.OAUTH_GOOGLE_URL
            }}
          >
            Sign in with Google
          </Button>
        </Card>
      </Container>
    </Layout>
  )
}
