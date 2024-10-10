import React from 'react';
//components
import { Container } from './components/Container/Container';
import { Header } from './components/Header/Header';
//other
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="app">
      <Container>
        <Header />
        <Outlet />
      </Container>
    </div>
  );
}

export default App;
