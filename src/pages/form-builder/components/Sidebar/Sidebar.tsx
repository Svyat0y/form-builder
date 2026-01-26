import { FC, useState } from 'react'
import styles from './Sidebar.module.scss'
import { useResizableSidebar } from './hooks'
import classNames from 'classnames'
import { useMediaQuery } from '@/shared/lib/hooks'

export const Sidebar: FC = () => {
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const { sidebarRef, sidebarWidth, startResizing } = useResizableSidebar(400)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.active]: isOpen,
      })}
      ref={sidebarRef}
      onMouseDown={(e) => e.preventDefault()}
      style={{ width: sidebarWidth }}
    >
      {isDesktop && (
        <div className={styles.resizer} onMouseDown={startResizing} />
      )}
      <button className={styles.openButton} onClick={handleOpenSidebar}>
        {isOpen ? '→' : '←'}
      </button>
      <div className={styles.content}>sidebar content</div>
    </div>
  )
}
