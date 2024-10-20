import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import App from './App';
//components
import { UserForm } from './pages/user-form';
import { FormBuilder } from './pages/form-builder';
import { Login } from './pages/auth/SignIn/Login';
import { WelcomePage } from './pages/welcome-page';
import { AuthProvider } from './context/AuthContext';

export const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<WelcomePage />} />
            <Route path="/form-builder" element={<FormBuilder />} />
            <Route path="/user-form" element={<UserForm />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};
