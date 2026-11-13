import { useState, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Alert, Button, Link, Text, TextField } from '../../../atoms'
import forgotPassword from '../../../services/auth/forgotPassword'
import { getErrorStatus, normalizeIdentifier, validateIdentifier } from '../../../utils'
import FormPage from '../../../templates/FormPage/FormPage'
import { Form } from '../../../molecules'

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
    <FormPage title={t('auth.forgot.title')} subtitle={t('auth.forgot.subtitle')}>
      <Form onSubmit={handleSubmit}>
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
      </Form>

      <Text variant="small">
        <Trans i18nKey="auth.forgot.back" components={{ a: <Link to="/login" /> }} />
      </Text>
    </FormPage>
  )
}

export default ForgotPassword
