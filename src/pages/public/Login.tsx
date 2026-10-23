import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { isAxiosError } from 'axios'
import { Alert, Button, Card, Link, Text, TextField, Title } from '../../atoms'
import login from '../../services/auth/login'
import styles from './Login.module.css'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?[0-9\s.-]{8,}$/

interface Errors {
  identifier?: string
  password?: string
}

const validate = (identifier: string, password: string) => {
  const errors: Errors = {}

  if (!identifier) errors.identifier = 'Enter your email or phone number'
  else if (!EMAIL.test(identifier) && !PHONE.test(identifier))
    errors.identifier = 'Enter a valid email or phone number'

  if (!password) errors.password = 'Enter your password'

  return errors
}

const Login = () => {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')

    const fieldErrors = validate(identifier.trim(), password)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length) return

    setLoading(true)
    try {
      await login(identifier.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      const status = isAxiosError(err) ? err.response?.status : undefined
      setFormError(
        status === 401 ? 'Wrong email, phone or password.' : 'Something went wrong. Try again.'
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
            placeholder="you@mail.com"
            value={identifier}
            error={errors.identifier}
            onChange={(e) => {
              setIdentifier(e.target.value)
              setErrors({ ...errors, identifier: undefined })
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
                setErrors({ ...errors, password: undefined })
              }}
            />
            <Link to="/forgot-password" variant="muted">
              Forgot password?
            </Link>
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
