import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { Alert, Button, Card, Text, TextField, Title } from '../../../atoms'
import { useAuth } from '../../../hooks/useAuth'
import resendCode from '../../../services/auth/resendCode'
import { getErrorStatus, homeFor } from '../../../utils'
import styles from '../../FormPage.module.css'

const RESEND_DELAY = 30

const VerifyAccount = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { status, role, verify } = useAuth()
  const identifier: string | undefined = state?.identifier
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [resent, setResent] = useState(false)
  const [loading, setLoading] = useState(false)
  // Register just sent a code, so the first resend has to wait too
  const [cooldown, setCooldown] = useState(RESEND_DELAY)

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  // The identifier only travels in the navigation state, so a direct visit has nothing to verify
  if (!identifier) return <Navigate to="/login" replace />
  if (status === 'authenticated') return <Navigate to={homeFor(role)} replace />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')
    setResent(false)

    const trimmed = code.trim()
    if (!trimmed) return setError('auth.errors.codeRequired')

    setLoading(true)
    try {
      const userRole = await verify(identifier, trimmed)
      navigate(homeFor(userRole), { replace: true })
    } catch (err) {
      setFormError(
        getErrorStatus(err) === 400 || getErrorStatus(err) === 422
          ? 'auth.errors.codeInvalid'
          : 'auth.errors.generic'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setFormError('')
    setResent(false)

    try {
      await resendCode(identifier)
      setResent(true)
      setCooldown(RESEND_DELAY)
    } catch {
      setFormError('auth.errors.generic')
    }
  }

  return (
    <main className={styles.page}>
      <Card>
        <div className={styles.header}>
          <Title>{t('auth.verify.title')}</Title>
          <Text variant="muted">{t('auth.verify.subtitle', { identifier })}</Text>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {resent && <Alert variant="success">{t('auth.verify.resent')}</Alert>}
          {formError && <Alert variant="error">{t(formError)}</Alert>}

          <TextField
            label={t('auth.verify.code')}
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            error={error ? t(error) : undefined}
            onChange={(e) => {
              setCode(e.target.value)
              setError('')
            }}
          />

          <Button type="submit" fullWidth loading={loading}>
            {t('auth.verify.submit')}
          </Button>
          <Button variant="ghost" fullWidth disabled={cooldown > 0} onClick={handleResend}>
            {cooldown > 0
              ? t('auth.verify.resendIn', { seconds: cooldown })
              : t('auth.verify.resend')}
          </Button>
        </form>
      </Card>
    </main>
  )
}

export default VerifyAccount
