import type { ButtonHTMLAttributes } from 'react'
import styles from './Pill.module.css'

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean
}

const Pill = ({ selected, className, children, ...props }: PillProps) => (
  <button
    type="button"
    aria-pressed={selected}
    className={`${styles.pill} ${className ?? ''}`}
    {...props}
  >
    {children}
  </button>
)

export default Pill
