import type { ReactNode } from 'react'
import { Card, Text, Title } from '../../atoms'
import styles from './FormPage.module.css'

interface FormPageProps {
  title: string
  subtitle?: string
  tabs?: ReactNode
  children: ReactNode
}

const FormPage = ({ title, subtitle, tabs, children }: FormPageProps) => (
  <main className={styles.page}>
    <Card>
      {tabs}
      <div className={styles.header}>
        <Title>{title}</Title>
        {subtitle && <Text variant="muted">{subtitle}</Text>}
      </div>
      {children}
    </Card>
  </main>
)

export default FormPage
