import { Outlet } from 'react-router-dom'
import { Container } from '@/shared/ui/container'
import { Layout } from '@/shared/ui/layout'

function App() {
  return (
    <Layout>
      <Container>
        <Outlet />
      </Container>
    </Layout>
  )
}

export default App
