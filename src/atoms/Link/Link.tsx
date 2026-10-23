import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router'
import styles from './Link.module.css'

interface LinkProps extends RouterLinkProps {
  variant?: 'default' | 'muted'
}

const Link = ({ variant = 'default', className, ...props }: LinkProps) => (
  <RouterLink className={`${styles.link} ${styles[variant]} ${className ?? ''}`} {...props} />
)

export default Link
