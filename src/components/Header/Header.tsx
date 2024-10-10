import React from 'react';
import styles from './Header.module.scss';
//components
import { Burger } from '@components/ui/Burger';

export const Header: React.FC = () => {
  return (
    <header className={styles.wrapper}>
      <div className={styles.logo}>Builder</div>
      <div className={styles.navigation}>
        <Burger />
      </div>
    </header>
  );
};
