import { FC, ReactNode } from 'react'
import styles from './PublicFormLayout.module.scss'

interface PublicFormLayoutProps {
  children: ReactNode
}

// Minimal shell for anonymous-facing pages: logo, no nav, no auth chrome.
// Shared by PublicForm, FormSuccess and FormClosed.
export const PublicFormLayout: FC<PublicFormLayoutProps> = ({ children }) => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>B</span>
          Builder
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  )
}
