const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?\d{8,15}$/

export const normalizeIdentifier = (value: string) => {
  const trimmed = value.trim()
  return EMAIL.test(trimmed) ? trimmed : trimmed.replace(/[\s.-]/g, '')
}

// Returns an i18n key, the page translates it
export const validateIdentifier = (identifier: string) => {
  if (!identifier) return 'auth.errors.identifierRequired'
  if (!EMAIL.test(identifier) && !PHONE.test(identifier)) return 'auth.errors.identifierInvalid'
}
