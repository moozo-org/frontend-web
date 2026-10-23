import type { ReactNode } from 'react'
import styles from './Alert.module.css'

interface AlertProps {
  variant?: 'error' | 'success' | 'info'
  children: ReactNode
}

const Alert = ({ variant = 'info', children }: AlertProps) => (
  <div
    role={variant === 'error' ? 'alert' : 'status'}
    className={`${styles.alert} ${styles[variant]}`}
  >
    {children}
  </div>
)

export default Alert
