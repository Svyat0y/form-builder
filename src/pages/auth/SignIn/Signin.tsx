import { FormEvent, MouseEvent, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Signin.module.scss'
//components
import { Icons } from '@components/CustomIcons/CustomIcons'
import { Input } from '@components/formElements/Input'
import { Checkbox } from '@components/formElements/checkbox'
import { Divider } from '@components/Devider'
import { Title } from '@components/Title'
import { Button } from '@components/ui/Button'
import { Layout } from '@components/Layout'
import { Container } from '@components/Container'
import { ForgotPassword } from '../components/ForgotPasword/ForgotPassword'
import { Card } from '../components/Card/Card'
//utils
import { onCallSwalWithComponent, showSimpleAlert } from '@utils/sweetAlert'
//store
import { useAppDispatch } from '@store/hooks/useAppDispatch'
import { useAppSelector } from '@store/hooks/useAppSelector'
import { login } from '@store/features/auth/authSlice'
//routes
import { ROUTES } from '@routes/routes'

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
