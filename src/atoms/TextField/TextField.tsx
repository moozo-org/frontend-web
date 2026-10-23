import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { EyeIcon, EyeOffIcon } from '../icons'
import styles from './TextField.module.css'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  iconLeft?: ReactNode
}

const TextField = ({
  label,
  error,
  hint,
  iconLeft,
  type = 'text',
  id,
  ...props
}: TextFieldProps) => {
  const autoId = useId()
  const inputId = id ?? autoId
  const messageId = `${inputId}-message`
  const message = error ?? hint
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>

      <div className={`${styles.control} ${error ? styles.invalid : ''}`}>
        {iconLeft && <span className={styles.icon}>{iconLeft}</span>}
        <input
          id={inputId}
          type={isPassword && visible ? 'text' : type}
          className={styles.input}
          aria-invalid={!!error}
          aria-describedby={message ? messageId : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setVisible(!visible)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {message && (
        <p id={messageId} className={error ? styles.error : styles.hint}>
          {message}
        </p>
      )}
    </div>
  )
}

export default TextField
