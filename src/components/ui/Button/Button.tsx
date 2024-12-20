import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  icon?: ReactNode;
  variant: 'primary' | 'secondary';
}

export const Button: FC<IButtonProps> = ({
  children,
  icon,
  variant,
  ...props
}) => {
  return (
    <button
      className={classNames(styles.wrapper, {
        [styles.primary]: variant === 'primary',
        [styles.secondary]: variant === 'secondary',
      })}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  );
};
