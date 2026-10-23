import { useId } from 'react'
import styles from './Switch.module.css'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
}

const Switch = ({ checked, onChange, label, disabled, id }: SwitchProps) => {
  const autoId = useId()
  const switchId = id ?? autoId

  return (
    <div className={styles.wrapper}>
      {label && <label htmlFor={switchId}>{label}</label>}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={styles.switch}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.thumb} />
      </button>
    </div>
  )
}

export default Switch
