import { FC, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './FastTooltip.module.scss'

interface FastTooltipProps {
  text: string
}

// Portal-rendered tooltip anchored via a fixed-position rect measured on
// hover — sidesteps two problems the native `title` attribute and a plain
// CSS bubble both have here: `title` has a browser hover delay (~1s) users
// perceive as sluggish, and a CSS bubble nested inside a sticky <thead>
// gets painted behind <tbody> rows by the table's own stacking/paint order
// (verified: opacity/visibility were "on" but the element was still
// invisible — a table-specific quirk, not a CSS mistake). Portaling to
// <body> with position: fixed escapes both issues and shows instantly.
export const FastTooltip: FC<FastTooltipProps> = ({ text }) => {
  const iconRef = useRef<HTMLSpanElement>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const show = () => setRect(iconRef.current?.getBoundingClientRect() ?? null)
  const hide = () => setRect(null)

  return (
    <>
      <span
        ref={iconRef}
        className={styles.icon}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
        aria-label={text}
      >
        ?
      </span>
      {rect &&
        createPortal(
          <div
            className={styles.bubble}
            style={{
              left: rect.left + rect.width / 2,
              top: rect.top - 8,
            }}
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  )
}
