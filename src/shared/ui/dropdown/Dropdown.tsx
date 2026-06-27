import {
  FC,
  ReactNode,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  cloneElement,
  isValidElement,
} from 'react'
import styles from './Dropdown.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

type DropdownAlign = 'left' | 'right'

interface DropdownProps {
  /** The element that triggers the dropdown (button, icon, etc.) */
  trigger: ReactNode
  /** Popup content — any component */
  children: ReactNode
  /** Horizontal alignment relative to the trigger. Default: 'right' */
  align?: DropdownAlign
  /** Controlled open state */
  isOpen: boolean
  /** Called when user clicks the trigger */
  onToggle: (e: React.MouseEvent<HTMLElement>) => void
  /** Called when dropdown requests to close (click outside, Escape) */
  onClose: () => void
  /** Extra class on the wrapper */
  className?: string
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────

export const Dropdown: FC<DropdownProps> = ({
  trigger,
  children,
  align = 'right',
  isOpen,
  onToggle,
  onClose,
  className,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  // 'measured' tracks whether we have already computed position on this open cycle.
  // We render the popup invisible first, measure, then show it — no flicker.
  const [measured, setMeasured] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)

  // useLayoutEffect fires synchronously after DOM paint but before the browser
  // repaints visually — so the user never sees the pre-measurement position.
  useLayoutEffect(() => {
    if (!isOpen || !popupRef.current) return

    const rect = popupRef.current.getBoundingClientRect()
    // Use clientHeight instead of innerHeight — more reliable on mobile browsers
    // where innerHeight can include the browser chrome (address bar, etc.)
    const viewportHeight = document.documentElement.clientHeight
    // Also flip if the popup top is already below the fold (edge case)
    const needsFlip =
      rect.bottom + 8 > viewportHeight || rect.top > viewportHeight

    setOpenUpward(needsFlip)
    setMeasured(true)
  }, [isOpen])

  // Reset state when popup closes
  useEffect(() => {
    if (!isOpen) {
      setMeasured(false)
      setOpenUpward(false)
    }
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, onClose])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Attach onClick to trigger element
  const triggerEl = isValidElement(trigger)
    ? cloneElement(
        trigger as React.ReactElement<{ onClick?: React.MouseEventHandler }>,
        {
          onClick: (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation()
            onToggle(e)
          },
        },
      )
    : trigger

  const popupClasses = [
    styles.popup,
    align === 'left' ? styles.alignLeft : styles.alignRight,
    openUpward ? styles.openUpward : styles.openDownward,
    // Hidden until first measurement — prevents flicker on flip
    !measured ? styles.invisible : styles.visible,
  ].join(' ')

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${className ?? ''}`}>
      {triggerEl}
      {isOpen && (
        <div
          ref={popupRef}
          className={popupClasses}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  )
}
