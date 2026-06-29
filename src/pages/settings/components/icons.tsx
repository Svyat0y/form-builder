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

export const UserIcon: FC = () => (
  <svg width="18" height="18" {...base}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-3.5 3.6-6 8-6s8 2.5 8 6" />
  </svg>
)

export const LockIcon: FC = () => (
  <svg width="18" height="18" {...base}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
)

export const BellIcon: FC = () => (
  <svg width="18" height="18" {...base}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
)

export const AlertIcon: FC = () => (
  <svg width="18" height="18" {...base}>
    <path d="M12 3 2 20h20L12 3Z" />
    <line x1="12" y1="10" x2="12" y2="14" />
    <line x1="12" y1="17.5" x2="12" y2="17.5" />
  </svg>
)

export const UploadIcon: FC = () => (
  <svg width="16" height="16" {...base}>
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M5 20h14" />
  </svg>
)

export const KeyIcon: FC = () => (
  <svg width="16" height="16" {...base}>
    <circle cx="8" cy="14" r="4" />
    <path d="m11 11 9-9" />
    <path d="m16 6 3 3" />
  </svg>
)

export const TrashIcon: FC = () => (
  <svg width="16" height="16" {...base}>
    <path d="M4 7h16" />
    <path d="M9 7V4h6v3" />
    <path d="M6 7l1 13h10l1-13" />
  </svg>
)

export const LaptopIcon: FC = () => (
  <svg width="20" height="20" {...base}>
    <rect x="4" y="5" width="16" height="11" rx="2" />
    <path d="M2 20h20" />
  </svg>
)

export const MobileIcon: FC = () => (
  <svg width="20" height="20" {...base}>
    <rect x="7" y="3" width="10" height="18" rx="2" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
)

export const InfoIcon: FC = () => (
  <svg width="15" height="15" {...base}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="11" x2="12" y2="16" />
    <line x1="12" y1="8" x2="12" y2="8" />
  </svg>
)
