import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import App from './App';
//components
import { WelcomePage } from './pages/welcome-page';
import { UserForm } from './pages/user-form';
import { FormBuilder } from './pages/form-builder';
import SignIn from './pages/auth/SignIn/SignIn';
import { ProtectedRoute } from '@components/ProtectedRout';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/form-builder"
            element={
              <ProtectedRoute>
                <FormBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-form"
            element={
              <ProtectedRoute>
                <UserForm />
              </ProtectedRoute>
            }
          />
          <Route path={'/login'} element={<SignIn />} />
        </Route>
      </Routes>
    </Router>
  );
};
