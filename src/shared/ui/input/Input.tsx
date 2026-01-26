import { ChangeEvent, FC, MouseEvent } from 'react'
import styles from './Input.module.scss'
import classNames from 'classnames'

interface IInputProps {
  id: string
  label: string
  type: string
  autoComplete?: string
  className?: string
  isRightItemInLabel?: string
  handleClickRightLabel?: (e: MouseEvent<HTMLButtonElement>) => void
  placeholder?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const Input: FC<IInputProps> = ({
  id,
  label,
  type,
  autoComplete,
  isRightItemInLabel = '',
  className,
  handleClickRightLabel,
  value = '',
  onChange,
  placeholder,
}) => {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.labelWrapper}>
        <label htmlFor={id}>{label}</label>
        {!!isRightItemInLabel && (
          <button
            onClick={handleClickRightLabel}
            className={styles.rightItemInLabel}
          >
            Forgot your password?
          </button>
        )}
      </div>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
      <span className={styles.helperText}></span>
    </div>
  )
}
