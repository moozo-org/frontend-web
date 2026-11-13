import { useState, type ChangeEvent, type FormEvent } from "react"
import { Trans, useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Alert, Button, Checkbox, Link, Text, TextField } from "../../atoms"
import { FieldRow, Form, RoleTabs } from "../../molecules"
import register from "../../services/auth/register"
import registerProvider from "../../services/auth/registerProvider"
import FormPage from "../../templates/FormPage/FormPage"
import { getErrorStatus, hasErrors, normalizeIdentifier, validateRegistration } from "../../utils"

const empty = { firstName: "", lastName: "", companyName: "", identifier: "", password: "" }

type Field = keyof typeof empty

// Organizer and provider share the whole form, the provider adds a company and documents
const RegisterForm = ({ provider = false }: { provider?: boolean }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const ns = provider ? "auth.provider" : "auth.register"
  const [form, setForm] = useState(empty)
  const [documents, setDocuments] = useState<File[]>([])
  const [terms, setTerms] = useState(false)
  // Values are i18n keys, translated when rendered
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)

  const msg = (key?: string) => (key ? t(key) : undefined)
  const clear = (field: string) => setErrors((prev) => ({ ...prev, [field]: undefined }))

  const update = (field: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    clear(field)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")

    const { companyName, ...base } = {
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      companyName: form.companyName.trim(),
      identifier: normalizeIdentifier(form.identifier),
    }
    const fieldErrors = validateRegistration(
      provider ? { ...base, companyName } : base,
      terms,
      provider ? documents : undefined
    )
    setErrors(fieldErrors)
    if (hasErrors(fieldErrors)) return

    setLoading(true)
    try {
      await (provider ? registerProvider({ ...base, companyName, documents }) : register(base))
      navigate("/verify-account", { replace: true, state: { identifier: base.identifier } })
    } catch (err) {
      setFormError(
        getErrorStatus(err) === 409 ? "auth.errors.accountExists" : "auth.errors.generic"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormPage title={t(`${ns}.title`)} subtitle={t(`${ns}.subtitle`)} tabs={<RoleTabs />}>
      <Form onSubmit={handleSubmit}>
        {formError && <Alert variant="error">{t(formError)}</Alert>}

        <FieldRow>
          <TextField
            label={t("auth.register.firstName")}
            autoComplete="given-name"
            value={form.firstName}
            error={msg(errors.firstName)}
            onChange={update("firstName")}
          />
          <TextField
            label={t("auth.register.lastName")}
            autoComplete="family-name"
            value={form.lastName}
            error={msg(errors.lastName)}
            onChange={update("lastName")}
          />
        </FieldRow>

        {provider && (
          <TextField
            label={t("auth.provider.company")}
            autoComplete="organization"
            value={form.companyName}
            error={msg(errors.companyName)}
            onChange={update("companyName")}
          />
        )}

        <TextField
          label={t("auth.register.identifier")}
          autoComplete="username"
          value={form.identifier}
          error={msg(errors.identifier)}
          onChange={update("identifier")}
        />

        <TextField
          label={t("auth.register.password")}
          type="password"
          autoComplete="new-password"
          hint={t("auth.register.passwordHint")}
          value={form.password}
          error={msg(errors.password)}
          onChange={update("password")}
        />

        {provider && (
          <TextField
            label={t("auth.provider.documents")}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            hint={t("auth.provider.documentsHint")}
            error={msg(errors.documents)}
            onChange={(e) => {
              setDocuments(Array.from(e.target.files ?? []))
              clear("documents")
            }}
          />
        )}

        <Checkbox
          // TODO: add links to terms and privacy policy
          label={t("auth.register.terms")}
          checked={terms}
          error={msg(errors.terms)}
          onChange={(e) => {
            setTerms(e.target.checked)
            clear("terms")
          }}
        />

        <Button type="submit" fullWidth loading={loading}>
          {t(`${ns}.submit`)}
        </Button>
      </Form>

      <Text variant="small">
        <Trans i18nKey="auth.register.haveAccount" components={{ a: <Link to="/login" /> }} />
      </Text>
    </FormPage>
  )
}

export default RegisterForm
