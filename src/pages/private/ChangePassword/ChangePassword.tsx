import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Alert, Button, Card, Link, Text, TextField, Title } from '../../../atoms'
import changePassword from '../../../services/users/changePassword'
import { getErrorStatus } from '../../../utils'
import styles from '../../FormPage.module.css'

const empty = { current: '', next: '', confirm: '' }

type Field = keyof typeof empty
// Values are i18n keys, translated when rendered
type Errors = Partial<Record<Field, string>>

const validate = (form: typeof empty) => {
  const errors: Errors = {}

  if (!form.current) errors.current = 'auth.errors.passwordRequired'
  if (form.next.length < 8) errors.next = 'auth.errors.passwordShort'
  else if (form.next === form.current) errors.next = 'auth.errors.passwordSame'
  if (form.confirm !== form.next) errors.confirm = 'auth.errors.passwordMismatch'

  return errors
}

const ChangePassword = () => {
  const { t } = useTranslation()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const msg = (key?: string) => (key ? t(key) : undefined)

  const update = (field: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')
    setDone(false)

    const fieldErrors = validate(form)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length) return

    setLoading(true)
    try {
      await changePassword(form.current, form.next)
      setForm(empty)
      setDone(true)
    } catch (err) {
      // 401 is not expected here: the axios instance would treat it as an expired session
      const status = getErrorStatus(err)

      setFormError(
        status === 400 || status === 403 ? 'auth.errors.wrongPassword' : 'auth.errors.generic'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <Card>
        <div className={styles.header}>
          <Title>{t('profile.password.title')}</Title>
          <Text variant="muted">{t('profile.password.subtitle')}</Text>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {done && <Alert variant="success">{t('profile.password.success')}</Alert>}
          {formError && <Alert variant="error">{t(formError)}</Alert>}

          <TextField
            label={t('profile.password.current')}
            type="password"
            autoComplete="current-password"
            value={form.current}
            error={msg(errors.current)}
            onChange={update('current')}
          />
          <TextField
            label={t('profile.password.new')}
            type="password"
            autoComplete="new-password"
            hint={t('auth.register.passwordHint')}
            value={form.next}
            error={msg(errors.next)}
            onChange={update('next')}
          />
          <TextField
            label={t('profile.password.confirm')}
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            error={msg(errors.confirm)}
            onChange={update('confirm')}
          />

          <Button type="submit" fullWidth loading={loading}>
            {t('profile.password.submit')}
          </Button>
        </form>

        <Text variant="small">
          <Trans i18nKey="profile.password.back" components={{ link: <Link to="/profile" /> }} />
        </Text>
      </Card>
    </main>
  )
}

export default ChangePassword
