import { useState, type ChangeEvent, type FormEvent } from "react"
import { Trans, useTranslation } from "react-i18next"
import { Navigate, useLocation, useNavigate } from "react-router"
import { Alert, Button, Link, Text, TextField } from "../../../atoms"
import resetPassword from "../../../services/auth/resetPassword"
import { getErrorStatus, hasErrors } from "../../../utils"
import FormPage from "../../../templates/FormPage/FormPage"
import { Form } from "../../../molecules"

const empty = { code: "", password: "", confirm: "" }

type Field = keyof typeof empty
// Values are i18n keys, translated when rendered
type Errors = Partial<Record<Field, string>>

const validate = (form: typeof empty) => {
  const errors: Errors = {}

  if (!form.code) errors.code = "auth.errors.codeRequired"
  if (form.password.length < 8) errors.password = "auth.errors.passwordShort"
  if (form.confirm !== form.password) errors.confirm = "auth.errors.passwordMismatch"

  return errors
}

const ResetPassword = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const identifier: string | undefined = state?.identifier
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)

  const msg = (key?: string) => (key ? t(key) : undefined)

  const update = (field: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  // The identifier only travels in the navigation state, so a direct visit starts over
  if (!identifier) return <Navigate to="/forgot-password" replace />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")

    const data = { ...form, code: form.code.trim() }
    const fieldErrors = validate(data)
    setErrors(fieldErrors)
    if (hasErrors(fieldErrors)) return

    setLoading(true)
    try {
      await resetPassword(identifier, data.code, data.password)
      void navigate("/login", { replace: true, state: { passwordReset: true } })
    } catch (err) {
      const status = getErrorStatus(err)

      setFormError(
        status === 400 || status === 422 ? "auth.errors.codeInvalid" : "auth.errors.generic"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormPage title={t("auth.reset.title")} subtitle={t("auth.reset.subtitle")}>
      <Form onSubmit={handleSubmit}>
        {formError && <Alert variant="error">{t(formError)}</Alert>}

        <TextField
          label={t("auth.reset.code")}
          inputMode="numeric"
          autoComplete="one-time-code"
          value={form.code}
          error={msg(errors.code)}
          onChange={update("code")}
        />
        <TextField
          label={t("auth.reset.password")}
          type="password"
          autoComplete="new-password"
          hint={t("auth.register.passwordHint")}
          value={form.password}
          error={msg(errors.password)}
          onChange={update("password")}
        />
        <TextField
          label={t("auth.reset.confirm")}
          type="password"
          autoComplete="new-password"
          value={form.confirm}
          error={msg(errors.confirm)}
          onChange={update("confirm")}
        />

        <Button type="submit" fullWidth loading={loading}>
          {t("auth.reset.submit")}
        </Button>
      </Form>

      <Text variant="small">
        <Trans i18nKey="auth.forgot.back" components={{ a: <Link to="/login" /> }} />
      </Text>
    </FormPage>
  )
}

export default ResetPassword
