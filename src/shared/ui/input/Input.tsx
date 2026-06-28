import { ChangeEvent, FC, MouseEvent, FocusEvent } from 'react'
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
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  error?: string
  success?: string
  disabled?: boolean
  autoFocus?: boolean
}

export const Input: FC<IInputProps> = ({
  id,
  label,
  type,
  autoComplete,
  className,
  isRightItemInLabel = '',
  handleClickRightLabel,
  value = '',
  onChange,
  onBlur,
  disabled,
  error,
  success,
  placeholder,
  autoFocus,
}) => {
  const hasMessage = !!error || !!success
  const message = error || success || ''
  const isError = !!error

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.labelWrapper}>
        <label htmlFor={id}>{label}</label>
        {!!isRightItemInLabel && (
          <button
            type="button"
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
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
        />
      </div>

      <span
        className={classNames(styles.helperText, {
          [styles.error]: isError,
          [styles.success]: !isError,
          [styles.visible]: hasMessage,
        })}
      >
        {message}
      </span>
    </div>
  )
}
