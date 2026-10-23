import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { CheckIcon } from '../icons'
import styles from './Checkbox.module.css'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  error?: string
}

const Checkbox = ({ label, error, id, ...props }: CheckboxProps) => {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div>
      <label htmlFor={inputId} className={styles.checkbox}>
        <input
          id={inputId}
          type="checkbox"
          className={styles.input}
          aria-invalid={!!error}
          {...props}
        />
        <span className={`${styles.box} ${error ? styles.invalid : ''}`}>
          <CheckIcon />
        </span>
        <span>{label}</span>
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}

export default Checkbox
