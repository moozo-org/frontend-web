import { useState, type FormEvent } from "react"
import { Trans, useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import { Alert, Button, Link, Text, TextField } from "../../../atoms"
import { useAuth } from "../../../hooks/useAuth"
import { getErrorStatus, normalizeIdentifier, validateIdentifier, hasErrors } from "../../../utils"
import { Form } from "../../../molecules"
import FormPage from "../../../templates/FormPage/FormPage"

interface Errors {
  identifier?: string
  password?: string
}

const validate = (identifier: string, password: string) => {
  const errors: Errors = {}

  errors.identifier = validateIdentifier(identifier)

  if (!password) errors.password = "auth.errors.passwordRequired"

  return errors
}

const Login = () => {
  const { t } = useTranslation()
  const { state } = useLocation()
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)

  const msg = (key?: string) => (key ? t(key) : undefined)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")

    const id = normalizeIdentifier(identifier)
    const fieldErrors = validate(id, password)
    setErrors(fieldErrors)
    if (hasErrors(fieldErrors)) return

    setLoading(true)
    try {
      // On success the route guard redirects, see RequireAnonymous
      await login(id, password)
    } catch (err) {
      const status = getErrorStatus(err)

      // TODO: the API sends 403 for both pending and banned accounts, split them once it says which
      setFormError(
        status === 401
          ? "auth.errors.wrongCredentials"
          : status === 403
            ? "auth.errors.inactiveAccount"
            : "auth.errors.generic"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormPage title={t("auth.login.title")} subtitle={t("auth.login.subtitle")}>
      <Form onSubmit={handleSubmit}>
        {state?.passwordReset && <Alert variant="success">{t("auth.login.passwordReset")}</Alert>}
        {formError && <Alert variant="error">{t(formError)}</Alert>}

        <TextField
          label={t("auth.login.identifier")}
          autoComplete="username"
          value={identifier}
          error={msg(errors.identifier)}
          onChange={(e) => {
            setIdentifier(e.target.value)
            setErrors((prev) => ({ ...prev, identifier: undefined }))
          }}
        />

        <TextField
          label={t("auth.login.password")}
          type="password"
          autoComplete="current-password"
          value={password}
          error={msg(errors.password)}
          onChange={(e) => {
            setPassword(e.target.value)
            setErrors((prev) => ({ ...prev, password: undefined }))
          }}
        />
        <Link to="/forgot-password" variant="muted">
          {t("auth.login.forgot")}
        </Link>

        <Button type="submit" fullWidth loading={loading}>
          {t("auth.login.submit")}
        </Button>
      </Form>

      <Text variant="small">
        <Trans i18nKey="auth.login.noAccount" components={{ a: <Link to="/register" /> }} />
      </Text>
    </FormPage>
  )
}

export default Login
