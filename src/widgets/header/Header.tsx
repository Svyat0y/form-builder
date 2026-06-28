import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Header.module.scss'
import { SwitchTheme } from '@/shared/ui/switch-theme'
import { Dropdown } from '@/shared/ui/dropdown'
import { ROUTES } from '@/shared/config/routes'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { useAppDispatch } from '@/shared/lib/hooks'
import { logout } from '@/features/auth/model'
import { SettingsIcon, AdminIcon, LogoutIcon, ChevronDownIcon } from './icons'

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN']

export const Header: FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAuth()

  const [avatarOpen, setAvatarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAdmin = ADMIN_ROLES.includes(user?.role ?? '')

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  const closeAll = () => {
    setAvatarOpen(false)
    setMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    closeAll()
    await dispatch(logout())
    navigate(ROUTES.signIn)
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>B</span>
          Builder
        </div>

        <div className={styles.headerRight}>
          <SwitchTheme inline />

          {/* Avatar dropdown — desktop only */}
          <div className={styles.avatarDesktop}>
            <Dropdown
              isOpen={avatarOpen}
              onToggle={() => setAvatarOpen((v) => !v)}
              onClose={() => setAvatarOpen(false)}
              trigger={
                <button
                  className={styles.avatarBtn}
                  aria-label="Account menu"
                  aria-expanded={avatarOpen}
                >
                  <span className={styles.avatar}>
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      initials
                    )}
                  </span>
                  <ChevronDownIcon />
                </button>
              }
            >
              <div className={styles.avatarDropdown}>
                <div className={styles.avatarInfo}>
                  <div className={styles.avatarName}>
                    {user?.name || 'User'}
                  </div>
                  <div className={styles.avatarEmail}>{user?.email || ''}</div>
                </div>

                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    navigate(ROUTES.settings)
                    closeAll()
                  }}
                >
                  <SettingsIcon />
                  Settings
                </button>

                {isAdmin && (
                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      navigate(ROUTES.admin)
                      closeAll()
                    }}
                  >
                    <AdminIcon />
                    Admin Panel
                  </button>
                )}

                <div className={styles.dropdownDivider} />

                <button
                  className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                  onClick={handleLogout}
                >
                  <LogoutIcon />
                  Log out
                </button>
              </div>
            </Dropdown>
          </div>

          {/* Burger — mobile only */}
          <button
            className={styles.burgerBtn}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`${styles.burgerLine} ${mobileMenuOpen ? styles.burgerLineTop : ''}`}
            />
            <span
              className={`${styles.burgerLine} ${mobileMenuOpen ? styles.burgerLineMid : ''}`}
            />
            <span
              className={`${styles.burgerLine} ${mobileMenuOpen ? styles.burgerLineBot : ''}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
          <div className={styles.mobileUser}>
            <span className={styles.mobileAvatar}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                initials
              )}
            </span>
            <div>
              <div className={styles.mobileUserName}>
                {user?.name || 'User'}
              </div>
              <div className={styles.mobileUserEmail}>{user?.email || ''}</div>
            </div>
          </div>

          <nav className={styles.mobileNav}>
            <button
              className={styles.mobileNavLink}
              onClick={() => {
                navigate(ROUTES.settings)
                closeAll()
              }}
            >
              <SettingsIcon />
              Settings
            </button>

            {isAdmin && (
              <button
                className={styles.mobileNavLink}
                onClick={() => {
                  navigate(ROUTES.admin)
                  closeAll()
                }}
              >
                <AdminIcon />
                Admin Panel
              </button>
            )}
          </nav>

          <div className={styles.mobileBottom}>
            <button className={styles.mobileLogout} onClick={handleLogout}>
              <LogoutIcon />
              Log out
            </button>
          </div>
        </div>
      )}
    </>
  )
}
