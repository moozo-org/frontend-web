import type { ReactNode } from 'react'
import styles from './Text.module.css'

interface TextProps {
  variant?: 'body' | 'muted' | 'small'
  as?: 'p' | 'span'
  children: ReactNode
}

const Text = ({ variant = 'body', as: Tag = 'p', children }: TextProps) => (
  <Tag className={`${styles.text} ${styles[variant]}`}>{children}</Tag>
)

export default Text
