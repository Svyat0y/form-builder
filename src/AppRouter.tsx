import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import App from './App';
//components
import { FormBuilder } from './pages/form-builder/FormBuilder';
import { WelcomePage } from './pages/welcome-page/WelcomePage';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<WelcomePage />} />
          <Route path="/form-builder" element={<FormBuilder />} />
        </Route>
      </Routes>
    </Router>
  );
};