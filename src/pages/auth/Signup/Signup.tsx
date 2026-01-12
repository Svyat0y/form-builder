import { Link } from 'react-router-dom'
import styles from './Signup.module.scss'
import { ROUTES } from '../../../routes/routes'
//components
import { Icons } from '@components/CustomIcons/CustomIcons'
import { Title } from '@components/Title'
import { Input } from '@components/formElements/Input'
import { Button } from '@components/ui/Button'
import { Divider } from '@components/Devider'
import { Layout } from '@components/Layout'
import { Container } from '@components/Container'
import { Card } from '../components/Card/Card'
import { FormEvent, useState } from 'react'
import { showSimpleAlert } from '../../../utils/sweetAlert'
import { useAuth } from '../../../context'

export const Signup = () => {
  const { register, isLoading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password) {
      await showSimpleAlert('error', 'Error', 'All fields are required')
      return
    }

    try {
      await register({ name, email, password })
    } catch (error) {
      console.error('Registration error:', error)
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
