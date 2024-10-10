import React from 'react';
import styles from './FormBuilder.module.scss';
//components
import { Header } from '../../components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { MainContent } from './components/MainContent/MainContent';

export const FormBuilder: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <Header />
      <Sidebar />
      <MainContent />
    </div>
  );
};
