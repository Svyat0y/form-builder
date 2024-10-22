import { FC, ReactNode } from 'react';
import styles from './Card.module.scss';

interface CardProps {
  children: ReactNode;
}

export const Card: FC<CardProps> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>{children}</div>
    </div>
  );
};
