import type { ReactNode } from "react"
import styles from "./FieldRow.module.css"

const FieldRow = ({ children }: { children: ReactNode }) => (
  <div className={styles.row}>{children}</div>
)

export default FieldRow
