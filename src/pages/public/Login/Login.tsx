import { useState, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Alert, Button, Card, Link, Text, TextField, Title } from '../../../atoms'
import { useAuth } from '../../../hooks/useAuth'
import { getErrorStatus, normalizeIdentifier, validateIdentifier } from '../../../utils'
import styles from './Login.module.css'

// Values are i18n keys, translated when rendered
interface Errors {
  identifier?: string
  password?: string
}

const validate = (identifier: string, password: string) => {
  const errors: Errors = {}

  errors.identifier = validateIdentifier(identifier)

  if (!password) errors.password = 'auth.errors.passwordRequired'

  return errors
}

const Login = () => {
  const { t } = useTranslation()
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const msg = (key?: string) => (key ? t(key) : undefined)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')

    const id = normalizeIdentifier(identifier)
    const fieldErrors = validate(id, password)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length) return

    setLoading(true)
    try {
      // On success the route guard redirects, see RequireAnonymous
      await login(id, password)
    } catch (err) {
      const status = getErrorStatus(err)

      // TODO: the API sends 403 for both pending and banned accounts, split them once it says which
      setFormError(
        status === 401
          ? 'auth.errors.wrongCredentials'
          : status === 403
            ? 'auth.errors.inactiveAccount'
            : 'auth.errors.generic'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <Card>
        <div className={styles.header}>
          <Title>{t('auth.login.title')}</Title>
          <Text variant="muted">{t('auth.login.subtitle')}</Text>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {formError && <Alert variant="error">{t(formError)}</Alert>}

          <TextField
            label={t('auth.login.identifier')}
            autoComplete="username"
            value={identifier}
            error={msg(errors.identifier)}
            onChange={(e) => {
              setIdentifier(e.target.value)
              setErrors((prev) => ({ ...prev, identifier: undefined }))
            }}
          />

          <div className={styles.password}>
            <TextField
              label={t('auth.login.password')}
              type="password"
              autoComplete="current-password"
              value={password}
              error={msg(errors.password)}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((prev) => ({ ...prev, password: undefined }))
              }}
            />
            {/* TODO: add forgot password link */}
            {/* <Link to="/forgot-password" variant="muted">
              Forgot password?
            </Link> */}
          </div>

          <Button type="submit" fullWidth loading={loading}>
            {t('auth.login.submit')}
          </Button>
        </form>

        <Text variant="small">
          <Trans i18nKey="auth.login.noAccount" components={{ link: <Link to="/register" /> }} />
        </Text>
      </Card>
    </main>
  )
}

export default Login
