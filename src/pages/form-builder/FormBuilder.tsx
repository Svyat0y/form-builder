import { FC } from 'react'
import styles from './FormBuilder.module.scss'
//components
import { Header } from '@components/Header'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'

export const FormBuilder: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Header />
      <Sidebar />
      <MainContent />
    </div>
  )
}
