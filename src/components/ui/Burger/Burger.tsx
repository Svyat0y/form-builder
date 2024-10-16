import { FC } from 'react';
import styles from './Burger.module.scss';
import classNames from 'classnames';
//other
import { useOpen } from '@hooks/useOpen';

export const Burger: FC = () => {
  const { isOpen, onToggle } = useOpen();

  const handleClickBurger = () => {
    onToggle();
  };

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
  );
};
