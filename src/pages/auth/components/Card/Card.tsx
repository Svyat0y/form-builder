import { FC, ReactNode } from 'react'
import styles from './Card.module.scss'
import { SwitchTheme } from '@/shared/ui/switch-theme'

interface CardProps {
  children: ReactNode
}

export const Card: FC<CardProps> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <SwitchTheme />
      <div className={styles.card}>{children}</div>
    </div>
  )
}
