import { FC } from 'react';
import styles from './Input.module.scss';
import classNames from 'classnames';

interface IInputProps {
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
  className?: string;
  isRightItemInLabel?: string;
}

export const Input: FC<IInputProps> = ({
  id,
  label,
  type,
  autoComplete,
  isRightItemInLabel = '',
  className,
}) => {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.labelWrapper}>
        <label htmlFor={id}>{label}</label>
        {!!isRightItemInLabel && (
          <button className={styles.rightItemInLabel}>
            Forgot your password?
          </button>
        )}
      </div>
      <div className={styles.inputWrapper}>
        <input id={id} type={type} autoComplete={autoComplete} />
      </div>
      <span className={styles.helperText}></span>
    </div>
  );
};
