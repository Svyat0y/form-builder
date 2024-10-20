import { FC } from 'react';
import styles from './MainContent.module.scss';

export const MainContent: FC = () => {
  return (
    <main className={styles.wrapper}>
      <div className={styles.content}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt
          fugit illum similique? Ab animi aut cupiditate dolor doloribus
          eligendi error fugit incidunt ipsa minima minus neque, nisi nobis
          numquam omnis perspiciatis reprehenderit tempore unde ut voluptas!
          Ducimus eaque id ipsum molestiae optio ratione sint tempore unde? Ea
          esse placeat saepe!
        </p>
      </div>
    </main>
  );
};
