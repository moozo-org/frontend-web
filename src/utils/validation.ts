const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?\d{8,15}$/

export const normalizeIdentifier = (value: string) => {
  const trimmed = value.trim()
  return EMAIL.test(trimmed) ? trimmed : trimmed.replace(/[\s.-]/g, "")
}

export const validateIdentifier = (identifier: string) => {
  if (!identifier) return "auth.errors.identifierRequired"
  if (!EMAIL.test(identifier) && !PHONE.test(identifier)) return "auth.errors.identifierInvalid"
}

interface RegistrationData {
  firstName: string
  lastName: string
  identifier: string
  password: string
  companyName?: string
}

export const validateRegistration = (
  form: RegistrationData,
  terms: boolean,
  documents?: File[]
) => {
  const errors: Partial<Record<string, string>> = {}

  if (!form.firstName) errors.firstName = "auth.errors.firstNameRequired"
  if (!form.lastName) errors.lastName = "auth.errors.lastNameRequired"
  if (form.companyName === "") errors.companyName = "auth.errors.companyRequired"

  errors.identifier = validateIdentifier(form.identifier)

  if (form.password.length < 8) errors.password = "auth.errors.passwordShort"
  if (documents && !documents.length) errors.documents = "auth.errors.documentsRequired"
  if (!terms) errors.terms = "auth.errors.termsRequired"

  return errors
}

export const hasErrors = (errors: object) => Object.values(errors).some(Boolean)
