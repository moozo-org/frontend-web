import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Alert, Button, Card, Checkbox, Link, Text, TextField, Title } from '../../../atoms'
import register from '../../../services/auth/register'
import { getErrorStatus, normalizeIdentifier, validateIdentifier } from '../../../utils'
import styles from './Register.module.css'

const empty = { firstName: '', lastName: '', identifier: '', password: '' }

type Field = keyof typeof empty
// Values are i18n keys, translated when rendered
type Errors = Partial<Record<Field | 'terms', string>>

const validate = (form: typeof empty, terms: boolean) => {
  const errors: Errors = {}

  if (!form.firstName) errors.firstName = 'auth.errors.firstNameRequired'
  if (!form.lastName) errors.lastName = 'auth.errors.lastNameRequired'

  errors.identifier = validateIdentifier(form.identifier)

  if (form.password.length < 8) errors.password = 'auth.errors.passwordShort'
  if (!terms) errors.terms = 'auth.errors.termsRequired'

  return errors
}

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const msg = (key?: string) => (key ? t(key) : undefined)

  const update = (field: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')

    const data = {
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      identifier: normalizeIdentifier(form.identifier),
    }
    const fieldErrors = validate(data, terms)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length) return

    setLoading(true)
    try {
      await register(data)
      navigate('/verify-account', { replace: true })
    } catch (err) {
      setFormError(
        getErrorStatus(err) === 409 ? 'auth.errors.accountExists' : 'auth.errors.generic'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <Card>
        <div className={styles.header}>
          <Title>{t('auth.register.title')}</Title>
          <Text variant="muted">{t('auth.register.subtitle')}</Text>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {formError && <Alert variant="error">{t(formError)}</Alert>}

          <div className={styles.row}>
            <TextField
              label={t('auth.register.firstName')}
              autoComplete="given-name"
              value={form.firstName}
              error={msg(errors.firstName)}
              onChange={update('firstName')}
            />
            <TextField
              label={t('auth.register.lastName')}
              autoComplete="family-name"
              value={form.lastName}
              error={msg(errors.lastName)}
              onChange={update('lastName')}
            />
          </div>

          <TextField
            label={t('auth.register.identifier')}
            autoComplete="username"
            value={form.identifier}
            error={msg(errors.identifier)}
            onChange={update('identifier')}
          />

          <TextField
            label={t('auth.register.password')}
            type="password"
            autoComplete="new-password"
            hint={t('auth.register.passwordHint')}
            value={form.password}
            error={msg(errors.password)}
            onChange={update('password')}
          />

          <Checkbox
            // TODO: add links to terms and privacy policy
            label={t('auth.register.terms')}
            checked={terms}
            error={msg(errors.terms)}
            onChange={(e) => {
              setTerms(e.target.checked)
              setErrors((prev) => ({ ...prev, terms: undefined }))
            }}
          />

          <Button type="submit" fullWidth loading={loading}>
            {t('auth.register.submit')}
          </Button>
        </form>

        <Text variant="small">
          <Trans i18nKey="auth.register.haveAccount" components={{ link: <Link to="/login" /> }} />
        </Text>
        <Text variant="small">
          <Trans
            i18nKey="auth.register.provider"
            components={{ link: <Link to="/register/provider" /> }}
          />
        </Text>
      </Card>
    </main>
  )
}

export default Register
