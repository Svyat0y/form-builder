import { Outlet } from 'react-router-dom';
//components
import { Container } from '@components/Container';
import { Layout } from '@components/Layout';

function App() {
  return (
    <Layout>
      <Container>
        <Outlet />
      </Container>
    </Layout>
  );
}

export default App;
