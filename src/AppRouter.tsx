import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import App from './App';
//components
import { WelcomePage } from './pages/welcome-page';
import { UserForm } from './pages/user-form';
import { FormBuilder } from './pages/form-builder';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<WelcomePage />} />
          <Route path="/form-builder" element={<FormBuilder />} />
          <Route path="/user-form" element={<UserForm />} />
        </Route>
      </Routes>
    </Router>
  );
};
