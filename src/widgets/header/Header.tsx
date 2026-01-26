import { FC } from 'react'
import styles from './Header.module.scss'
import { Burger } from '@/shared/ui/burger'

export const Header: FC = () => {
  return (
    <header className={styles.wrapper}>
      <div className={styles.logo}>Builder</div>
      <div className={styles.navigation}>
        <Burger />
      </div>
    </header>
  )
}
