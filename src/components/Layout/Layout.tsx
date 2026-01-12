import { ReactNode } from 'react'
import styles from './Layout.module.scss'

export const Layout = ({ children }: { children: ReactNode }) => {
  return <div className={styles.wrapper}>{children}</div>
}
