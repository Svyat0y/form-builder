import { FC } from 'react'
import styles from './FormBuilder.module.scss'
import { Header } from '@/widgets/header'
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
