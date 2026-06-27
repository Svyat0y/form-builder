import { FC, useState, useRef, useEffect, useCallback } from 'react'

import { useNavigate } from 'react-router-dom'
import styles from './Dashboard.module.scss'
import { useAppDispatch } from '@/shared/lib/hooks'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { logout } from '@/features/auth/model'
import { ROUTES } from '@/shared/config/routes'
import { SwitchTheme } from '@/shared/ui/switch-theme'
import { Dropdown } from '@/shared/ui/dropdown'

// Temporary mock data — will be replaced with real API / Redux state
const MOCK_FORMS = [
  {
    id: '1',
    title: 'Customer Satisfaction Survey',
    status: 'active',
    responses: 142,
    updated: '2 hours ago',
  },
  {
    id: '2',
    title: 'Product Feedback Form',
    status: 'active',
    responses: 87,
    updated: 'Yesterday',
  },
  {
    id: '3',
    title: 'Employee Onboarding Checklist',
    status: 'draft',
    responses: 0,
    updated: '3 days ago',
  },
  {
    id: '4',
    title: 'Event Registration 2025',
    status: 'active',
    responses: 312,
    updated: '1 week ago',
  },
  {
    id: '5',
    title: 'Bug Report Template',
    status: 'closed',
    responses: 54,
    updated: '2 weeks ago',
  },
  {
    id: '6',
    title: 'Newsletter Signup',
    status: 'draft',
    responses: 0,
    updated: '1 month ago',
  },
]

type ViewMode = 'grid' | 'list'
type FormStatus = 'active' | 'draft' | 'closed'

interface FormItem {
  id: string
  title: string
  status: FormStatus
  responses: number
  updated: string
}

const STATUS_LABELS: Record<FormStatus, string> = {
  active: 'Active',
  draft: 'Draft',
  closed: 'Closed',
}

// Roles that can access Admin panel
const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN']

// ─── Icons ────────────────────────────────────────────────────────────────────

const GridIcon: FC = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

const ListIcon: FC = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="3.5" cy="6" r="1" />
    <circle cx="3.5" cy="12" r="1" />
    <circle cx="3.5" cy="18" r="1" />
  </svg>
)

const DotsIcon: FC = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="12" cy="19" r="1.8" />
  </svg>
)

const PlusIcon: FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const FileIcon: FC = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
)

const SettingsIcon: FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9z" />
  </svg>
)

const AdminIcon: FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const LogoutIcon: FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const ChevronDown: FC = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

// ─── Card context menu content ────────────────────────────────────────────────

interface FormMenuContentProps {
  onEdit: () => void
  onResponses: () => void
  onCopy: () => void
  onDelete: () => void
  onClose: () => void
}

const FormMenuContent: FC<FormMenuContentProps> = ({
  onEdit,
  onResponses,
  onCopy,
  onDelete,
  onClose,
}) => (
  <div className={styles.menu}>
    <button
      className={styles.menuItem}
      onClick={() => {
        onEdit()
        onClose()
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
      </svg>
      Edit
    </button>
    <button
      className={styles.menuItem}
      onClick={() => {
        onResponses()
        onClose()
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      View responses
    </button>
    <button
      className={styles.menuItem}
      onClick={() => {
        onCopy()
        onClose()
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
      </svg>
      Copy link
    </button>
    <div className={styles.menuDivider} />
    <button
      className={`${styles.menuItem} ${styles.menuItemDanger}`}
      onClick={() => {
        onDelete()
        onClose()
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
      Delete
    </button>
  </div>
)

// ─── Create Form modal ────────────────────────────────────────────────────────

interface CreateFormModalProps {
  onClose: () => void
  onCreate: (title: string) => void
}

const CreateFormModal: FC<CreateFormModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onCreate(trimmed)
    onClose()
  }

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdrop}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Create new form"
      >
        <h2 className={styles.modalTitle}>New form</h2>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className={styles.modalInput}
            type="text"
            placeholder="Form name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.modalCancel}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.modalCreate}
              disabled={!title.trim()}
            >
              <PlusIcon />
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const Dashboard: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // TODO: replace mock with real Redux state
  const [forms, setForms] = useState<FormItem[]>(MOCK_FORMS as FormItem[])
  const hasForms = forms.length > 0

  // Role-based access
  const isAdmin = ADMIN_ROLES.includes(user?.role ?? '')

  const handleLogout = async () => {
    await dispatch(logout())
    navigate(ROUTES.signIn)
  }

  // TODO: open FormEditorModal in 'builder' mode instead of navigating
  const handleEditForm = (id: string) => navigate(`/form-builder/${id}`)
  // TODO: open FormEditorModal in 'responses' mode
  const handleViewResponses = (id: string) => navigate(`/forms/${id}/responses`)

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/forms/${id}`)
  }

  const handleDeleteForm = (id: string) => {
    // TODO: dispatch delete action to API
    setForms((prev) => prev.filter((f) => f.id !== id))
  }

  // Add new DRAFT form card (temporary mock — will be replaced with API call)
  const handleCreateForm = (title: string) => {
    const newForm: FormItem = {
      id: String(Date.now()),
      title,
      status: 'draft',
      responses: 0,
      updated: 'Just now',
    }
    setForms((prev) => [newForm, ...prev])
  }

  const closeAll = () => {
    setAvatarOpen(false)
    setMobileMenuOpen(false)
    setOpenMenuId(null)
  }

  const toggleCardMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>, id: string) => {
      e.stopPropagation()
      setOpenMenuId((prev) => (prev === id ? null : id))
    },
    [],
  )

  // Get user initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  const countLabel = hasForms
    ? `${forms.length} form${forms.length !== 1 ? 's' : ''}`
    : ''

  return (
    <div className={styles.page} onClick={closeAll}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>B</span>
          Builder
        </div>

        <div className={styles.headerRight}>
          {/* Theme toggle */}
          <SwitchTheme inline />

          {/* Avatar dropdown — desktop only */}
          <div
            className={`${styles.avatarWrap} ${styles.avatarDesktop}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.avatarBtn}
              onClick={() => setAvatarOpen((v) => !v)}
              aria-label="Account menu"
              aria-expanded={avatarOpen}
            >
              <span className={styles.avatar}>{initials}</span>
              <ChevronDown />
            </button>

            {avatarOpen && (
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

                {/* Admin link — visible only to ADMIN / SUPER_ADMIN */}
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
            )}
          </div>

          {/* Burger — mobile only */}
          <button
            className={styles.burgerBtn}
            onClick={(e) => {
              e.stopPropagation()
              setMobileMenuOpen((v) => !v)
            }}
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

      {/* ── Mobile fullscreen menu ── */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
          {/* User info */}
          <div className={styles.mobileUser}>
            <span className={styles.mobileAvatar}>{initials}</span>
            <div>
              <div className={styles.mobileUserName}>
                {user?.name || 'User'}
              </div>
              <div className={styles.mobileUserEmail}>{user?.email || ''}</div>
            </div>
          </div>

          {/* Nav links */}
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

            {/* Admin — only for ADMIN / SUPER_ADMIN */}
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

          {/* Bottom: logout */}
          <div className={styles.mobileBottom}>
            <button className={styles.mobileLogout} onClick={handleLogout}>
              <LogoutIcon />
              Log out
            </button>
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main className={styles.main}>
        {/* Page title row */}
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            {countLabel && <p className={styles.subtitle}>{countLabel}</p>}
          </div>
          <button
            className={styles.createBtn}
            onClick={(e) => {
              e.stopPropagation()
              setCreateModalOpen(true)
            }}
          >
            <PlusIcon />
            Create Form
          </button>
        </div>

        {/* ── Forms list ── */}
        {hasForms && (
          <div>
            {/* View toggle */}
            <div className={styles.viewToggleRow}>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <GridIcon />
                </button>
                <button
                  className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <ListIcon />
                </button>
              </div>
            </div>

            {/* Grid view */}
            {viewMode === 'grid' && (
              <div className={styles.grid}>
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className={`${styles.card} ${openMenuId === form.id ? styles.cardMenuOpen : ''}`}
                  >
                    <div className={styles.cardTop}>
                      <span
                        className={`${styles.badge} ${styles[`badge_${form.status}`]}`}
                      >
                        {STATUS_LABELS[form.status]}
                      </span>
                      <Dropdown
                        isOpen={openMenuId === form.id}
                        onToggle={(e) => toggleCardMenu(e, form.id)}
                        onClose={() => setOpenMenuId(null)}
                        trigger={
                          <button
                            className={styles.dotsBtn}
                            aria-label="Form options"
                          >
                            <DotsIcon />
                          </button>
                        }
                      >
                        <FormMenuContent
                          onEdit={() => handleEditForm(form.id)}
                          onResponses={() => handleViewResponses(form.id)}
                          onCopy={() => handleCopyLink(form.id)}
                          onDelete={() => handleDeleteForm(form.id)}
                          onClose={() => setOpenMenuId(null)}
                        />
                      </Dropdown>
                    </div>

                    <h3 className={styles.cardTitle}>{form.title}</h3>

                    <div className={styles.cardFooter}>
                      <div className={styles.cardResponses}>
                        <FileIcon />
                        <span className={styles.cardResponseCount}>
                          {form.responses}
                        </span>
                        <span>responses</span>
                      </div>
                      <div className={styles.cardDate}>
                        Updated {form.updated}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List view */}
            {viewMode === 'list' && (
              <div className={styles.listTableWrap}>
                <div className={styles.listTable}>
                  <div className={styles.listHeader}>
                    <div>Form</div>
                    <div>Status</div>
                    <div>Responses</div>
                    <div>Last updated</div>
                    <div />
                  </div>
                  {forms.map((form) => (
                    <div key={form.id} className={styles.listRow}>
                      <div className={styles.listTitle}>{form.title}</div>
                      <div>
                        <span
                          className={`${styles.badge} ${styles[`badge_${form.status}`]}`}
                        >
                          {STATUS_LABELS[form.status]}
                        </span>
                      </div>
                      <div className={styles.listMeta}>
                        {form.responses} responses
                      </div>
                      <div className={styles.listMeta}>
                        Updated {form.updated}
                      </div>
                      <div className={styles.listActions}>
                        <button
                          className={styles.listActionBtn}
                          aria-label="Edit"
                          title="Edit"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditForm(form.id)
                          }}
                        >
                          {/* Edit icon */}
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
                          </svg>
                        </button>
                        <button
                          className={styles.listActionBtn}
                          aria-label="View responses"
                          title="View responses"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewResponses(form.id)
                          }}
                        >
                          {/* Eye icon */}
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          className={styles.listActionBtn}
                          aria-label="Copy link"
                          title="Copy link"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyLink(form.id)
                          }}
                        >
                          {/* Link icon */}
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
                            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
                          </svg>
                        </button>
                        <button
                          className={`${styles.listActionBtn} ${styles.listActionBtnDanger}`}
                          aria-label="Delete"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteForm(form.id)
                          }}
                        >
                          {/* Trash icon */}
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Empty state ── */}
        {!hasForms && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIllustration}>
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-color-secondary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="13" y2="17" />
              </svg>
            </div>
            <h2 className={styles.emptyTitle}>No forms yet</h2>
            <p className={styles.emptyText}>
              Create your first form to start collecting responses from your
              audience.
            </p>
            <button
              className={styles.createBtn}
              onClick={(e) => {
                e.stopPropagation()
                setCreateModalOpen(true)
              }}
            >
              <PlusIcon />
              Create your first form
            </button>
          </div>
        )}
      </main>

      {/* ── Create Form modal ── */}
      {createModalOpen && (
        <CreateFormModal
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateForm}
        />
      )}
    </div>
  )
}
