import { FC } from 'react'
import styles from './Divider.module.scss'
import classNames from 'classnames'

interface IDividerProps {
  label?: string
  className?: string
}

export const Divider: FC<IDividerProps> = ({ label = '', className }) => {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <span>{label}</span>
    </div>
  )
}
