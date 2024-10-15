//components
import { Container } from '@components/Container';
//other
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="app">
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}

export default App;
