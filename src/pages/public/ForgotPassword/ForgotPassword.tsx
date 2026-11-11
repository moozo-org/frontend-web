import { useState, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Alert, Button, Card, Link, Text, TextField, Title } from '../../../atoms'
import forgotPassword from '../../../services/auth/forgotPassword'
import { getErrorStatus, normalizeIdentifier, validateIdentifier } from '../../../utils'
import styles from '../../FormPage.module.css'

const ForgotPassword = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [error, setError] = useState<string>()
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')

    const id = normalizeIdentifier(identifier)
    const invalid = validateIdentifier(id)
    setError(invalid)
    if (invalid) return

    setLoading(true)
    try {
      await forgotPassword(id)
    } catch (err) {
      // 404 is treated like success so the page never reveals which accounts exist
      if (getErrorStatus(err) !== 404) {
        setFormError('auth.errors.generic')
        setLoading(false)
        return
      }
    }

    navigate('/reset-password', { state: { identifier: id } })
  }

  return (
    <main className={styles.page}>
      <Card>
        <div className={styles.header}>
          <Title>{t('auth.forgot.title')}</Title>
          <Text variant="muted">{t('auth.forgot.subtitle')}</Text>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {formError && <Alert variant="error">{t(formError)}</Alert>}

          <TextField
            label={t('auth.forgot.identifier')}
            autoComplete="username"
            value={identifier}
            error={error ? t(error) : undefined}
            onChange={(e) => {
              setIdentifier(e.target.value)
              setError(undefined)
            }}
          />

          <Button type="submit" fullWidth loading={loading}>
            {t('auth.forgot.submit')}
          </Button>
        </form>

        <Text variant="small">
          <Trans i18nKey="auth.forgot.back" components={{ link: <Link to="/login" /> }} />
        </Text>
      </Card>
    </main>
  )
}

export default ForgotPassword
