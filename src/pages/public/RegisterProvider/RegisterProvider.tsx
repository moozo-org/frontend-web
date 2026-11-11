import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Alert, Button, Card, Checkbox, Link, Text, TextField, Title } from '../../../atoms'
import registerProvider from '../../../services/auth/registerProvider'
import { getErrorStatus, normalizeIdentifier, validateIdentifier } from '../../../utils'
import { RoleTabs } from '../../../molecules'
import styles from '../../FormPage.module.css'

const empty = { firstName: '', lastName: '', companyName: '', identifier: '', password: '' }

type Field = keyof typeof empty
// Values are i18n keys, translated when rendered
type Errors = Partial<Record<Field | 'documents' | 'terms', string>>

const validate = (form: typeof empty, documents: File[], terms: boolean) => {
  const errors: Errors = {}

  if (!form.firstName) errors.firstName = 'auth.errors.firstNameRequired'
  if (!form.lastName) errors.lastName = 'auth.errors.lastNameRequired'
  if (!form.companyName) errors.companyName = 'auth.errors.companyRequired'

  errors.identifier = validateIdentifier(form.identifier)

  if (form.password.length < 8) errors.password = 'auth.errors.passwordShort'
  if (!documents.length) errors.documents = 'auth.errors.documentsRequired'
  if (!terms) errors.terms = 'auth.errors.termsRequired'

  return errors
}

const RegisterProvider = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [documents, setDocuments] = useState<File[]>([])
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
      companyName: form.companyName.trim(),
      identifier: normalizeIdentifier(form.identifier),
    }
    const fieldErrors = validate(data, documents, terms)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length) return

    setLoading(true)
    try {
      await registerProvider({ ...data, documents })
      navigate('/verify-account', { replace: true, state: { identifier: data.identifier } })
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
        <RoleTabs />
        <div className={styles.header}>
          <Title>{t('auth.provider.title')}</Title>
          <Text variant="muted">{t('auth.provider.subtitle')}</Text>
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
            label={t('auth.provider.company')}
            autoComplete="organization"
            value={form.companyName}
            error={msg(errors.companyName)}
            onChange={update('companyName')}
          />

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

          <TextField
            label={t('auth.provider.documents')}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            hint={t('auth.provider.documentsHint')}
            error={msg(errors.documents)}
            onChange={(e) => {
              setDocuments(Array.from(e.target.files ?? []))
              setErrors((prev) => ({ ...prev, documents: undefined }))
            }}
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
            {t('auth.provider.submit')}
          </Button>
        </form>

        <Text variant="small">
          <Trans i18nKey="auth.register.haveAccount" components={{ link: <Link to="/login" /> }} />
        </Text>
      </Card>
    </main>
  )
}

export default RegisterProvider
