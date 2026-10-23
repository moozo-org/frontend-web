import styles from './Divider.module.css'

interface DividerProps {
  label?: string
}

const Divider = ({ label }: DividerProps) => (
  <div className={styles.divider} role="separator">
    {label && <span>{label}</span>}
  </div>
)

export default Divider
