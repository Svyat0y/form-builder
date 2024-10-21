import { FC, useState } from 'react';
import styles from './Checkbox.module.scss';
import classNames from 'classnames';

interface ICheckboxProps {
  label: string;
  className?: string;
}

export const Checkbox: FC<ICheckboxProps> = ({ label, className }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.checkBoxWrapper}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <svg
            className={`${styles.checkbox} ${isChecked ? styles.active : ''}`}
            aria-hidden="true"
            viewBox="0 0 15 11"
            fill="none"
          >
            <path
              d="M1 4.5L5 9L14 1"
              strokeWidth="2"
              stroke={isChecked ? '#fff' : 'none'}
            />
          </svg>
          {label}
        </label>
      </div>
    </div>
  );
};
