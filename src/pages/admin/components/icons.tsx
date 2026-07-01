import { FC } from 'react'

// Shared SVG props — inherit color from parent via currentColor
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
}

export const UsersIcon: FC = () => (
  <svg width="18" height="18" {...base}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.2 2.9-5.5 6.5-5.5s6.5 2.3 6.5 5.5" />
    <path d="M16 8.5a3 3 0 1 0 0-6" />
    <path d="M17.5 14.7c2.6.5 4 2.4 4 5.3" />
  </svg>
)

export const FormsIcon: FC = () => (
  <svg width="18" height="18" {...base}>
    <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v5h5" />
    <path d="M8.5 12h7M8.5 15.5h7M8.5 18.5h4" />
  </svg>
)

export const SearchIcon: FC = () => (
  <svg width="16" height="16" {...base}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

export const DotsIcon: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="12" cy="19" r="1.8" />
  </svg>
)

export const ShieldIcon: FC = () => (
  <svg width="18" height="18" {...base}>
    <path d="M12 3 4 6v6c0 5 3.4 8.5 8 9 4.6-.5 8-4 8-9V6l-8-3Z" />
  </svg>
)

export const UserMinusIcon: FC = () => (
  <svg width="18" height="18" {...base}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.2 2.9-5.5 6.5-5.5s6.5 2.3 6.5 5.5" />
    <line x1="16" y1="10" x2="22" y2="10" />
  </svg>
)

export const LaptopIcon: FC = () => (
  <svg width="16" height="16" {...base}>
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <path d="M2 19h20" />
  </svg>
)

export const MobileIcon: FC = () => (
  <svg width="16" height="16" {...base}>
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
)

export const BellPlusIcon: FC = () => (
  <svg width="16" height="16" {...base}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
)

export const TrashIcon: FC = () => (
  <svg width="16" height="16" {...base}>
    <path d="M4 7h16" />
    <path d="M9 7V4h6v3" />
    <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
  </svg>
)
