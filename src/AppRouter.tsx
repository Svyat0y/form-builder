import React from 'react';
import { Route, Routes } from 'react-router-dom';
import App from './App';
import { ROUTES } from './routes/routes';
//components
import { UserForm } from './pages/user-form';
import { FormBuilder } from './pages/form-builder';
import { WelcomePage } from './pages/welcome-page';
import { Signup } from './pages/auth/Signup';
import { Signin } from './pages/auth/SignIn';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<App />}>
        <Route index element={<WelcomePage />} />
        <Route path={ROUTES.formBuilder} element={<FormBuilder />} />
        <Route path={ROUTES.userForm} element={<UserForm />} />
      </Route>
      <Route path={ROUTES.signUp} element={<Signup />} />
      <Route path={ROUTES.signIn} element={<Signin />} />
    </Routes>
  );
};
