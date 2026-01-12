import { FC } from 'react'
import styles from './Header.module.scss'
//components
import { Burger } from '@components/ui/Burger'

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
