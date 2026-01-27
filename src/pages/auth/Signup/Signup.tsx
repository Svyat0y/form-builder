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
import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { register } from '@/features/auth/model'
import { ROUTES } from '@/shared/config/routes'
import { Card } from '@/pages/auth/components/Card'

export const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.auth)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password) {
      await showSimpleAlert('error', 'Error', 'All fields are required')
      return
    }

    const result = await dispatch(register({ name, email, password }))

    if (register.fulfilled.match(result)) {
      navigate('/signin')
    }
  }

  return (
    <Layout>
      <Container>
        <Card>
          <Title as="h1">Sign up</Title>
          <form className={styles.form} action="#">
            <Input
              id="name"
              label="Name"
              type="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              disabled={isLoading}
              variant="primary"
              onClick={handleSubmit}
            >
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
          >
            Sign in with Google
          </Button>
          <Button
            variant="secondary"
            icon={<Icons.Facebook width={24} height={24} />}
          >
            Sign in with Facebook
          </Button>
        </Card>
      </Container>
    </Layout>
  )
}
