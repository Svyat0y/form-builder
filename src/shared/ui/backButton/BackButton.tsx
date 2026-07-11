import { FC } from 'react'
import styles from './BackButton.module.scss'
import { ArrowLeftIcon } from '@/shared/ui/backButton/icons'
import classNames from 'classnames'

interface BackButtonProps {
  labelBtn: string
  onBack: () => void
  className?: string
}

export const BackButton: FC<BackButtonProps> = ({
  labelBtn,
  onBack,
  className,
}) => {
  return (
    <button
      className={classNames(styles.wrapper, className && styles[className])}
      onClick={onBack}
    >
      <ArrowLeftIcon />
      <span>{labelBtn}</span>
    </button>
  )
}
