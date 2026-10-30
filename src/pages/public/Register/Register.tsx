import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Alert, Button, Card, Checkbox, Link, Text, TextField, Title } from '../../../atoms'
import register from '../../../services/auth/register'
import { getErrorStatus, normalizeIdentifier, validateIdentifier } from '../../../utils'
import styles from './Register.module.css'

const empty = { firstName: '', lastName: '', identifier: '', password: '' }

type Field = keyof typeof empty
type Errors = Partial<Record<Field | 'terms', string>>

const validate = (form: typeof empty, terms: boolean) => {
  const errors: Errors = {}

  if (!form.firstName) errors.firstName = 'Enter your first name'
  if (!form.lastName) errors.lastName = 'Enter your last name'

  errors.identifier = validateIdentifier(form.identifier)

  if (form.password.length < 8) errors.password = 'At least 8 characters'
  if (!terms) errors.terms = 'You must accept the terms'

  return errors
}

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

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
        getErrorStatus(err) === 409
          ? 'An account already exists with this email or phone.'
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
          <Title>Create an account</Title>
          <Text variant="muted">Join Moozo to organise or attend events.</Text>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {formError && <Alert variant="error">{formError}</Alert>}

          <div className={styles.row}>
            <TextField
              label="First name"
              autoComplete="given-name"
              value={form.firstName}
              error={errors.firstName}
              onChange={update('firstName')}
            />
            <TextField
              label="Last name"
              autoComplete="family-name"
              value={form.lastName}
              error={errors.lastName}
              onChange={update('lastName')}
            />
          </div>

          <TextField
            label="Email or phone"
            autoComplete="username"
            value={form.identifier}
            error={errors.identifier}
            onChange={update('identifier')}
          />

          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            hint="At least 8 characters"
            value={form.password}
            error={errors.password}
            onChange={update('password')}
          />

          {/* TODO: let the user pick organizer or provider, providers need admin validation (see specs) */}
          <Checkbox
            // TODO: add links to terms and privacy policy
            label="I accept the terms of use and the privacy policy"
            checked={terms}
            error={errors.terms}
            onChange={(e) => {
              setTerms(e.target.checked)
              setErrors((prev) => ({ ...prev, terms: undefined }))
            }}
          />

          <Button type="submit" fullWidth loading={loading}>
            Create account
          </Button>
        </form>

        <Text variant="small">
          Already have an account? <Link to="/login">Log in</Link>
        </Text>
      </Card>
    </main>
  )
}

export default Register
