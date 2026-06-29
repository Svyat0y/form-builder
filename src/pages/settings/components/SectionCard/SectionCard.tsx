import { FC, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './SectionCard.module.scss'

interface SectionCardProps {
  title: string
  description?: string
  children?: ReactNode
  // Optional element rendered on the right of the header (e.g. an action)
  headerAction?: ReactNode
  danger?: boolean
  className?: string
}

export const SectionCard: FC<SectionCardProps> = ({
  title,
  description,
  children,
  headerAction,
  danger,
  className,
}) => {
  return (
    <section
      className={classNames(
        styles.card,
        { [styles.cardDanger]: danger },
        className,
      )}
    >
      <div className={styles.header}>
        <div>
          <h2
            className={classNames(styles.title, {
              [styles.titleDanger]: danger,
            })}
          >
            {title}
          </h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {headerAction}
      </div>
      {children}
    </section>
  )
}
