import type { FormHTMLAttributes } from "react"
import styles from "./Form.module.css"

const Form = (props: FormHTMLAttributes<HTMLFormElement>) => (
  <form className={styles.form} noValidate {...props} />
)

export default Form
