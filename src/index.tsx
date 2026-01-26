import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './shared/ui/styles/scss/_main.scss'
import { AppRouter } from '@/app/router'
import { ThemeProvider } from '@/app/providers'
import { Provider } from 'react-redux'
import { store } from '@/app/store'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <AppRouter />
        </Router>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
