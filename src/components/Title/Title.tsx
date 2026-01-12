import { FC, ReactNode } from 'react'
import styles from './Title.module.scss'
import classNames from 'classnames'

interface ITitleProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: ReactNode
  className?: string
}

export const Title: FC<ITitleProps> = ({
  as: Tag = 'h1',
  children,
  className,
}) => {
  return (
    <Tag
      className={classNames(styles.title, className, {
        [styles.h1]: Tag === 'h1',
        [styles.h2]: Tag === 'h2',
        [styles.h3]: Tag === 'h3',
        [styles.h4]: Tag === 'h4',
        [styles.h5]: Tag === 'h5',
        [styles.h6]: Tag === 'h6',
      })}
    >
      {children}
    </Tag>
  )
}
