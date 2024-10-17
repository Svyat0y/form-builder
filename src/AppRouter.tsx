import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import App from './App';
//components
import { WelcomePage } from './pages/welcome-page';
import { UserForm } from './pages/user-form';
import { FormBuilder } from './pages/form-builder';
import { ProtectedRout } from '@components/ProtectedRout/ProtectedRout';
import SignIn from './pages/auth/SignIn/SignIn';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            index
            element={
              <ProtectedRout>
                <WelcomePage />
              </ProtectedRout>
            }
          />
          <Route
            path="/form-builder"
            element={
              <ProtectedRout>
                <FormBuilder />
              </ProtectedRout>
            }
          />
          <Route
            path="/user-form"
            element={
              <ProtectedRout>
                <UserForm />
              </ProtectedRout>
            }
          />
          <Route path={'/login'} element={<SignIn />} />
        </Route>
      </Routes>
    </Router>
  );
};
