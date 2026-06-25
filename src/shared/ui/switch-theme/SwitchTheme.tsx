import { useContext } from 'react'
import classNames from 'classnames'
import styles from './SwitchTheme.module.scss'
import { ThemeContext } from '@/app/providers'

interface SwitchThemeProps {
  // When true, removes absolute positioning so it can be used inline
  inline?: boolean
  className?: string
}

export const SwitchTheme = ({ inline, className }: SwitchThemeProps) => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext)

  return (
    <label
      className={classNames(
        styles.wrapper,
        { [styles.inline]: inline },
        className,
      )}
    >
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
