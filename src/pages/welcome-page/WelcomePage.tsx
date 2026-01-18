import { FC, useState } from 'react'
import styles from './WelcomePage.module.scss'
import { authApi } from '@store/features/auth/authApi'

export const WelcomePage: FC = () => {
  const [data, setData] = useState(null)
  const onHandleClick = async () => {
    const result = await authApi.getProfile()
    setData(result.data)
  }

  return (
    <div className={styles.wrapper}>
      <p>welcome page</p>
      <button onClick={onHandleClick} className={styles.button}>
        get user data
      </button>
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}
