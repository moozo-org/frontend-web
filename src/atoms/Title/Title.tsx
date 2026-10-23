import type { ReactNode } from 'react'
import styles from './Title.module.css'

interface TitleProps {
  level?: 1 | 2 | 3
  children: ReactNode
}

const Title = ({ level = 1, children }: TitleProps) => {
  const Tag = `h${level}` as const

  return <Tag className={`${styles.title} ${styles[`level${level}`]}`}>{children}</Tag>
}

export default Title
