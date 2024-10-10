import React from 'react';
import styles from './Sidebar.module.scss';
//other
import { useResizableSidebar } from './hooks/useResizableSidebar';

export const Sidebar: React.FC = () => {
  const { sidebarRef, sidebarWidth, startResizing } = useResizableSidebar(400);

  return (
    <div
      className={styles.wrapper}
      ref={sidebarRef}
      onMouseDown={(e) => e.preventDefault()}
      style={{ width: sidebarWidth }}
    >
      <div className={styles.resizer} onMouseDown={startResizing} />
      <div className={styles.content}>sidebar content</div>
    </div>
  );
};
