import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Spinner from '../Spinner/Spinner'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'md' | 'sm'
  loading?: boolean
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const Button = ({
  variant = 'primary',
  size = 'md',
  loading,
  fullWidth,
  iconLeft,
  iconRight,
  disabled,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) => {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className,
  ]

  return (
    <button
      type={type}
      className={classes.filter(Boolean).join(' ')}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? <Spinner /> : iconLeft}
      {children}
      {iconRight}
    </button>
  )
}

export default Button
