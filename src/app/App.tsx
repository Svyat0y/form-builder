import { Outlet } from 'react-router-dom'
import { Container } from '@/shared/ui/container'
import { Layout } from '@/shared/ui/layout'
import { useSessionHeartbeat } from '@/features/auth/model'

function App() {
  // Log out promptly if this session is revoked from another device.
  useSessionHeartbeat()

  return (
    <Layout>
      <Container>
        <Outlet />
      </Container>
    </Layout>
  )
}

export default App
