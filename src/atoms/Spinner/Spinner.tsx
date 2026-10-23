import styles from './Spinner.module.css'

interface SpinnerProps {
  size?: number
}

const Spinner = ({ size = 16 }: SpinnerProps) => (
  <span className={styles.spinner} style={{ width: size, height: size }} aria-hidden="true" />
)

export default Spinner
