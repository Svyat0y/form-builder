import { FC } from 'react'
import styles from './Burger.module.scss'
import classNames from 'classnames'
import { useOpen } from '@/shared/lib/hooks'

export const Burger: FC = () => {
  const { isOpen, onToggle } = useOpen()

  const handleClickBurger = () => {
    onToggle()
  }

  return (
    <div
      className={classNames(styles.wrapper, { [styles.active]: isOpen })}
      onClick={handleClickBurger}
    >
      <div
        className={classNames(styles.line, { [styles.active]: isOpen })}
      ></div>
      <div
        className={classNames(styles.line, { [styles.active]: isOpen })}
      ></div>
      <div
        className={classNames(styles.line, { [styles.active]: isOpen })}
      ></div>
    </div>
  )
}
