import { useContext } from 'react'
import styles from './SwitchTheme.module.scss'
import { ThemeContext } from '../../context'

export const SwitchTheme = () => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext)

  return (
    <label className={styles.wrapper}>
      <input
        type="checkbox"
        checked={isDarkTheme}
        onChange={toggleTheme}
        className={styles.input}
      />
      <span className={styles.slider} />
    </label>
  )
}
