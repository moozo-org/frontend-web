import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Alert, Button, Card, Link, Text, TextField, Title } from '../../../atoms'
import login from '../../../services/auth/login'
import getMe from '../../../services/users/me'
import { getErrorStatus, homeFor, normalizeIdentifier, validateIdentifier } from '../../../utils'
import styles from './Login.module.css'

interface Errors {
  identifier?: string
  password?: string
}

const validate = (identifier: string, password: string) => {
  const errors: Errors = {}

  errors.identifier = validateIdentifier(identifier)

  if (!password) errors.password = 'Enter your password'

  return errors
}

const Login = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')

    const id = normalizeIdentifier(identifier)
    const fieldErrors = validate(id, password)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length) return

    setLoading(true)
    try {
      await login(id, password)
      const { role } = await getMe()
      navigate(state?.from ?? homeFor(role), { replace: true })
    } catch (err) {
      setFormError(
        getErrorStatus(err) === 401
          ? 'Wrong email, phone or password.'
          : 'Something went wrong. Try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <Card>
        <div className={styles.header}>
          <Title>Log in</Title>
          <Text variant="muted">Welcome back to Moozo.</Text>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {formError && <Alert variant="error">{formError}</Alert>}

          <TextField
            label="Email or phone"
            autoComplete="username"
            value={identifier}
            error={errors.identifier}
            onChange={(e) => {
              setIdentifier(e.target.value)
              setErrors((prev) => ({ ...prev, identifier: undefined }))
            }}
          />

          <div className={styles.password}>
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              error={errors.password}
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
            Log in
          </Button>
        </form>

        <Text variant="small">
          No account yet? <Link to="/register">Create one</Link>
        </Text>
      </Card>
    </main>
  )
}

export default Login
