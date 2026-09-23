import styles from './Switch.module.css'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  id?: string
}

const Switch = ({ checked, onChange, label, id = 'switch' }: SwitchProps) => {
  return (
    <div className={styles.wrapper}>
      {label && <label htmlFor={id}>{label}</label>}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        className={styles.switch + (checked ? ' ' + styles.on : '')}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.thumb} />
      </button>
    </div>
  )
}

export default Switch
