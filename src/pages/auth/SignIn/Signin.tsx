import { FormEvent, MouseEvent, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Signin.module.scss'
import { Icons } from '@/shared/ui/icons'
import { Input } from '@/shared/ui/input'
import { Checkbox } from '@/shared/ui/checkbox'
import { Divider } from '@/shared/ui/divider'
import { Title } from '@/shared/ui/title'
import { Button } from '@/shared/ui/button'
import { Layout } from '@/shared/ui/layout'
import { Container } from '@/shared/ui/container'
import { ForgotPassword } from '../components/ForgotPasword/ForgotPassword'
import { Card } from '../components/Card/Card'
import {
  onCallSwalWithComponent,
  showSimpleAlert,
} from '@/shared/lib/utils/sweetAlert'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { login } from '@/features/auth/model'
import { ROUTES } from '@/shared/config/routes'

export const Signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.auth)

  const rememberMeRef = useRef<HTMLInputElement>(null)

  const handleClickRightLabel = (e: MouseEvent) => {
    e.preventDefault()
    onCallSwalWithComponent(ForgotPassword)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      await showSimpleAlert('error', 'Error', 'All fields are required')
      return
    }

    await dispatch(
      login({
        email,
        password,
        rememberMe: rememberMeRef.current?.checked || false,
      }),
    )
  }

  return (
    <Layout>
      <Container>
        <Card>
          <Title as="h1">Sign in</Title>
          <form className={styles.form} action="#">
            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              isRightItemInLabel="Forgot your password?"
              handleClickRightLabel={handleClickRightLabel}
            />
            <Checkbox label="Remember me" ref={rememberMeRef} />
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Sign in
            </Button>

            <p className={styles.question}>
              Don&apos;t have an account?
              <span>
                <Link to={ROUTES.signUp}>Sign up</Link>
              </span>
            </p>
          </form>
          <Divider label="or" />
          <Button variant="secondary" icon={<Icons.Google />}>
            Sign in with Google
          </Button>
          <Button variant="secondary" icon={<Icons.Facebook />}>
            Sign in with Facebook
          </Button>
        </Card>
      </Container>
    </Layout>
  )
}
