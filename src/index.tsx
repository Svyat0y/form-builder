import React from 'react';
import ReactDOM from 'react-dom/client';
//styles
import './styles/scss/_main.scss';
//other
import { AppRouter } from './AppRouter';
import { ThemeProvider } from './context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
